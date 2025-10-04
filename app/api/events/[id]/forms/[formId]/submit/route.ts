import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendNotification } from "@/app/api/notifications/send/route";

export async function POST(
  request: Request,
  { params }: { params: { id: string; formId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { answers, referredBy, referralCode } = await request.json();

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(params.formId) || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid form ID or event ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CTC");

    // Verify that the form exists and belongs to the event
    const form = await db.collection("forms").findOne({
      _id: new ObjectId(params.formId),
      eventId: params.id,
    });

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    // Check if user already submitted this form
    const existingResponse = await db.collection("formResponses").findOne({
      formId: new ObjectId(params.formId),
      userId: new ObjectId(session.user.id),
    });

    if (existingResponse) {
      return NextResponse.json(
        { error: "You have already submitted this form" },
        { status: 400 }
      );
    }

    // Get event and form details for referral tracking
    const event = await db.collection("events").findOne({
      _id: new ObjectId(params.id)
    });

    // Create the form response with referral data
    const response = await db.collection("formResponses").insertOne({
      formId: new ObjectId(params.formId),
      eventId: new ObjectId(params.id),
      userId: new ObjectId(session.user.id),
      answers,
      shortlisted: false,
      checkedIn: false,
      // Referral tracking data
      referredBy: referredBy || 'none',
      referralCode: referralCode || null,
      // Additional data for referral statistics
      userName: session.user.name,
      userEmail: session.user.email,
      eventTitle: event?.title || 'Unknown Event',
      formTitle: form.title || 'Registration Form',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Store in separate collection for easier referral analytics
    if (referredBy && referredBy !== 'none') {
      await db.collection("form_responses").insertOne({
        _id: response.insertedId,
        formId: new ObjectId(params.formId),
        eventId: params.id,
        userId: new ObjectId(session.user.id),
        referredBy,
        referralCode,
        userName: session.user.name,
        userEmail: session.user.email,
        eventTitle: event?.title || 'Unknown Event',
        formTitle: form.title || 'Registration Form',
        createdAt: new Date(),
      });
    }

    // If this is an RSVP form, also create an event registration
    if (form.isRSVPForm) {
      // Check if user already registered for the event
      const existingRegistration = await db.collection('eventRegistrations').findOne({
        eventId: new ObjectId(params.id),
        userId: new ObjectId(session.user.id),
      });

      if (!existingRegistration) {
        await db.collection('eventRegistrations').insertOne({
          eventId: new ObjectId(params.id),
          userId: new ObjectId(session.user.id),
          userName: session.user.name,
          userEmail: session.user.email,
          registrationType: 'form',
          formResponseId: response.insertedId,
          createdAt: new Date(),
        });
      }
    }

    // Send notifications
    try {
      // Notify the user about successful registration
      await sendNotification({
        userEmail: session.user.email!,
        title: form.isRSVPForm ? "Event Registration Confirmed" : "Form Submitted Successfully",
        message: `You have successfully ${form.isRSVPForm ? 'registered for' : 'submitted the form for'} "${event?.title || 'the event'}".`,
        type: 'success',
        actionUrl: `/events/${params.id}`,
        actionText: 'View Event'
      });

      // If referred by a Technical Lead, notify them about the successful referral
      if (referredBy && referredBy !== 'none') {
        await sendNotification({
          userEmail: referredBy,
          title: "Referral Success!",
          message: `${session.user.name} has registered for "${event?.title || 'an event'}" through your referral link.`,
          type: 'success',
          actionUrl: `/technical-lead/dashboard`,
          actionText: 'View Dashboard'
        });
      }

      // Notify event organizers about new registration
      if (event?.creatorId) {
        const eventCreator = await db.collection('users').findOne({ _id: new ObjectId(event.creatorId) });
        if (eventCreator) {
          await sendNotification({
            userEmail: eventCreator.email,
            title: "New Event Registration",
            message: `${session.user.name} has registered for your event "${event.title}".`,
            type: 'info',
            actionUrl: `/events/${params.id}`,
            actionText: 'View Event'
          });
        }
      }
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Don't fail the form submission if notifications fail
    }

    return NextResponse.json({
      id: response.insertedId,
      message: form.isRSVPForm ? "Successfully registered for the event!" : "Form submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}