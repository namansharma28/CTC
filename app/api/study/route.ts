import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('new');

    const studyPosts = await db.collection('study_posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform data for frontend
    const transformedPosts = studyPosts.map(post => ({
      id: post._id.toString(),
      title: post.title || 'Untitled',
      content: post.content || '',
      type: post.type || 'announcement',
      subject: post.subject,
      semester: post.semester,
      difficulty: post.difficulty,
      estimatedTime: post.estimatedTime,
      prerequisites: post.prerequisites,
      learningOutcomes: post.learningOutcomes,
      attachments: post.attachments || [],
      date: post.createdAt || new Date().toISOString(),
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || new Date().toISOString(),
      community: {
        name: 'Study Resources',
        handle: 'study-resources',
        avatar: 'https://github.com/shadcn.png'
      },
      tags: post.tags ? post.tags.split(',').map((tag: string) => tag.trim()) : ['study', post.type || 'announcement']
    }));

    return NextResponse.json({
      success: true,
      data: transformedPosts
    });
  } catch (error) {
    console.error('Error fetching study posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch study posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to create study posts (only operators and admins)
    const userRole = (session.user as any).role;
    const canCreateStudy = userRole === 'operator' || userRole === 'admin';

    if (!canCreateStudy) {
      return NextResponse.json(
        { error: 'Forbidden: Only operators and admins can create study posts' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      content,
      type,
      subject,
      semester,
      tags,
      difficulty,
      estimatedTime,
      prerequisites,
      learningOutcomes,
      attachments
    } = body;

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('new');

    const newPost = {
      title,
      content,
      type,
      subject: subject || null,
      semester: semester || null,
      tags: tags || null,
      difficulty: difficulty || null,
      estimatedTime: estimatedTime || null,
      prerequisites: prerequisites || null,
      learningOutcomes: learningOutcomes || null,
      attachments: attachments || [],
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('study_posts').insertOne(newPost);

    const createdPost = {
      id: result.insertedId.toString(),
      ...newPost,
      date: newPost.createdAt,
      community: {
        name: 'Study Resources',
        handle: 'study-resources',
        avatar: 'https://github.com/shadcn.png'
      },
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : ['study', type]
    };

    return NextResponse.json(createdPost);
  } catch (error) {
    console.error('Error creating study post:', error);
    return NextResponse.json(
      { error: 'Failed to create study post' },
      { status: 500 }
    );
  }
}