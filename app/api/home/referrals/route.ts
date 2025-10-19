import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('new');

    // Calculate this month's date range
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get all referrals from this month
    const thisMonthReferrals = await db.collection('form_responses')
      .find({
        createdAt: { $gte: currentMonth },
        referredBy: { $ne: 'none' }
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Group by Technical Lead to get monthly leaderboard
    const tlReferralCounts = thisMonthReferrals.reduce((acc, referral) => {
      const tlEmail = referral.referredBy;
      if (!acc[tlEmail]) {
        acc[tlEmail] = {
          email: tlEmail,
          count: 0,
          name: referral.userName || 'Unknown', // This will be overwritten with TL name
          recentReferrals: []
        };
      }
      acc[tlEmail].count++;
      acc[tlEmail].recentReferrals.push({
        userName: referral.userName,
        eventTitle: referral.eventTitle,
        eventId: referral.eventId,
        createdAt: referral.createdAt
      });
      return acc;
    }, {} as Record<string, any>);

    // Get TL names from users collection
    const tlEmails = Object.keys(tlReferralCounts);
    const tlUsers = await db.collection('users')
      .find({
        email: { $in: tlEmails },
        role: 'technical_lead'
      })
      .toArray();

    // Update TL data with correct names and avatars
    tlUsers.forEach(user => {
      if (tlReferralCounts[user.email]) {
        tlReferralCounts[user.email].name = user.name;
        tlReferralCounts[user.email].avatar = user.image;
      }
    });

    // Create leaderboard (top 5 TLs this month)
    const leaderboard = Object.values(tlReferralCounts)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5)
      .map((tl: any, index) => ({
        rank: index + 1,
        name: tl.name,
        email: tl.email,
        avatar: tl.avatar,
        referrals: tl.count
      }));

    // Get recent referrals (last 10 across all TLs)
    const recentReferrals = thisMonthReferrals
      .slice(0, 10)
      .map(referral => {
        const tlData = tlUsers.find(user => user.email === referral.referredBy);
        return {
          id: referral._id.toString(),
          userName: referral.userName || 'Anonymous',
          eventTitle: referral.eventTitle || 'Unknown Event',
          eventId: referral.eventId,
          technicalLead: {
            name: tlData?.name || 'Unknown TL',
            email: referral.referredBy,
            avatar: tlData?.image
          },
          createdAt: referral.createdAt,
          formTitle: referral.formTitle || 'Registration Form'
        };
      });

    // Get overall stats
    const totalReferralsThisMonth = thisMonthReferrals.length;
    const activeTLsThisMonth = Object.keys(tlReferralCounts).length;

    return NextResponse.json({
      leaderboard,
      recentReferrals,
      stats: {
        totalReferralsThisMonth,
        activeTLsThisMonth,
        totalTLs: tlUsers.length
      }
    });

  } catch (error: any) {
    console.error('Error fetching home referral data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}
