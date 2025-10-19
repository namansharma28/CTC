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
    
    const post = await db.collection('tnp_posts')
      .findOne({ _id: new ObjectId(params.id) });

    if (!post) {
      return NextResponse.json(
        { error: 'TNP post not found' },
        { status: 404 }
      );
    }

    // Transform data for frontend
    const transformedPost = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      type: post.type,
      company: post.company,
      deadline: post.deadline,
      requirements: post.requirements,
      applicationLink: post.applicationLink,
      salary: post.salary,
      location: post.location,
      attachments: post.attachments || [],
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error fetching TNP post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TNP post' },
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

    // Check if user has permission to edit TNP posts (only operators and admins)
    const userRole = (session.user as any).role;
    const canEditTNP = userRole === 'operator' || userRole === 'admin';
    
    if (!canEditTNP) {
      return NextResponse.json(
        { error: 'Forbidden: Only operators and admins can edit TNP posts' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, content, type, company, deadline, requirements, applicationLink, salary, location, attachments } = body;

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
      company: company || null,
      deadline: deadline || null,
      requirements: requirements || null,
      applicationLink: applicationLink || null,
      salary: salary || null,
      location: location || null,
      attachments: attachments || [],
      updatedAt: new Date(),
    };

    const result = await db.collection('tnp_posts').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'TNP post not found' },
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
    console.error('Error updating TNP post:', error);
    return NextResponse.json(
      { error: 'Failed to update TNP post' },
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

    // Check if user has permission to delete TNP posts (only operators and admins)
    const userRole = (session.user as any).role;
    const canDeleteTNP = userRole === 'operator' || userRole === 'admin';
    
    if (!canDeleteTNP) {
      return NextResponse.json(
        { error: 'Forbidden: Only operators and admins can delete TNP posts' },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db('CTC');

    const result = await db.collection('tnp_posts').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'TNP post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting TNP post:', error);
    return NextResponse.json(
      { error: 'Failed to delete TNP post' },
      { status: 500 }
    );
  }
}