import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'operator' && userRole !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Operator or Admin role required.' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('CTC');
    
    // Get all technical leads
    const technicalLeads = await db.collection('users')
      .find({ role: 'technical_lead' })
      .sort({ createdAt: -1 })
      .toArray();

    // Get referral statistics for each TL
    const tlsWithStats = await Promise.all(
      technicalLeads.map(async (tl) => {
        // Get all form submissions where this TL was the referrer (using new structure)
        const referralResponses = await db.collection('form_submissions')
          .find({ technicalLeadId: tl._id.toString() })
          .sort({ createdAt: -1 })
          .toArray();

        // Calculate statistics
        const totalReferrals = referralResponses.length;
        
        // Calculate this month's referrals
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        
        const thisMonthReferrals = referralResponses.filter(response => 
          new Date(response.createdAt) >= currentMonth
        ).length;

        // Calculate this week's referrals
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const thisWeekReferrals = referralResponses.filter(response => 
          new Date(response.createdAt) >= oneWeekAgo
        ).length;

        // Group by event to get top performing events
        const eventReferrals = referralResponses.reduce((acc, response) => {
          const eventId = response.eventId;
          if (!acc[eventId]) {
            acc[eventId] = {
              eventId,
              count: 0,
              eventTitle: response.eventTitle || 'Unknown Event'
            };
          }
          acc[eventId].count++;
          return acc;
        }, {} as Record<string, { eventId: string; count: number; eventTitle: string }>);

        // Get top 3 events
        const topEvents = Object.values(eventReferrals)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map(event => ({
            eventId: event.eventId,
            eventTitle: event.eventTitle,
            referrals: event.count
          }));

        // Get recent referrals (last 5)
        const recentReferrals = referralResponses
          .slice(0, 5)
          .map(response => ({
            id: response._id.toString(),
            eventTitle: response.eventTitle || 'Unknown Event',
            eventId: response.eventId,
            userName: response.name || response.userName || 'Anonymous',
            createdAt: response.createdAt,
            formTitle: response.formTitle || 'Registration Form'
          }));

        return {
          id: tl._id.toString(),
          name: tl.name,
          email: tl.email,
          avatar: tl.image || null,
          joinedDate: tl.createdAt || new Date().toISOString(),
          lastActive: tl.lastLoginAt || tl.updatedAt || tl.createdAt,
          statistics: {
            totalReferrals,
            thisMonth: thisMonthReferrals,
            thisWeek: thisWeekReferrals,
            topEvents,
            recentReferrals
          }
        };
      })
    );

    // Sort by total referrals (most active first)
    tlsWithStats.sort((a, b) => b.statistics.totalReferrals - a.statistics.totalReferrals);

    return NextResponse.json({
      technicalLeads: tlsWithStats,
      summary: {
        totalTLs: tlsWithStats.length,
        activeTLs: tlsWithStats.filter(tl => tl.statistics.totalReferrals > 0).length,
        totalReferrals: tlsWithStats.reduce((sum, tl) => sum + tl.statistics.totalReferrals, 0),
        thisMonthReferrals: tlsWithStats.reduce((sum, tl) => sum + tl.statistics.thisMonth, 0)
      }
    });

  } catch (error: any) {
    console.error('Error fetching TL monitoring data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch technical leads data' },
      { status: 500 }
    );
  }
}
