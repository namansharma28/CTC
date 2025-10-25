import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        session: null 
      }, { status: 401 });
    }

    // Get user from database
    const client = await clientPromise;
    const db = client.db('CTC');
    
    let dbUser = null;
    if (session.user.id !== 'admin') {
      dbUser = await db.collection('users').findOne({
        _id: new ObjectId(session.user.id)
      });
    }

    return NextResponse.json({
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: (session.user as any).role
        }
      },
      dbUser: dbUser ? {
        id: dbUser._id.toString(),
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role || 'user',
        createdAt: dbUser.createdAt
      } : null,
      isAdmin: (session.user as any).role === 'admin',
      isOperator: (session.user as any).role === 'operator',
      canAccessAdmin: ['admin', 'operator'].includes((session.user as any).role)
    });

  } catch (error: any) {
    console.error('Error checking user role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check user role' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { newRole } = await request.json();
    
    if (!['user', 'technical_lead', 'operator', 'admin'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Only allow admin users to change roles, or allow users to promote themselves to admin if no admin exists
    const client = await clientPromise;
    const db = client.db('CTC');
    
    const currentUserRole = (session.user as any).role;
    
    // Check if there are any admin users
    const adminCount = await db.collection('users').countDocuments({ role: 'admin' });
    
    if (currentUserRole !== 'admin' && adminCount > 0) {
      return NextResponse.json({ error: 'Only admin users can change roles' }, { status: 403 });
    }

    // Update user role
    if (session.user.id === 'admin') {
      return NextResponse.json({ error: 'Cannot change system admin role' }, { status: 400 });
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { 
        $set: { 
          role: newRole,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Role updated to ${newRole}`,
      newRole
    });

  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}