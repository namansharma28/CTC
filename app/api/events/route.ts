import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('CTC');

    // Fetch all events with community information
    const events = await db.collection('events').aggregate([
      {
        $lookup: {
          from: 'communities',
          localField: 'communityId',
          foreignField: '_id',
          as: 'community'
        }
      },
      {
        $unwind: {
          path: '$community',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray();

    // Transform the data for the frontend
    const transformedEvents = events.map(event => ({
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      capacity: event.maxCapacity,
      maxAttendees: event.maxCapacity,
      registrations: event.registrations?.length || 0,
      status: event.status || 'active',
      createdAt: event.createdAt,
      eventType: event.eventType || 'offline',
      creatorId: event.creatorId,
      community: event.community ? {
        id: event.community._id?.toString(),
        name: event.community.name,
        handle: event.community.handle,
        avatar: event.community.avatar
      } : null,
      tags: event.tags || [],
      attendees: event.attendees || [],
      interested: event.interested || []
    }));

    return NextResponse.json({ events: transformedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}