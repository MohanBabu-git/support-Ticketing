import { useTickets } from '../contexts/TicketsContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { PlusCircle, TicketCheck, Clock, AlertTriangle } from 'lucide-react';
import TicketStatusChart from '../components/TicketStatusChart';
import TicketPriorityChart from '../components/TicketPriorityChart';
import RecentTickets from '../components/RecentTickets';

function Dashboard() {
  const { userTickets, loading } = useTickets();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const openTickets = userTickets.filter(ticket => ticket.status === 'open');
  const inProgressTickets = userTickets.filter(ticket => ticket.status === 'in_progress');
  const resolvedTickets = userTickets.filter(ticket => ticket.status === 'resolved');
  const highPriorityTickets = userTickets.filter(ticket => ticket.priority === 'high');

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/tickets/new"
            className="btn btn-primary flex items-center space-x-2"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <PlusCircle className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{openTickets.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-secondary-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{inProgressTickets.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-success-50 rounded-md p-3">
                <TicketCheck className="h-6 w-6 text-success-700" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{resolvedTickets.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-error-50 rounded-md p-3">
                <AlertTriangle className="h-6 w-6 text-error-700" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High Priority</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">{highPriorityTickets.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Ticket Status</h3>
          <div className="mt-4 h-48">
            <TicketStatusChart tickets={userTickets} />
          </div>
        </div>

        {/* Priority distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Ticket Priority</h3>
          <div className="mt-4 h-48">
            <TicketPriorityChart tickets={userTickets} />
          </div>
        </div>

        {/* Recent tickets */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Tickets</h3>
          <div className="mt-4">
            <RecentTickets tickets={userTickets.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;