import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');
    
    // Handle admin user
    if (session.user.id === 'admin') {
      return NextResponse.json([]);
    }

    // Get user
    const user = await db.collection('users').findOne({ 
      $or: [
        { email: session.user.email },
        { _id: new ObjectId(session.user.id) }
      ]
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get events where user is registered/attending
    const events = await db.collection('events').aggregate([
      {
        $match: {
          $or: [
            { attendees: user._id },
            { createdBy: user._id }
          ]
        }
      },
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
        $addFields: {
          status: {
            $cond: {
              if: { $gte: [{ $dateFromString: { dateString: '$date' } }, new Date()] },
              then: 'upcoming',
              else: 'past'
            }
          },
          userRegistered: {
            $in: [user._id, { $ifNull: ['$attendees', []] }]
          }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          date: 1,
          time: 1,
          location: 1,
          image: 1,
          status: 1,
          userRegistered: 1,
          community: {
            name: '$community.name',
            handle: '$community.handle',
            avatar: '$community.avatar'
          }
        }
      },
      {
        $sort: { date: -1 }
      }
    ]).toArray();

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}