import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('CTC');
    
    const post = await db.collection('study_posts')
      .findOne({ _id: new ObjectId(params.id) });

    if (!post) {
      return NextResponse.json(
        { error: 'Study post not found' },
        { status: 404 }
      );
    }

    // Extract cover image from attachments
    const attachments = post.attachments || [];
    const imageAttachments = attachments.filter((file: any) => file.type && file.type.startsWith('image/'));
    const coverImage = imageAttachments.length > 0 ? imageAttachments[0].url : null;

    // Transform data for frontend
    const transformedPost = {
      _id: post._id,
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      type: post.type,
      subject: post.subject,
      semester: post.semester,
      tags: post.tags,
      difficulty: post.difficulty,
      estimatedTime: post.estimatedTime,
      prerequisites: post.prerequisites,
      learningOutcomes: post.learningOutcomes,
      attachments: attachments,
      image: coverImage,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author || {
        name: 'Study Team',
        email: 'study@college.edu'
      }
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error fetching study post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch study post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to edit study posts (only operators and admins)
    const userRole = (session.user as any).role;
    const canEditStudy = userRole === 'operator' || userRole === 'admin';
    
    if (!canEditStudy) {
      return NextResponse.json(
        { error: 'Forbidden: Only operators and admins can edit study posts' },
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
    const db = client.db('CTC');

    const updateData = {
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
      updatedAt: new Date(),
    };

    const result = await db.collection('study_posts').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Study post not found' },
        { status: 404 }
      );
    }

    const updatedPost = {
      id: params.id,
      ...updateData,
      createdAt: new Date(), // This would be fetched from DB in real implementation
    };

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating study post:', error);
    return NextResponse.json(
      { error: 'Failed to update study post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has permission to delete study posts (only operators and admins)
    const userRole = (session.user as any).role;
    const canDeleteStudy = userRole === 'operator' || userRole === 'admin';
    
    if (!canDeleteStudy) {
      return NextResponse.json(
        { error: 'Forbidden: Only operators and admins can delete study posts' },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db('CTC');

    const result = await db.collection('study_posts').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Study post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting study post:', error);
    return NextResponse.json(
      { error: 'Failed to delete study post' },
      { status: 500 }
    );
  }
}