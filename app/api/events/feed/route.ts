import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }



    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('CTC');

    // Get user's communities (member and admin)
    const userCommunities = await db.collection('communities').find({
      $or: [
        { members: session.user.id },
        { admins: session.user.id }
      ]
    }).toArray();

    const userCommunityIds = userCommunities.map(c => c._id.toString());

    // Get communities user follows
    const followedCommunities = await db.collection('follows').find({
      userId: session.user.id
    }).toArray();

    const followedCommunityIds = followedCommunities.map(f => f.communityId);

    // Combine all relevant community IDs
    const allRelevantCommunityIds = Array.from(new Set([...userCommunityIds, ...followedCommunityIds]));

    // If user has no communities or follows, show all events as a fallback
    const today = new Date().toISOString().split('T')[0];
    let matchQuery: any = {
      $or: [
        { date: { $gte: today } },
        { date: { $exists: false } } // Include events without dates
      ]
    };
    
    if (allRelevantCommunityIds.length > 0) {
      matchQuery = {
        $and: [
          { communityId: { $in: allRelevantCommunityIds } },
          {
            $or: [
              { date: { $gte: today } },
              { date: { $exists: false } }
            ]
          }
        ]
      };
    }

    // Get total count for pagination
    const totalEvents = await db.collection('events').countDocuments(matchQuery);


    // Get events from user's communities and followed communities (or all events if no communities)
    const events = await db.collection('events')
      .aggregate([
        { $match: matchQuery },
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
          $lookup: {
            from: 'eventRegistrations',
            let: { eventId: '$_id' },
            pipeline: [
              { 
                $match: { 
                  $expr: { 
                    $and: [
                      { $eq: ['$eventId', '$$eventId'] },
                      { $eq: ['$userId', { $toObjectId: session.user.id }] }
                    ]
                  }
                }
              }
            ],
            as: 'userRegistration'
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray();



    // Transform the data for the frontend
    const transformedEvents = events.map(event => {
      const community = event.community[0];
      if (!community) return null;

      const communityId = community._id.toString();
      const isMember = userCommunityIds.includes(communityId);
      const isAdmin = community.admins && community.admins.includes(session.user.id);
      const isFollower = followedCommunityIds.includes(communityId);
      const userRegistered = event.userRegistration.length > 0;

      let userRelation = 'other';
      if (isAdmin) userRelation = 'admin';
      else if (isMember) userRelation = 'member';
      else if (isFollower) userRelation = 'follower';

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
        community: {
          id: community._id?.toString(),
          name: community.name,
          handle: community.handle,
          avatar: community.avatar
        },
        tags: event.tags || [],
        attendees: event.attendees || [],
        interested: event.interested || [],
        userRegistered,
        userRelation,
        type: 'event'
      };
    }).filter(Boolean);



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
  } catch (error: any) {
    console.error('Error fetching user events feed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events feed' },
      { status: 500 }
    );
  }
}