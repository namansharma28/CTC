import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('CTC');

    // Fetch all events with community information using the same method as calendar events
    const events = await db.collection('events').aggregate([
      {
        $lookup: {
          from: 'communities',
          let: { communityId: { $toObjectId: '$communityId' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$communityId'] } } }
          ],
          as: 'community'
        }
      },
      {
        $lookup: {
          from: 'eventRegistrations',
          let: { eventId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$eventId', '$$eventId'] } } },
            { $count: 'count' }
          ],
          as: 'registrationCount'
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]).toArray();

    // Transform the data for the frontend
    const transformedEvents = events.map(event => {
      const community = event.community[0];
      return {
        _id: event._id.toString(),
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        image: event.image,
        capacity: event.maxCapacity,
        maxAttendees: event.maxCapacity,
        registrations: event.registrationCount[0]?.count || 0,
        status: event.status || 'active',
        createdAt: event.createdAt,
        eventType: event.eventType || 'offline',
        creatorId: event.creatorId,
        community: community ? {
          id: community._id?.toString(),
          name: community.name,
          handle: community.handle,
          avatar: community.avatar
        } : null,
        tags: event.tags || [],
        attendees: event.attendees || [],
        interested: event.interested || []
      };
    });

    return NextResponse.json({ events: transformedEvents });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}