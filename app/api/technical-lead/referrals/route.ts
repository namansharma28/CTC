import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'technical_lead') {
      return NextResponse.json({ error: 'Access denied. Technical Lead role required.' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('new');

    // Calculate this month's date range
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get all referrals made by this TL
    const allReferrals = await db.collection('form_responses')
      .find({
        referredBy: session.user.email
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Get this month's referrals
    const thisMonthReferrals = allReferrals.filter(referral =>
      new Date(referral.createdAt) >= currentMonth
    );

    // Calculate top events
    const eventReferralCounts = allReferrals.reduce((acc, referral) => {
      const eventId = referral.eventId;
      if (!acc[eventId]) {
        acc[eventId] = {
          eventId,
          eventTitle: referral.eventTitle || 'Unknown Event',
          referrals: 0
        };
      }
      acc[eventId].referrals++;
      return acc;
    }, {} as Record<string, any>);

    const topEvents = Object.values(eventReferralCounts)
      .sort((a: any, b: any) => b.referrals - a.referrals)
      .slice(0, 5);

    // Get recent referrals (last 10)
    const recentReferrals = allReferrals
      .slice(0, 10)
      .map(referral => ({
        id: referral._id.toString(),
        eventTitle: referral.eventTitle || 'Unknown Event',
        eventId: referral.eventId,
        userName: referral.userName || 'Anonymous',
        createdAt: referral.createdAt,
        formTitle: referral.formTitle || 'Registration Form'
      }));

    const stats = {
      totalReferrals: allReferrals.length,
      thisMonth: thisMonthReferrals.length,
      topEvents,
      recentReferrals,
      technicalLeadEmail: session.user.email
    };

    return NextResponse.json(stats);

  } catch (error: any) {
    console.error('Error fetching TL referral stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral statistics' },
      { status: 500 }
    );
  }
}
