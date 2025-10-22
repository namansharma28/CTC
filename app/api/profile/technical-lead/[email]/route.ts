import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);
    
    const client = await clientPromise;
    const db = client.db('CTC');
    
    // Find the technical lead user
    const user = await db.collection('users').findOne({ 
      email: email,
      role: 'technical_lead'
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Technical Lead not found' }, { status: 404 });
    }

    // Get referral statistics
    const referralStats = await db.collection('form_submissions').aggregate([
      {
        $match: {
          technicalLeadEmail: email
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
          technicalLeadEmail: email
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
      technicalLeadEmail: email
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

    const stats = referralStats[0] || { totalReferrals: 0, thisMonth: 0 };

    const publicProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio || 'Technical Lead helping students discover amazing events',
      role: user.role,
      createdAt: user.createdAt,
      stats: {
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
      }
    };

    return NextResponse.json(publicProfile);
  } catch (error) {
    console.error('Error fetching technical lead profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}