import React from 'react';

export default function UserMessage({ message, timestamp }) {
    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex justify-end my-6">
            <div className="max-w-[75%]">
                <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg text-lg leading-relaxed rounded-br-sm">
                    {message}
                </div>
                {timestamp && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-right">
                        {formatTime(timestamp)}
                    </div>
                )}
            </div>
        </div>
    );
}