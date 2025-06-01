import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <div className="flex-shrink-0 flex justify-center">
        <AlertTriangle className="h-12 w-12 text-warning-500" />
      </div>
      <h1 className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-2 text-base text-gray-500">
        The page you're looking for doesn't exist or you don't have access to it.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;