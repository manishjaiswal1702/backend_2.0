import React, { useState, useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import ArenaResponse from './ArenaResponse';
import axios from "axios";

const EXAMPLE_QUESTIONS = [
    "Write a function to find the longest palindromic substring",
    "Optimize a recursive fibonacci function",
    "Design a cache eviction strategy (LRU Cache)",
    "Implement a binary search algorithm",
    "Write a function to detect a cycle in a linked list"
];

const MOCK_RESPONSE = {
    solution_1: "Here is a clean Python solution using modern syntax:\n\n```python\ndef fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a + b\n    return a\n```\n\nThis approach has O(n) time complexity and O(1) space.",
    solution_2: "A recursive solution can be elegant but less efficient:\n\n```python\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n```\n\nNote: this has O(2^n) time complexity.",
    judge: {
        solution_1_score: 10,
        solution_2_score: 5,
        solution_1_reasoning: "Excellent, optimal solution. Space complexity is O(1) which is perfect for this problem.",
        solution_2_reasoning: "The recursive approach without memoization is extremely slow for large inputs."
    }
};

export default function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        if (messages.length > 0) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setTimeout(() => {
            document.querySelector('input[type="text"]')?.focus();
        }, 0);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/invoke", {
                input: inputValue
            });

            const data = response.data;

            const newMessage = {
                id: Date.now(),
                problem: inputValue,
                ...data.result,
                timestamp: new Date()
            };

            setMessages([...messages, newMessage]);
            setInputValue('');
        } catch (error) {
            console.error('Error sending message:', error);
            // You could add error handling UI here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-linear-to-r from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 font-sans">
            <header className="py-6 px-8 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">AI Battle Arena</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">⚡ Real-time AI Solutions</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 w-full max-w-7xl mx-auto flex flex-col">
                {messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center max-w-3xl mx-auto w-full">
                            <div className="w-24 h-24 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl animate-in zoom-in duration-500">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Welcome to the Arena</h2>
                            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12">
                                Challenge two elite AI models to solve your coding problems. Watch them compete, analyze different approaches, and get expert judgment on their solutions.
                            </p>

                            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 mb-8">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-wider">Try these examples:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {EXAMPLE_QUESTIONS.map((q, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSuggestionClick(q)}
                                            className="group text-left p-4 rounded-xl bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200 hover:scale-105"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="pt-1 text-blue-500 group-hover:scale-125 transition-transform">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V9" />
                                                        <path d="M14 1.5v4h4" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-300 font-medium leading-snug">{q}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                            <UserMessage message={msg.problem} timestamp={msg.timestamp} />
                            <ArenaResponse
                                solution1={msg.solution_1}
                                solution2={msg.solution_2}
                                judge={msg.judge}
                            />
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="flex justify-center my-8">
                        <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl px-6 py-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-slate-600 dark:text-slate-300 font-medium">AI models are battling...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={endOfMessagesRef} />
            </main>

            <div className="p-6 bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/60 dark:border-slate-700/60 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSend} className="relative flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Describe your coding challenge..."
                                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-6 pr-16 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm hover:shadow-md text-lg"
                                disabled={isLoading}
                            />
                            {inputValue && (
                                <button
                                    type="button"
                                    onClick={() => setInputValue('')}
                                    className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isLoading}
                            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white p-4 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center min-w-14"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}