import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface NotificationData {
  userId?: string;
  userEmail?: string;
  role?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  actionUrl?: string;
  actionText?: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'operator' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Operator or Admin role required.' }, { status: 403 });
    }

    const data: NotificationData = await request.json();
    const { userId, userEmail, role, title, message, type, actionUrl, actionText } = data;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('CTC');

    let targetUsers: any[] = [];

    // Determine target users
    if (userId) {
      // Send to specific user by ID
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (user) targetUsers = [user];
    } else if (userEmail) {
      // Send to specific user by email
      const user = await db.collection('users').findOne({ email: userEmail });
      if (user) targetUsers = [user];
    } else if (role) {
      // Send to all users with specific role
      targetUsers = await db.collection('users').find({ role }).toArray();
    } else {
      // Send to all users
      targetUsers = await db.collection('users').find({}).toArray();
    }

    if (targetUsers.length === 0) {
      return NextResponse.json(
        { error: 'No target users found' },
        { status: 404 }
      );
    }

    // Create notifications for each target user
    const notifications = targetUsers.map(user => ({
      userId: user._id.toString(),
      userEmail: user.email,
      title,
      message,
      type,
      actionUrl,
      actionText,
      read: false,
      createdAt: new Date(),
      sentBy: session.user.email
    }));

    // Insert notifications
    const result = await db.collection('notifications').insertMany(notifications);

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${targetUsers.length} user(s)`,
      notificationsSent: result.insertedCount,
      targetUsers: targetUsers.map(u => ({ id: u._id.toString(), email: u.email, role: u.role }))
    });

  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Helper function to send notifications (can be imported by other APIs)
export async function sendNotification(data: NotificationData) {
  try {
    const client = await clientPromise;
    const db = client.db('CTC');

    let targetUsers: any[] = [];

    if (data.userId) {
      const user = await db.collection('users').findOne({ _id: new ObjectId(data.userId) });
      if (user) targetUsers = [user];
    } else if (data.userEmail) {
      const user = await db.collection('users').findOne({ email: data.userEmail });
      if (user) targetUsers = [user];
    } else if (data.role) {
      targetUsers = await db.collection('users').find({ role: data.role }).toArray();
    } else {
      targetUsers = await db.collection('users').find({}).toArray();
    }

    if (targetUsers.length === 0) {
      return { success: false, error: 'No target users found' };
    }

    const notifications = targetUsers.map(user => ({
      userId: user._id.toString(),
      userEmail: user.email,
      title: data.title,
      message: data.message,
      type: data.type,
      actionUrl: data.actionUrl,
      actionText: data.actionText,
      read: false,
      createdAt: new Date(),
      sentBy: 'system'
    }));

    const result = await db.collection('notifications').insertMany(notifications);

    return {
      success: true,
      notificationsSent: result.insertedCount,
      targetUsers: targetUsers.length
    };

  } catch (error: any) {
    console.error('Error in sendNotification helper:', error);
    return { success: false, error: error.message };
  }
}
