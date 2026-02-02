// src/components/EmptyState.jsx
import { Inbox } from 'lucide-react';

const EmptyState = ({ message = "No data found", description = "" }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Inbox size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
        {description && <p className="text-gray-500">{description}</p>}
    </div>
);

export default EmptyState;