import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('CTC');
    
    // Get all TNP posts (filter out posts with passed deadlines)
    const today = new Date();
    const tnpPosts = await db.collection('tnp_posts').find({
      $or: [
        { deadline: { $gte: today } },
        { deadline: { $exists: false } },
        { deadline: null }
      ]
    })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedPosts = tnpPosts.map(post => ({
      id: post._id,
      title: post.title,
      content: post.content,
      category: post.category || 'general', // 'placement', 'internship', 'general', etc.
      tags: post.tags || [],
      attachments: post.attachments || [],
      image: post.image,
      date: post.createdAt,
      community: post.community || {
        name: 'TNP Cell',
        handle: 'tnp',
        avatar: null
      },
      author: post.author
    }));

    return NextResponse.json({
      success: true,
      data: formattedPosts
    });
  } catch (error) {
    console.error('Error fetching TNP posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch TNP posts'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create TNP posts
    const userRole = (session.user as any)?.role;
    if (userRole !== 'operator' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Only operators and admins can create TNP posts.' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, category, tags, attachments, image } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');

    const newPost = {
      title,
      content,
      category: category || 'general',
      tags: tags || [],
      attachments: attachments || [],
      image: image || null,
      author: {
        name: session.user.name,
        email: session.user.email,
        id: session.user.id
      },
      community: {
        name: 'TNP Cell',
        handle: 'tnp',
        avatar: null
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('tnp_posts').insertOne(newPost);

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertedId,
        ...newPost
      }
    });
  } catch (error) {
    console.error('Error creating TNP post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create TNP post'
    }, { status: 500 });
  }
}