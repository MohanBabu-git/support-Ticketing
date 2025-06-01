export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  avatar?: string;
}

export type AuthUser = User | null;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export type TicketStatus = 'open' | 'in_progress' | 'resolved';

export type TicketPriority = 'low' | 'medium' | 'high';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isAdmin: boolean;
  attachments: Attachment[];
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userEmail: string;
  assignedToId?: string;
  assignedToName?: string;
  comments: Comment[];
  attachments: Attachment[];
}

export interface NewTicket {
  title: string;
  description: string;
  priority: TicketPriority;
  attachments: File[];
}

export interface NewComment {
  content: string;
  attachments: File[];
}

export interface TicketStatusUpdate {
  status: TicketStatus;
}

export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}