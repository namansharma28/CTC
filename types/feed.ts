export interface FeedItem {
  id: string;
  _id?: string;
  type: "event" | "update" | "study" | "tnp";
  title: string;
  content: string;
  community?: {
    name: string;
    handle: string;
    avatar: string;
  } | null;
  date: string;
  eventDate?: string;
  eventId?: string;
  eventTitle?: string;
  image?: string;
  tags?: string[];
  // Event specific fields
  time?: string;
  location?: string;
  eventType?: 'online' | 'offline' | 'hybrid';
  attendees?: string[];
  capacity?: number;
  maxAttendees?: number;
}

export interface StudyPost {
  id: string;
  title: string;
  content: string;
  community: {
    name: string;
    handle: string;
    avatar: string;
  };
  date: string;
  image?: string;
  tags?: string[];
}

export interface TNPPost {
  id: string;
  title: string;
  content: string;
  community: {
    name: string;
    handle: string;
    avatar: string;
  };
  date: string;
  image?: string;
  tags?: string[];
}