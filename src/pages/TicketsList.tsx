import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTickets } from '../contexts/TicketsContext';
import { PlusCircle, Search, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Ticket, TicketStatus, TicketPriority, TicketFilters } from '../types';
import { format } from 'date-fns';

interface TicketsListProps {
  isAdmin?: boolean;
}

function TicketsList({ isAdmin = false }: TicketsListProps) {
  const { userTickets, loading } = useTickets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Apply filters
  const filteredTickets = userTickets.filter((ticket) => {
    // Status filter
    if (statusFilter && ticket.status !== statusFilter) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter && ticket.priority !== priorityFilter) {
      return false;
    }
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return 0;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isAdmin ? 'All Tickets' : 'My Tickets'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {isAdmin 
              ? 'Manage and respond to all support tickets' 
              : 'View and manage your support tickets'}
          </p>
        </div>
        {!isAdmin && (
          <div className="mt-4 md:mt-0">
            <Link
              to="/tickets/new"
              className="btn btn-primary flex items-center space-x-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>New Ticket</span>
            </Link>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-row gap-2">
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TicketStatus | '')}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | '')}
              >
                <option value="">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <select
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'priority')}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {sortedTickets.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {sortedTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} isAdmin={isAdmin} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <Filter className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || priorityFilter
                ? 'Try adjusting your filters to find what you\'re looking for.'
                : 'Get started by creating a new support ticket.'}
            </p>
            {!isAdmin && !searchTerm && !statusFilter && !priorityFilter && (
              <div className="mt-6">
                <Link
                  to="/tickets/new"
                  className="btn btn-primary"
                >
                  New Ticket
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface TicketItemProps {
  ticket: Ticket;
  isAdmin: boolean;
}

function TicketItem({ ticket, isAdmin }: TicketItemProps) {
  return (
    <li key={ticket.id}>
      <Link to={`/tickets/${ticket.id}`} className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center justify-center h-8 w-8 rounded-full
                  ${ticket.status === 'open'
                    ? 'bg-primary-100 text-primary-600'
                    : ticket.status === 'in_progress'
                      ? 'bg-warning-100 text-warning-600'
                      : 'bg-success-100 text-success-600'
                  }`}
              >
                {ticket.status === 'open' ? (
                  <AlertCircle className="h-5 w-5" />
                ) : ticket.status === 'in_progress' ? (
                  <Clock className="h-5 w-5" />
                ) : (
                  <CheckCircle className="h-5 w-5" />
                )}
              </span>
              <p className="text-sm font-medium text-gray-900 truncate max-w-md">
                {ticket.title}
              </p>
            </div>
            <div className="ml-2 flex-shrink-0 flex">
              <p
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${ticket.priority === 'high'
                    ? 'bg-error-100 text-error-800'
                    : ticket.priority === 'medium'
                      ? 'bg-warning-100 text-warning-800'
                      : 'bg-success-100 text-success-800'
                  }`}
              >
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </p>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-sm text-gray-500">
                ID: #{ticket.id.substring(0, 8)}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                {isAdmin ? `Submitted by: ${ticket.userName}` : `${ticket.comments.length} comments`}
              </p>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <p>
                Created on {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default TicketsList;