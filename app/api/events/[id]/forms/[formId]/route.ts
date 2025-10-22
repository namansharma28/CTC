import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string; formId: string } }
) {
  try {
    // Allow non-logged-in users to view form data
    const session = await getServerSession(authOptions);

    if (!ObjectId.isValid(params.formId) || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid form ID or event ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CTC");

    // Verify that the event exists
    const event = await db.collection("events").findOne({
      _id: new ObjectId(params.id),
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Get the form - try both string and ObjectId eventId for compatibility
    let form = await db.collection("forms").findOne({
      _id: new ObjectId(params.formId),
      eventId: params.id,
    });

    // If not found with string eventId, try with ObjectId eventId
    if (!form) {
      form = await db.collection("forms").findOne({
        _id: new ObjectId(params.formId),
        eventId: new ObjectId(params.id),
      });
    }

    if (!form) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    // Get form responses
    const responses = await db.collection("formResponses").aggregate([
      {
        $match: {
          formId: new ObjectId(params.formId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          formId: 1,
          userId: 1,
          answers: 1,
          shortlisted: 1,
          checkedIn: 1,
          checkedInAt: 1,
          createdAt: 1,
          user: {
            name: "$user.name",
            email: "$user.email"
          }
        }
      }
    ]).toArray();

    // Transform the form data to match the frontend interface
    const transformedForm = {
      id: form._id.toString(),
      title: form.title,
      description: form.description,
      fields: form.fields.map((field: any) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options,
        fileTypes: field.fileTypes,
        maxFileSize: field.maxFileSize,
      })),
      responses: responses.map((response: any) => ({
        id: response._id.toString(),
        formId: response.formId.toString(),
        userId: response.userId.toString(),
        user: response.user || { name: "Unknown User", email: "No email" },
        answers: response.answers,
        shortlisted: response.shortlisted || false,
        checkedIn: response.checkedIn || false,
        checkedInAt: response.checkedInAt,
        createdAt: response.createdAt,
      })),
      createdAt: form.createdAt,
    };

    return NextResponse.json(transformedForm);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const { title, description, fields } = await request.json();

    if (!ObjectId.isValid(params.formId) || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid form ID or event ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CTC");

    // Verify that the event exists and user has permission
    const event = await db.collection("events").findOne({
      _id: new ObjectId(params.id),
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Get community to check permissions
    const community = await db.collection('communities').findOne({ 
      _id: new ObjectId(event.communityId) 
    });

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    // Check if user can edit forms (admin, creator, or member)
    const isAdmin = community.admins.includes(session.user.id);
    const isCreator = event.creatorId === session.user.id;
    const isMember = community.members.includes(session.user.id);

    if (!isAdmin && !isCreator && !isMember) {
      return NextResponse.json({ error: 'Not authorized to edit forms' }, { status: 403 });
    }

    // Update the form
    const result = await db.collection("forms").updateOne(
      {
        _id: new ObjectId(params.formId),
        eventId: params.id,
      },
      {
        $set: {
          title,
          description,
          fields,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: params.formId,
      title,
      description,
      fields,
    });
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    if (!ObjectId.isValid(params.formId) || !ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid form ID or event ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("CTC");

    // Verify that the event exists and user has permission
    const event = await db.collection("events").findOne({
      _id: new ObjectId(params.id),
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Get community to check permissions
    const community = await db.collection('communities').findOne({ 
      _id: new ObjectId(event.communityId) 
    });

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    // Check if user can delete forms (admin or creator)
    const isAdmin = community.admins.includes(session.user.id);
    const isCreator = event.creatorId === session.user.id;

    if (!isAdmin && !isCreator) {
      return NextResponse.json({ error: 'Not authorized to delete forms' }, { status: 403 });
    }

    // Delete form responses first
    await db.collection("formResponses").deleteMany({
      formId: new ObjectId(params.formId),
    });

    // Delete the form
    const result = await db.collection("forms").deleteOne({
      _id: new ObjectId(params.formId),
      eventId: params.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}