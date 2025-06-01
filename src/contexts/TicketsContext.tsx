import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Ticket, NewTicket, NewComment, TicketStatusUpdate, TicketFilters } from '../types';
import { useAuth } from './AuthContext';
import { mockTickets } from '../data/mockData';

interface TicketsContextType {
  tickets: Ticket[];
  userTickets: Ticket[];
  loading: boolean;
  error: string | null;
  getTicket: (id: string) => Ticket | undefined;
  createTicket: (data: NewTicket) => Promise<Ticket>;
  updateTicketStatus: (id: string, update: TicketStatusUpdate) => Promise<Ticket>;
  addComment: (ticketId: string, comment: NewComment) => Promise<Ticket>;
  filterTickets: (filters: TicketFilters) => Ticket[];
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load tickets
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get tickets from localStorage or use mock data
        const savedTickets = localStorage.getItem('tickets');
        if (savedTickets) {
          setTickets(JSON.parse(savedTickets));
        } else {
          setTickets(mockTickets);
          localStorage.setItem('tickets', JSON.stringify(mockTickets));
        }
      } catch (err) {
        setError('Failed to load tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTickets();
  }, []);

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (tickets.length > 0) {
      localStorage.setItem('tickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  // Filter tickets for current user
  const userTickets = user 
    ? user.isAdmin 
      ? tickets 
      : tickets.filter(ticket => ticket.userId === user.id)
    : [];

  // Get a single ticket by ID
  const getTicket = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  // Create a new ticket
  const createTicket = async (data: NewTicket): Promise<Ticket> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) throw new Error('You must be logged in to create a ticket');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Process attachments (in a real app, these would be uploaded to a server)
      const processedAttachments = data.attachments.map(file => ({
        id: uuidv4(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type
      }));
      
      const newTicket: Ticket = {
        id: uuidv4(),
        title: data.title,
        description: data.description,
        status: 'open',
        priority: data.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        comments: [],
        attachments: processedAttachments
      };
      
      setTickets(prev => [newTicket, ...prev]);
      return newTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update ticket status
  const updateTicketStatus = async (id: string, update: TicketStatusUpdate): Promise<Ticket> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) throw new Error('You must be logged in');
      if (!user.isAdmin) throw new Error('Only support agents can update ticket status');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const ticketIndex = tickets.findIndex(t => t.id === id);
      
      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }
      
      const updatedTicket = {
        ...tickets[ticketIndex],
        status: update.status,
        updatedAt: new Date().toISOString()
      };
      
      const updatedTickets = [...tickets];
      updatedTickets[ticketIndex] = updatedTicket;
      
      setTickets(updatedTickets);
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a comment to a ticket
  const addComment = async (ticketId: string, comment: NewComment): Promise<Ticket> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user) throw new Error('You must be logged in to comment');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }
      
      // Process attachments (in a real app, these would be uploaded to a server)
      const processedAttachments = comment.attachments.map(file => ({
        id: uuidv4(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type
      }));
      
      const newComment = {
        id: uuidv4(),
        content: comment.content,
        createdAt: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        isAdmin: user.isAdmin,
        attachments: processedAttachments
      };
      
      const updatedTicket = {
        ...tickets[ticketIndex],
        comments: [...tickets[ticketIndex].comments, newComment],
        updatedAt: new Date().toISOString()
      };
      
      const updatedTickets = [...tickets];
      updatedTickets[ticketIndex] = updatedTicket;
      
      setTickets(updatedTickets);
      return updatedTicket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Filter tickets based on criteria
  const filterTickets = (filters: TicketFilters): Ticket[] => {
    let filteredTickets = [...userTickets];
    
    // Filter by status
    if (filters.status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === filters.status);
    }
    
    // Filter by priority
    if (filters.priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === filters.priority);
    }
    
    // Filter by search term (title or description)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(
        ticket => 
          ticket.title.toLowerCase().includes(searchTerm) || 
          ticket.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by date range
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filteredTickets = filteredTickets.filter(ticket => {
        const createdDate = new Date(ticket.createdAt);
        return createdDate >= new Date(start) && createdDate <= new Date(end);
      });
    }
    
    return filteredTickets;
  };

  return (
    <TicketsContext.Provider 
      value={{ 
        tickets, 
        userTickets, 
        loading, 
        error, 
        getTicket, 
        createTicket, 
        updateTicketStatus, 
        addComment,
        filterTickets
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
}