import { Link } from 'react-router-dom';
import { Ticket } from '../types';
import { format, formatDistanceToNow } from 'date-fns';

interface RecentTicketsProps {
  tickets: Ticket[];
}

function RecentTickets({ tickets }: RecentTicketsProps) {
  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (sortedTickets.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No tickets yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {sortedTickets.map((ticket) => (
          <li key={ticket.id} className="py-3">
            <Link to={`/tickets/${ticket.id}`} className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded-md transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        ticket.status === 'open'
                          ? 'bg-primary-100 text-primary-800'
                          : ticket.status === 'in_progress'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-success-100 text-success-800'
                      }
                    `}
                  >
                    {ticket.status === 'open'
                      ? 'Open'
                      : ticket.status === 'in_progress'
                        ? 'In Progress'
                        : 'Resolved'}
                  </span>
                </div>
              </div>
              <div className="mt-1 flex items-center">
                <span
                  className={`mr-2 inline-block w-2 h-2 rounded-full
                    ${
                      ticket.priority === 'high'
                        ? 'bg-error-500'
                        : ticket.priority === 'medium'
                          ? 'bg-warning-500'
                          : 'bg-secondary-500'
                    }
                  `}
                />
                <p className="text-xs text-gray-500">
                  #{ticket.id.substring(0, 8)} · Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      
      {tickets.length > 5 && (
        <div className="mt-4 text-center">
          <Link to="/tickets" className="text-sm text-primary-600 hover:text-primary-800">
            View all tickets
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecentTickets;