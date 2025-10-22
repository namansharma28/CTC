import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a technical lead
    const userRole = (session.user as any)?.role;
    if (userRole !== 'technical_lead') {
      return NextResponse.json({ error: 'Access denied. Technical Lead role required.' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');
    
    const userEmail = session.user.email;

    // Get referral statistics
    const referralStats = await db.collection('form_submissions').aggregate([
      {
        $match: {
          technicalLeadEmail: userEmail
        }
      },
      {
        $group: {
          _id: null,
          totalReferrals: { $sum: 1 },
          thisMonth: {
            $sum: {
              $cond: {
                if: {
                  $gte: [
                    '$createdAt',
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                  ]
                },
                then: 1,
                else: 0
              }
            }
          }
        }
      }
    ]).toArray();

    // Get top events by referrals
    const topEvents = await db.collection('form_submissions').aggregate([
      {
        $match: {
          technicalLeadEmail: userEmail
        }
      },
      {
        $group: {
          _id: '$eventId',
          referrals: { $sum: 1 },
          eventTitle: { $first: '$eventTitle' }
        }
      },
      {
        $sort: { referrals: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          eventId: '$_id',
          eventTitle: 1,
          referrals: 1,
          _id: 0
        }
      }
    ]).toArray();

    // Get recent referrals
    const recentReferrals = await db.collection('form_submissions').find({
      technicalLeadEmail: userEmail
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .project({
      _id: 1,
      eventTitle: 1,
      eventId: 1,
      name: 1,
      createdAt: 1,
      formTitle: 1
    })
    .toArray();

    const stats = referralStats[0] || { totalReferrals: 0, thisMonth: 0 };

    const response = {
      totalReferrals: stats.totalReferrals,
      thisMonth: stats.thisMonth,
      topEvents: topEvents,
      recentReferrals: recentReferrals.map(r => ({
        id: r._id,
        eventTitle: r.eventTitle,
        eventId: r.eventId,
        userName: r.name,
        createdAt: r.createdAt,
        formTitle: r.formTitle || 'Registration Form'
      }))
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}