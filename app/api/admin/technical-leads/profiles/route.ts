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
    if (userRole !== 'operator' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Operator or Admin role required.' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');

    // Get all Technical Leads with their profile information
    const technicalLeads = await db.collection('users')
      .find({ 
        role: 'technical_lead' 
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate date ranges
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const currentWeek = new Date();
    currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
    currentWeek.setHours(0, 0, 0, 0);

    // Get all referrals
    const allReferrals = await db.collection('form_responses')
      .find({ 
        referredBy: { $ne: 'none' }
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Process each Technical Lead
    const processedTLs = await Promise.all(
      technicalLeads.map(async (tl) => {
        const tlEmail = tl.email;
        
        // Get referrals for this TL
        const tlReferrals = allReferrals.filter(referral => referral.referredBy === tlEmail);
        
        // Calculate time-based stats
        const thisMonthReferrals = tlReferrals.filter(referral => 
          new Date(referral.createdAt) >= currentMonth
        );
        
        const thisWeekReferrals = tlReferrals.filter(referral => 
          new Date(referral.createdAt) >= currentWeek
        );

        // Calculate top events
        const eventReferralCounts = tlReferrals.reduce((acc, referral) => {
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

        // Get recent referrals
        const recentReferrals = tlReferrals
          .slice(0, 10)
          .map(referral => ({
            id: referral._id.toString(),
            eventTitle: referral.eventTitle || 'Unknown Event',
            eventId: referral.eventId,
            userName: referral.userName || 'Anonymous',
            createdAt: referral.createdAt,
            formTitle: referral.formTitle || 'Registration Form'
          }));

        // Calculate monthly breakdown (last 6 months)
        const monthlyBreakdown = [];
        for (let i = 5; i >= 0; i--) {
          const monthStart = new Date();
          monthStart.setMonth(monthStart.getMonth() - i);
          monthStart.setDate(1);
          monthStart.setHours(0, 0, 0, 0);
          
          const monthEnd = new Date(monthStart);
          monthEnd.setMonth(monthEnd.getMonth() + 1);
          
          const monthReferrals = tlReferrals.filter(referral => {
            const referralDate = new Date(referral.createdAt);
            return referralDate >= monthStart && referralDate < monthEnd;
          });
          
          monthlyBreakdown.push({
            month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            referrals: monthReferrals.length
          });
        }

        // Find last activity (most recent referral or join date)
        const lastReferral = tlReferrals[0];
        const lastActive = lastReferral ? lastReferral.createdAt : null;

        return {
          id: tl._id.toString(),
          name: tl.name || 'Unknown',
          email: tl.email,
          avatar: tl.image,
          bio: tl.bio,
          location: tl.location,
          website: tl.website,
          joinedDate: tl.createdAt ? new Date(tl.createdAt).toISOString() : new Date().toISOString(),
          lastActive: lastActive ? new Date(lastActive).toISOString() : null,
          statistics: {
            totalReferrals: tlReferrals.length,
            thisMonth: thisMonthReferrals.length,
            thisWeek: thisWeekReferrals.length,
            topEvents,
            recentReferrals,
            monthlyBreakdown
          }
        };
      })
    );

    // Calculate summary statistics
    const totalReferrals = allReferrals.length;
    const thisMonthReferrals = allReferrals.filter(referral => 
      new Date(referral.createdAt) >= currentMonth
    ).length;
    
    const activeTLs = processedTLs.filter(tl => tl.statistics.totalReferrals > 0).length;

    const summary = {
      totalTLs: technicalLeads.length,
      activeTLs,
      totalReferrals,
      thisMonthReferrals
    };

    return NextResponse.json({
      technicalLeads: processedTLs,
      summary
    });

  } catch (error: any) {
    console.error('Error fetching TL profiles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch Technical Lead profiles' },
      { status: 500 }
    );
  }
}
