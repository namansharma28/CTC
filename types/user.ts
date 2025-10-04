export type UserRole = 'user' | 'ctc_student' | 'technical_lead' | 'operator' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    bio?: string;
    location?: string;
    website?: string;
    joinedAt: Date;
    role?: UserRole;
    communities?: string[];
    following?: string[];
    followers?: string[];
  }
  
  export interface UserProfile extends User {
    eventsAttending?: string[];
    eventsOrganizing?: string[];
    totalEvents?: number;
  }