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
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('new');

    // Search in events
    const events = await db.collection('events')
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      })
      .project({ _id: 1, title: 1, communityId: 1, date: 1 })
      .limit(5)
      .toArray();

    // Search in communities
    const communities = await db.collection('communities')
      .find({
        $and: [
          {
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { handle: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
            ]
          },
          {
            $or: [
              { status: 'active' },
              { status: { $exists: false } }
            ]
          }
        ]
      })
      .project({ _id: 1, name: 1, handle: 1 })
      .limit(5)
      .toArray();

    // Search in TNP posts
    const tnpPosts = await db.collection('tnp_posts')
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
        ],
      })
      .project({ _id: 1, title: 1, company: 1, type: 1 })
      .limit(5)
      .toArray();

    // Search in study posts
    const studyPosts = await db.collection('study_posts')
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
        ],
      })
      .project({ _id: 1, title: 1, tags: 1 })
      .limit(5)
      .toArray();

    // Get user's communities
    const userCommunities = await db.collection('communities')
      .find({ members: session.user.id })
      .project({ _id: 1 })
      .toArray();

    const communityIds = userCommunities.map(c => c._id);

    // Get events from user's communities
    const eventCommunities = communityIds.length > 0
      ? await db.collection('communities')
          .find({ _id: { $in: communityIds.map(id => new ObjectId(id)) } })
          .project({ _id: 1, name: 1, handle: 1 })
          .toArray()
      : [];

    // Transform results
    const results = {
      events: events.map(event => ({
        id: event._id.toString(),
        _id: event._id.toString(),
        title: event.title,
        type: 'event',
        date: event.date ? new Date(event.date).toLocaleDateString() : null,
        communityId: event.communityId?.toString()
      })),
      communities: communities.map(community => ({
        id: community._id.toString(),
        title: community.name,
        type: 'community',
        handle: community.handle,
      })),
      tnp: tnpPosts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        type: 'tnp',
        company: post.company,
        jobType: post.type
      })),
      study: studyPosts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        type: 'study',
        tags: post.tags || []
      }))
    };

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search' },
      { status: 500 }
    );
  }
}
