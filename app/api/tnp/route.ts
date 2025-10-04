import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendNotification } from '@/app/api/notifications/send/route';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('CTC');

    const tnpPosts = await db.collection('tnp_posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform data for frontend
    const transformedPosts = tnpPosts.map(post => ({
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
      date: post.createdAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      community: {
        name: 'Training & Placement Cell',
        handle: 'tnp-cell',
        avatar: 'https://github.com/shadcn.png'
      },
      tags: post.tags || ['tnp', post.type]
    }));

    return NextResponse.json({
      success: true,
      data: transformedPosts
    });
  } catch (error) {
    console.error('Error fetching TNP posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch TNP posts' },
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

    // Check if user has permission to create TNP posts (only operators and admins)
    const userRole = (session.user as any).role;
    const canCreateTNP = userRole === 'operator' || userRole === 'admin';

    if (!canCreateTNP) {
      return NextResponse.json(
        { error: 'Forbidden: Only operators and admins can create TNP posts' },
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

    const newPost = {
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
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [type, 'tnp']
    };

    const result = await db.collection('tnp_posts').insertOne(newPost);

    const createdPost = {
      id: result.insertedId.toString(),
      ...newPost,
      date: newPost.createdAt,
      community: {
        name: 'Training & Placement Cell',
        handle: 'tnp-cell',
        avatar: 'https://github.com/shadcn.png'
      }
    };

    // Send notification to all CTC students about new TNP opportunity
    try {
      await sendNotification({
        role: 'ctc_student',
        title: `New ${type === 'job' ? 'Job' : type === 'internship' ? 'Internship' : 'TNP'} Opportunity`,
        message: `${title} at ${company || 'a company'} has been posted. ${deadline ? `Application deadline: ${new Date(deadline).toLocaleDateString()}` : ''}`,
        type: 'info',
        actionUrl: '/tnp',
        actionText: 'View Opportunity'
      });
    } catch (notificationError) {
      console.error('Error sending TNP notification:', notificationError);
      // Don't fail the post creation if notifications fail
    }

    return NextResponse.json(createdPost);
  } catch (error) {
    console.error('Error creating TNP post:', error);
    return NextResponse.json(
      { error: 'Failed to create TNP post' },
      { status: 500 }
    );
  }
}
