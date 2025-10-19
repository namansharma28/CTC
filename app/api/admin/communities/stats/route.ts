import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verify } from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const headersList = headers();
    const authHeader = headersList.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verify(token, process.env.ADMIN_JWT_SECRET || 'admin-secret-key');
      if (!decoded || (decoded as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('new');

    // Get community stats - handle missing collections and fields gracefully
    const [
      totalCommunities,
      activeCommunities,
      pendingCommunities,
      rejectedCommunities,
      recentCommunities
    ] = await Promise.all([
      db.collection('communities').countDocuments({}).catch(() => 0),
      db.collection('communities').countDocuments({ status: 'active' }).catch(() => 0),
      db.collection('communities').countDocuments({ status: 'pending' }).catch(() => 0),
      db.collection('communities').countDocuments({ status: 'rejected' }).catch(() => 0),
      db.collection('communities')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .project({
          _id: 1,
          name: 1,
          handle: 1,
          status: 1,
          createdAt: 1
        })
        .toArray()
        .catch(() => [])
    ]);

    return NextResponse.json({
      totalCommunities,
      activeCommunities: activeCommunities, // Changed from 'approvedCommunities' to 'activeCommunities'
      pendingCommunities,
      rejectedCommunities,
      recentCommunities: recentCommunities.map(community => ({
        id: community._id.toString(),
        name: community.name || 'Unknown Community',
        handle: community.handle || 'unknown',
        status: community.status || 'active', // Default for older communities
        createdAt: community.createdAt || new Date().toISOString()
      }))
    });
  } catch (error: any) {
    console.error('Error fetching community stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch community stats' },
      { status: 500 }
    );
  }
}
