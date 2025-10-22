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
      const userProfile = {
        id: 'admin',
        name: 'System Administrator',
        email: session.user.email,
        image: session.user.image,
        bio: 'System Administrator',
        location: null,
        website: null,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        role: 'admin',
        stats: {
          communitiesOwned: 0,
          communitiesJoined: 0,
          eventsCreated: 0,
          eventsAttended: 0,
          followersCount: 0,
          followingCount: 0
        }
      };
      return NextResponse.json(userProfile);
    }

    // Get user profile
    const user = await db.collection('users').findOne({ 
      $or: [
        { email: session.user.email },
        { _id: new ObjectId(session.user.id) }
      ]
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user stats
    const [communitiesOwned, communitiesJoined, eventsCreated, eventsAttended] = await Promise.all([
      db.collection('communities').countDocuments({ 
        $or: [
          { createdBy: user._id },
          { admins: user._id }
        ]
      }),
      db.collection('communities').countDocuments({ 
        members: user._id,
        createdBy: { $ne: user._id },
        admins: { $ne: user._id }
      }),
      db.collection('events').countDocuments({ createdBy: user._id }),
      db.collection('events').countDocuments({ attendees: user._id })
    ]);

    // Get followers/following counts (if you have a follows collection)
    const followersCount = await db.collection('follows').countDocuments({ following: user._id });
    const followingCount = await db.collection('follows').countDocuments({ follower: user._id });

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      location: user.location,
      website: user.website,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      role: user.role,
      stats: {
        communitiesOwned,
        communitiesJoined,
        eventsCreated,
        eventsAttended,
        followersCount,
        followingCount
      }
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}