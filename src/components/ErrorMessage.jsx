// src/components/ErrorMessage.jsx
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-red-700 text-sm mt-1">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline"
                >
                    Try again
                </button>
            )}
        </div>
    </div>
);

export default ErrorMessage;