export interface FeedItem {
  id: string;
  type: "event" | "update" | "study" | "tnp";
  title: string;
  content: string;
  community: {
    name: string;
    handle: string;
    avatar: string;
  };
  date: string;
  eventDate?: string;
  eventId?: string;
  eventTitle?: string;
  image?: string;
  tags?: string[];
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