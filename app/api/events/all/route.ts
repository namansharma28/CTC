import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

// Mock data for events in case database connection fails
const mockEvents = [
  {
    _id: "event1",
    title: "Tech Conference 2023",
    description: "Annual technology conference with workshops and networking",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    time: "10:00 AM - 5:00 PM",
    location: "Convention Center, Downtown",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    eventType: "offline",
    attendees: ["user1", "user2", "user3"],
    community: {
      _id: "community1",
      name: "Tech Enthusiasts",
      handle: "tech-enthusiasts",
      avatar: "https://ui-avatars.com/api/?name=Tech+Enthusiasts&background=random"
    }
  },
  {
    _id: "event2",
    title: "Web Development Workshop",
    description: "Learn the latest web development techniques and tools",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    time: "2:00 PM - 4:00 PM",
    location: "Online",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    eventType: "online",
    attendees: ["user1", "user4", "user5"],
    community: {
      _id: "community2",
      name: "Web Devs",
      handle: "web-devs",
      avatar: "https://ui-avatars.com/api/?name=Web+Devs&background=random"
    }
  },
  {
    _id: "event3",
    title: "AI Meetup",
    description: "Discussion about the latest advancements in artificial intelligence",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 21 days from now
    time: "6:00 PM - 8:00 PM",
    location: "Innovation Hub, Tech District",
    image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=2069&auto=format&fit=crop",
    eventType: "offline",
    attendees: ["user2", "user3", "user6"],
    community: {
      _id: "community3",
      name: "AI Innovators",
      handle: "ai-innovators",
      avatar: "https://ui-avatars.com/api/?name=AI+Innovators&background=random"
    }
  },
  {
    _id: "event4",
    title: "Data Science Webinar",
    description: "Learn about data analysis and visualization techniques",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    time: "1:00 PM - 3:00 PM",
    location: "Online",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    eventType: "online",
    attendees: ["user1", "user4", "user7"],
    community: {
      _id: "community4",
      name: "Data Scientists",
      handle: "data-scientists",
      avatar: "https://ui-avatars.com/api/?name=Data+Scientists&background=random"
    }
  },
  {
    _id: "event5",
    title: "Mobile App Development Workshop",
    description: "Hands-on workshop for building mobile applications",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days ago
    time: "10:00 AM - 4:00 PM",
    location: "Tech Campus, Building B",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
    eventType: "offline",
    attendees: ["user2", "user5", "user8"],
    community: {
      _id: "community5",
      name: "Mobile Developers",
      handle: "mobile-devs",
      avatar: "https://ui-avatars.com/api/?name=Mobile+Developers&background=random"
    }
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    try {
      // Connect to the database using clientPromise
      const client = await clientPromise;
      const db = client.db('new');
      
      // Fetch events from the database
      const events = await db.collection('events')
        .aggregate([
          {
            $lookup: {
              from: 'communities',
              let: { communityId: { $toObjectId: '$communityId' } },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$communityId'] } } }
              ],
              as: 'community'
            }
          },
          {
            $unwind: {
              path: "$community",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              date: 1,
              time: 1,
              location: 1,
              eventType: 1,
              image: 1,
              attendees: 1,
              "community._id": 1,
              "community.name": 1,
              "community.handle": 1,
              "community.avatar": 1
            }
          }
        ])
        .toArray();
      
      // Transform events to match frontend expectations
      const transformedEvents = events.map(event => ({
        _id: event._id.toString(),
        id: event._id.toString(),
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        eventType: event.eventType || 'offline',
        image: event.image,
        attendees: event.attendees || [],
        creatorId: event.creatorId,
        community: event.community ? {
          id: event.community._id?.toString(),
          name: event.community.name,
          handle: event.community.handle,
          avatar: event.community.avatar
        } : null
      }));
      
      return NextResponse.json(transformedEvents);
    } catch (error) {
      console.error("Database error:", error);
      // Return mock data if database connection fails
      return NextResponse.json(mockEvents);
    }
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(mockEvents);
  }
}
