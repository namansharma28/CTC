import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * DELETE /api/admin/communities/delete/[id]
 * 
 * Permanently deletes a community and all associated data.
 * This action:
 * - Deletes the community document
 * - Removes all associated events
 * - Removes all community updates
 * - Removes community from users' following/member lists
 * - Sends notifications to all community members
 * 
 * Requires admin authentication.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if the user is an admin
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid community ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');

    // Find the community first to get its details
    const community = await db.collection('communities').findOne({
      _id: new ObjectId(params.id)
    });

    if (!community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    // Start a transaction to ensure data consistency
    const session_db = client.startSession();
    
    try {
      await session_db.withTransaction(async () => {
        // Delete the community
        await db.collection('communities').deleteOne({
          _id: new ObjectId(params.id)
        });

        // Delete all events associated with this community
        await db.collection('events').deleteMany({
          communityId: params.id
        });

        // Delete all updates associated with this community
        await db.collection('updates').deleteMany({
          communityId: params.id
        });

        // Remove community from users' following lists
        await db.collection('users').updateMany(
          { following: params.id },
          { $pull: { following: params.id } } as any
        );

        // Remove community from users' communities lists (if they were members)
        await db.collection('users').updateMany(
          { communities: params.id },
          { $pull: { communities: params.id } } as any
        );

        // Create notifications for community members
        if (community.members && community.members.length > 0) {
          const notifications = community.members.map((memberId: string) => ({
            userId: memberId,
            title: 'Community Deleted',
            description: `The community "${community.name}" has been permanently deleted by an administrator.`,
            type: 'community',
            read: false,
            createdAt: new Date(),
          }));

          await db.collection('notifications').insertMany(notifications);
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Community deleted successfully'
      });
    } finally {
      await session_db.endSession();
    }
  } catch (error: any) {
    console.error('Error deleting community:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete community' },
      { status: 500 }
    );
  }
}