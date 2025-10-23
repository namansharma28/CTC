import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('CTC');
    
    const post = await db.collection('tnp_posts').findOne({
      _id: new ObjectId(params.id)
    });

    if (!post) {
      return NextResponse.json({ error: 'TNP post not found' }, { status: 404 });
    }

    // Extract cover image from attachments if not directly set
    const attachments = post.attachments || [];
    const imageAttachments = attachments.filter((file: any) => file.type && file.type.startsWith('image/'));
    const coverImage = post.image || (imageAttachments.length > 0 ? imageAttachments[0].url : null);

    const formattedPost = {
      _id: post._id,
      id: post._id,
      title: post.title,
      content: post.content,
      company: post.company || '',
      location: post.location || '',
      type: post.type || post.category || 'announcement',
      salary: post.salary || '',
      deadline: post.deadline || '',
      requirements: post.requirements ? (Array.isArray(post.requirements) ? post.requirements : post.requirements.split('\n').filter(Boolean)) : [],
      applicationLink: post.applicationLink || '',
      tags: post.tags || [],
      attachments: attachments,
      image: coverImage,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author || {
        name: 'TNP Team',
        email: 'tnp@college.edu'
      }
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Error fetching TNP post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch TNP post'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete TNP posts
    const userRole = (session.user as any)?.role;
    if (userRole !== 'operator' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Only operators and admins can delete TNP posts.' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');
    
    const result = await db.collection('tnp_posts').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'TNP post not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'TNP post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting TNP post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete TNP post'
    }, { status: 500 });
  }
}