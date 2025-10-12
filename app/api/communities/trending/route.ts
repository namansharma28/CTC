import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('CTC');

    // Fetch trending communities (sorted by member count and recent activity)
    const communities = await db.collection('communities')
      .find({ status: 'active' })
      .sort({ 
        followersCount: -1, 
        membersCount: -1,
        createdAt: -1 
      })
      .limit(10)
      .toArray();

    // Transform the data for the frontend
    const transformedCommunities = await Promise.all(
      communities.map(async (community) => {
        // Get member count
        const membersCount = community.members ? community.members.length : 0;
        
        // Check user relation if session exists
        let userRelation = null;
        if (session?.user?.id) {
          const userId = session.user.id;
          if (community.admins && community.admins.includes(userId)) {
            userRelation = 'admin';
          } else if (community.members && community.members.includes(userId)) {
            userRelation = 'member';
          } else {
            // Check if user is following
            const isFollowing = await db.collection('follows').findOne({
              followerId: userId,
              followingId: community._id.toString(),
              type: 'community'
            });
            userRelation = isFollowing ? 'following' : null;
          }
        }

        return {
          _id: community._id.toString(),
          name: community.name,
          handle: community.handle,
          description: community.description,
          avatar: community.avatar,
          isVerified: community.isVerified || false,
          membersCount,
          followersCount: community.followersCount || 0,
          userRelation,
          createdAt: community.createdAt
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: transformedCommunities
    });
  } catch (error: any) {
    console.error('Error fetching trending communities:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch trending communities' 
      },
      { status: 500 }
    );
  }
}