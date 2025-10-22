import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4'); // Changed default to 4

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

    // Get upcoming events (closest first)
    const today = new Date().toISOString().split('T')[0];

    const events = await db.collection('events')
      .aggregate([
        {
          $match: {
            $or: [
              { date: { $gte: today } },
              {
                isMultiDay: true,
                endDate: { $gte: today }
              }
            ]
          }
        },
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
        { $sort: { date: 1, time: 1 } }, // Sort by date ascending to get closest events first
        { $limit: limit * 5 } // Get more events to filter from
      ])
      .toArray();

    // If user has no communities or follows, show all upcoming events
    const allRelevantCommunityIds = Array.from(new Set([...userCommunityIds, ...followedCommunityIds]));

    // Filter events based on user's relationship and transform
    const filteredEvents = events
      .filter(event => {
        const community = event.community[0];
        if (!community) return false;

        // If user has no communities or follows, show all events
        if (allRelevantCommunityIds.length === 0) return true;

        const communityId = community._id.toString();
        const isMember = userCommunityIds.includes(communityId);
        const isFollower = followedCommunityIds.includes(communityId);
        const isAdmin = community.admins && community.admins.includes(session.user.id);
        const userRegistered = event.userRegistration.length > 0;

        return isMember || isFollower || isAdmin || userRegistered;
      })
      .slice(0, limit)
      .map(event => {
        const community = event.community[0];
        const userRegistered = event.userRegistration.length > 0;

        return {
          _id: event._id.toString(),
          id: event._id.toString(),
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          image: event.image,
          userRegistered,
          community: {
            id: community._id.toString(),
            name: community.name,
            handle: community.handle,
            avatar: community.avatar,
          },
          registrationCount: event.registrationCount[0]?.count || 0,
        };
      });

    return NextResponse.json(filteredEvents);
  } catch (error: any) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}