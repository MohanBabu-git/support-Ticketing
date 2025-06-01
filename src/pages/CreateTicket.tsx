import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../contexts/TicketsContext';
import { ChevronLeft, AlertCircle, Clock, CheckCircle, Paperclip, X } from 'lucide-react';
import { NewTicket, TicketPriority } from '../types';

function CreateTicket() {
  const navigate = useNavigate();
  const { createTicket } = useTickets();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const ticketData: NewTicket = {
        title,
        description,
        priority,
        attachments,
      };
      
      const ticket = await createTicket(ticketData);
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket');
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...fileList]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
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
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Support Ticket</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Please provide details about your issue so we can help you more effectively.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md flex">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title <span className="text-error-600">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Brief summary of your issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-error-600">*</span>
                </label>
                <textarea
                  id="description"
                  rows={6}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Detailed description of the issue you're experiencing..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Include any relevant details that might help us resolve your issue more quickly.
                </p>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={`
                      relative block rounded-lg border border-gray-300 bg-white shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500
                      ${priority === 'low' ? 'border-secondary-500 ring-2 ring-secondary-500' : ''}
                    `}>
                      <input
                        type="radio"
                        name="priority"
                        value="low"
                        className="sr-only"
                        checked={priority === 'low'}
                        onChange={() => setPriority('low')}
                      />
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircle className={`h-6 w-6 ${priority === 'low' ? 'text-secondary-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className={`font-medium ${priority === 'low' ? 'text-secondary-700' : 'text-gray-900'}`}>Low</p>
                          <p className="text-gray-500">Minor issue, no urgency</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div>
                    <label className={`
                      relative block rounded-lg border border-gray-300 bg-white shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500
                      ${priority === 'medium' ? 'border-warning-500 ring-2 ring-warning-500' : ''}
                    `}>
                      <input
                        type="radio"
                        name="priority"
                        value="medium"
                        className="sr-only"
                        checked={priority === 'medium'}
                        onChange={() => setPriority('medium')}
                      />
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Clock className={`h-6 w-6 ${priority === 'medium' ? 'text-warning-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className={`font-medium ${priority === 'medium' ? 'text-warning-700' : 'text-gray-900'}`}>Medium</p>
                          <p className="text-gray-500">Standard importance</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div>
                    <label className={`
                      relative block rounded-lg border border-gray-300 bg-white shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500
                      ${priority === 'high' ? 'border-error-500 ring-2 ring-error-500' : ''}
                    `}>
                      <input
                        type="radio"
                        name="priority"
                        value="high"
                        className="sr-only"
                        checked={priority === 'high'}
                        onChange={() => setPriority('high')}
                      />
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <AlertCircle className={`h-6 w-6 ${priority === 'high' ? 'text-error-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className={`font-medium ${priority === 'high' ? 'text-error-700' : 'text-gray-900'}`}>High</p>
                          <p className="text-gray-500">Critical issue, urgent</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attachments
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF, PDF up to 10MB
                    </p>
                  </div>
                </div>
                
                {attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Attached files:</h4>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {attachments.map((file, index) => (
                        <li key={index} className="py-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <Paperclip className="h-5 w-5 text-gray-400" />
                            <span className="ml-2 text-sm text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="text-error-600 hover:text-error-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => navigate('/tickets')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;