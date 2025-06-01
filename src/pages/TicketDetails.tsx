import { useState, FormEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTickets } from '../contexts/TicketsContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  ChevronLeft, 
  Send, 
  Paperclip, 
  Download, 
  ExternalLink 
} from 'lucide-react';
import { TicketStatus, NewComment } from '../types';

function TicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTicket, addComment, updateTicketStatus, loading } = useTickets();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(id ? getTicket(id) : undefined);
  const [comment, setComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setTicket(getTicket(id));
    }
  }, [id, getTicket]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-lg font-medium text-gray-900">Ticket not found</h3>
        <p className="mt-1 text-gray-500">The ticket you're looking for doesn't exist or you don't have access to it.</p>
        <div className="mt-6">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/tickets')}
          >
            Back to tickets
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() && attachments.length === 0) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const newComment: NewComment = {
        content: comment,
        attachments,
      };
      
      const updatedTicket = await addComment(ticket.id, newComment);
      setTicket(updatedTicket);
      setComment('');
      setAttachments([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...fileList]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleStatusChange = async (status: TicketStatus) => {
    if (!user?.isAdmin) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const updatedTicket = await updateTicketStatus(ticket.id, { status });
      setTicket(updatedTicket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          type="button"
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
          onClick={() => navigate('/tickets')}
        >
          <ChevronLeft className="mr-1 h-5 w-5" />
          Back to tickets
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {ticket.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Ticket #{ticket.id.substring(0, 8)} · Created on {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
            </p>
          </div>
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${ticket.priority === 'high'
                  ? 'bg-error-100 text-error-800'
                  : ticket.priority === 'medium'
                    ? 'bg-warning-100 text-warning-800'
                    : 'bg-success-100 text-success-800'
                }`}
            >
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
            </span>
            <span
              className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${ticket.status === 'open'
                  ? 'bg-primary-100 text-primary-800'
                  : ticket.status === 'in_progress'
                    ? 'bg-warning-100 text-warning-800'
                    : 'bg-success-100 text-success-800'
                }`}
            >
              {ticket.status === 'open'
                ? 'Open'
                : ticket.status === 'in_progress'
                  ? 'In Progress'
                  : 'Resolved'}
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
          
          {ticket.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Attachments:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {ticket.attachments.map((attachment) => (
                  <li key={attachment.id} className="py-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <Paperclip className="h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-700">{attachment.name}</span>
                    </div>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center"
                    >
                      {attachment.type.startsWith('image/') ? 'View' : 'Download'}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {user?.isAdmin && (
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Change Status:</h4>
            <div className="flex space-x-2">
              <button
                type="button"
                disabled={ticket.status === 'open' || submitting}
                onClick={() => handleStatusChange('open')}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                  ticket.status === 'open'
                    ? 'bg-primary-300 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
              >
                <AlertCircle className="mr-1 h-4 w-4" />
                Open
              </button>
              <button
                type="button"
                disabled={ticket.status === 'in_progress' || submitting}
                onClick={() => handleStatusChange('in_progress')}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                  ticket.status === 'in_progress'
                    ? 'bg-warning-300 cursor-not-allowed'
                    : 'bg-warning-500 hover:bg-warning-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning-500'
                }`}
              >
                <Clock className="mr-1 h-4 w-4" />
                In Progress
              </button>
              <button
                type="button"
                disabled={ticket.status === 'resolved' || submitting}
                onClick={() => handleStatusChange('resolved')}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${
                  ticket.status === 'resolved'
                    ? 'bg-success-300 cursor-not-allowed'
                    : 'bg-success-500 hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500'
                }`}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Resolved
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        
        <div className="mt-4 space-y-6">
          {ticket.comments.length > 0 ? (
            ticket.comments.map((comment) => (
              <div key={comment.id} className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                  <div className="flex">
                    {comment.userAvatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={comment.userAvatar}
                        alt={comment.userName}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                        {comment.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {comment.userName}
                        {comment.isAdmin && (
                          <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded-full">
                            Support Agent
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:px-6 border-t border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{comment.content}</p>
                  
                  {comment.attachments.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-medium text-gray-700">Attachments:</h4>
                      <ul className="mt-1 divide-y divide-gray-200">
                        {comment.attachments.map((attachment) => (
                          <li key={attachment.id} className="py-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <Paperclip className="h-4 w-4 text-gray-400" />
                              <span className="ml-2 text-xs text-gray-700">{attachment.name}</span>
                            </div>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-800 text-xs font-medium flex items-center"
                            >
                              {attachment.type.startsWith('image/') ? 'View' : 'Download'}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white shadow sm:rounded-lg">
              <p className="text-gray-500">No comments yet.</p>
            </div>
          )}
        </div>

        {/* Add comment form */}
        <div className="mt-6 bg-white shadow sm:rounded-lg overflow-hidden">
          <form onSubmit={handleSubmitComment} className="p-4">
            {error && (
              <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="comment" className="sr-only">
                Add a comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            {/* File attachments */}
            {attachments.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs font-medium text-gray-700">Attachments:</h4>
                <ul className="mt-1 space-y-1">
                  {attachments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 text-gray-400" />
                        <span className="ml-2 text-xs text-gray-700">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-xs text-error-600 hover:text-error-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-3 flex justify-between items-center">
              <div>
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-sm text-primary-600 hover:text-primary-800 flex items-center"
                >
                  <Paperclip className="mr-1 h-5 w-5" />
                  Attach file
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              
              <button
                type="submit"
                disabled={(!comment.trim() && attachments.length === 0) || submitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
              >
                <Send className="mr-2 h-4 w-4" />
                {submitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;