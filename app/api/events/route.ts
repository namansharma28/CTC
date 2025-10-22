import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const skip = (page - 1) * limit;

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('CTC');

    // Get total count for pagination
    const totalEvents = await db.collection('events').countDocuments();

    // Fetch all events with community information
    const events = await db.collection('events').aggregate([
      {
        $lookup: {
          from: 'communities',
          let: { communityId: '$communityId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    '$_id',
                    {
                      $cond: {
                        if: { $type: '$$communityId' },
                        then: { $toObjectId: '$$communityId' },
                        else: '$$communityId'
                      }
                    }
                  ]
                }
              }
            }
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
      },
      { $skip: skip },
      { $limit: limit }
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
        capacity: event.capacity || event.maxCapacity,
        maxAttendees: event.capacity || event.maxCapacity,
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

    return NextResponse.json({
      events: transformedEvents,
      pagination: {
        page,
        limit,
        total: totalEvents,
        totalPages: Math.ceil(totalEvents / limit),
        hasNext: page < Math.ceil(totalEvents / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}