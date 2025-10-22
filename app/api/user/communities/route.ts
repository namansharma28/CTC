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

    // Get communities where user is admin/owner
    const ownedCommunities = await db.collection('communities').find({
      $or: [
        { createdBy: user._id },
        { admins: user._id }
      ]
    }).toArray();

    // Get communities where user is a member (but not admin)
    const joinedCommunities = await db.collection('communities').find({
      members: user._id,
      createdBy: { $ne: user._id },
      admins: { $ne: user._id }
    }).toArray();

    // Format the response
    const formatCommunity = (community: any, userRole: 'admin' | 'member') => ({
      _id: community._id,
      name: community.name,
      handle: community.handle,
      description: community.description,
      avatar: community.avatar,
      membersCount: community.members?.length || 0,
      isVerified: community.isVerified || false,
      userRole
    });

    const communities = [
      ...ownedCommunities.map(c => formatCommunity(c, 'admin')),
      ...joinedCommunities.map(c => formatCommunity(c, 'member'))
    ];

    return NextResponse.json(communities);
  } catch (error) {
    console.error('Error fetching user communities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}