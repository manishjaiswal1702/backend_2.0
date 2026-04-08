import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const detectLanguage = () => {
        if (code.includes('def ')) return 'Python';
        if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'JavaScript';
        if (code.includes('class ') || code.includes('public ')) return 'Java';
        if (code.includes('fn ')) return 'Rust';
        if (code.includes('func ')) return 'Go';
        return 'Code';
    };

    return (
        <div className="rounded-2xl overflow-hidden my-4 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between bg-linear-to-r from-slate-800 to-slate-900 px-4 py-3 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">{detectLanguage()}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-all hover:scale-105"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                            </svg>
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-6 bg-slate-950 overflow-x-auto text-sm text-slate-100 leading-relaxed font-mono">
                <code>{code}</code>
            </pre>
        </div>
    );
};

export default function ArenaResponse({ solution1, solution2, judge }) {
    useEffect(() => {
        hljs.highlightAll();
    }, [solution1, solution2]);

    return (
        <div className="flex flex-col gap-8 my-8 px-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Solution 1 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 shadow-sm"></div>
                        <h3 className="text-lg font-semibold tracking-wide text-slate-700 dark:text-slate-200">Solution 1</h3>
                        <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                            Mistral AI
                        </div>
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-zinc-900 dark:text-white" {...props} />,
                                h2: ({ ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-zinc-900 dark:text-white" {...props} />,
                                h3: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-zinc-900 dark:text-white" {...props} />,
                                p: ({ ...props }) => <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300" {...props} />,
                                ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
                                a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-500 underline" {...props} />,
                                code: ({ inline, className, children, ...props }) => {
                                    return !inline ? (
                                        <div className="rounded-xl overflow-hidden my-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono border-b border-slate-700">
                                                Code
                                            </div>
                                            <pre className="p-4 bg-slate-950 overflow-x-auto text-sm text-slate-100">
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        </div>
                                    ) : (
                                        <code className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >{solution1}</ReactMarkdown>
                    </div>
                </div>

                {/* Solution 2 */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rounded-full bg-linear-to-r from-violet-400 to-purple-600 shadow-sm"></div>
                        <h3 className="text-lg font-semibold tracking-wide text-slate-700 dark:text-slate-200">Solution 2</h3>
                        <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                            Cohere AI
                        </div>
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-zinc-900 dark:text-white" {...props} />,
                                h2: ({ ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-zinc-900 dark:text-white" {...props} />,
                                h3: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-zinc-900 dark:text-white" {...props} />,
                                p: ({ ...props }) => <p className="mb-4 leading-relaxed text-zinc-700 dark:text-zinc-300" {...props} />,
                                ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 text-zinc-700 dark:text-zinc-300 space-y-1" {...props} />,
                                a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-500 underline" {...props} />,
                                code: ({ inline, className, children, ...props }) => {
                                    return !inline ? (
                                        <div className="rounded-xl overflow-hidden my-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                                            <div className="bg-slate-800 px-4 py-2 text-xs text-slate-400 font-mono border-b border-slate-700">
                                                Code
                                            </div>
                                            <pre className="p-4 bg-slate-950 overflow-x-auto text-sm text-slate-100">
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        </div>
                                    ) : (
                                        <code className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >{solution2}</ReactMarkdown>
                    </div>
                </div>
            </div>

            {judge && (
                <div className="mt-4 bg-linear-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-linear-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Judge's Verdict</h3>
                        <div className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                            Gemini AI
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 px-6 py-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Solution 1 Score</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-linear-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{judge.solution_1_score}</span>
                                        </div>
                                        <span className="text-sm text-slate-500">/10</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {judge.solution_1_reasoning}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 px-6 py-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">Solution 2 Score</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-linear-to-r from-violet-400 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">{judge.solution_2_score}</span>
                                        </div>
                                        <span className="text-sm text-slate-500">/10</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {judge.solution_2_reasoning}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}