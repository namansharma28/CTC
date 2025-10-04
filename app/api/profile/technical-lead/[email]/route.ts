import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);
    
    const client = await clientPromise;
    const db = client.db('CTC');
    
    // First, verify this user exists and is a technical lead
    const user = await db.collection('users').findOne({ 
      email: email,
      role: 'technical_lead'
    });

    if (!user) {
      return NextResponse.json({ error: 'Technical Lead not found' }, { status: 404 });
    }

    // Get all form responses where this TL was the referrer
    const referralResponses = await db.collection('form_responses')
      .find({ referredBy: email })
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

    // Get top 5 events
    const topEvents = Object.values(eventReferrals)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(event => ({
        eventId: event.eventId,
        eventTitle: event.eventTitle,
        referrals: event.count
      }));

    // Get recent referrals with details (last 10)
    const recentReferrals = referralResponses
      .slice(0, 10)
      .map(response => ({
        id: response._id.toString(),
        eventTitle: response.eventTitle || 'Unknown Event',
        eventId: response.eventId,
        userName: response.userName || 'Anonymous',
        createdAt: response.createdAt,
        formTitle: response.formTitle || 'Registration Form'
      }));

    // Build profile response
    const profile = {
      email: user.email,
      name: user.name,
      avatar: user.image || null,
      totalReferrals,
      thisMonth: thisMonthReferrals,
      topEvents,
      recentReferrals,
      joinedDate: user.createdAt || new Date().toISOString()
    };

    return NextResponse.json(profile);

  } catch (error: any) {
    console.error('Error fetching TL profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}