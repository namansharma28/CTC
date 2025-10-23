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

    const formattedPosts = tnpPosts.map(post => {
      const attachments = post.attachments || [];
      const imageAttachments = attachments.filter((file: any) => file.type && file.type.startsWith('image/'));
      const coverImage = post.image || (imageAttachments.length > 0 ? imageAttachments[0].url : null);

      return {
        id: post._id,
        title: post.title,
        content: post.content,
        company: post.company || '',
        location: post.location || '',
        type: post.type || post.category || 'announcement',
        salary: post.salary || '',
        deadline: post.deadline || '',
        requirements: post.requirements || '',
        applicationLink: post.applicationLink || '',
        tags: post.tags || [],
        attachments: attachments,
        image: coverImage,
        date: post.createdAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        community: post.community || {
          name: 'TNP Cell',
          handle: 'tnp',
          avatar: null
        },
        author: post.author || {
          name: 'TNP Team',
          email: 'tnp@college.edu'
        }
      };
    });

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
    const { 
      title, 
      content, 
      type, 
      company, 
      location, 
      salary, 
      deadline, 
      requirements, 
      applicationLink, 
      attachments 
    } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');

    // Find the cover image from attachments
    const imageFiles = (attachments || []).filter((file: any) => file.type.startsWith('image/'));
    const coverImage = imageFiles.length > 0 ? imageFiles[0].url : null;

    const newPost = {
      title,
      content,
      type: type || 'announcement',
      company: company || '',
      location: location || '',
      salary: salary || '',
      deadline: deadline ? new Date(deadline) : null,
      requirements: requirements || '',
      applicationLink: applicationLink || '',
      tags: [],
      attachments: attachments || [],
      image: coverImage,
      author: {
        name: session.user.name,
        email: session.user.email,
        id: session.user.id
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