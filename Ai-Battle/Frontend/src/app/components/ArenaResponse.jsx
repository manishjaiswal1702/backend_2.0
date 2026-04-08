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
        <div className="rounded-2xl overflow-hidden my-4 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between bg-linear-to-r from-slate-800 to-slate-900 px-4 py-3 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">{detectLanguage()}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-all hover:scale-105 group-hover:opacity-100 opacity-0"
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
    const isWinner = judge && judge.solution_1_score > judge.solution_2_score;
    const isEqual = judge && judge.solution_1_score === judge.solution_2_score;

    const customCodeBlock = ({ inline, children }) => {
        if (inline) return <code className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-1.5 py-0.5 rounded-md text-sm font-mono">{children}</code>;
        return <CodeBlock code={String(children).replace(/\n$/, '')} />;
    };

    useEffect(() => {
        hljs.highlightAll();
    }, [solution1, solution2]);

    return (
        <div className="flex flex-col gap-8 my-8 px-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Solution 1 */}
                    <div className={`bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group relative overflow-hidden ${isWinner && !isEqual ? 'ring-2 ring-emerald-400/30 ring-offset-2 dark:ring-offset-slate-900' : ''}`}>
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-400/5 to-transparent pointer-events-none group-hover:from-emerald-400/10 transition-all duration-300"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-4 h-4 rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 shadow-lg animate-pulse"></div>
                            <div>
                                <h3 className="text-lg font-bold tracking-wide text-slate-900 dark:text-slate-100">Solution 1 {isWinner && !isEqual && '👑'}</h3>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider mt-0.5">Mistral AI</p>
                            </div>
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 prose dark:prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-slate-900 dark:text-white" {...props} />,
                                    h2: ({ ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-slate-900 dark:text-white" {...props} />,
                                    h3: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-white" {...props} />,
                                    p: ({ ...props }) => <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300" {...props} />,
                                    ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 text-slate-700 dark:text-slate-300 space-y-1" {...props} />,
                                    ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 text-slate-700 dark:text-slate-300 space-y-1" {...props} />,
                                    a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-500 underline" {...props} />,
                                    code: customCodeBlock
                                }}
                            >{solution1}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Solution 2 */}
                    <div className={`bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group relative overflow-hidden ${!isWinner && !isEqual && judge ? 'ring-2 ring-violet-400/30 ring-offset-2 dark:ring-offset-slate-900' : ''}`}>
                    <div className="absolute inset-0 bg-linear-to-r from-violet-400/5 to-transparent pointer-events-none group-hover:from-violet-400/10 transition-all duration-300"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-4 h-4 rounded-full bg-linear-to-r from-violet-400 to-purple-600 shadow-lg animate-pulse"></div>
                            <div>
                                <h3 className="text-lg font-bold tracking-wide text-slate-900 dark:text-slate-100">Solution 2 {!isWinner && !isEqual && judge && '👑'}</h3>
                                <p className="text-xs text-violet-600 dark:text-violet-400 font-medium uppercase tracking-wider mt-0.5">Cohere AI</p>
                            </div>
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 prose dark:prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-slate-900 dark:text-white" {...props} />,
                                    h2: ({ ...props }) => <h2 className="text-xl font-bold mt-5 mb-3 text-slate-900 dark:text-white" {...props} />,
                                    h3: ({ ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-white" {...props} />,
                                    p: ({ ...props }) => <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300" {...props} />,
                                    ul: ({ ...props }) => <ul className="list-disc pl-6 mb-4 text-slate-700 dark:text-slate-300 space-y-1" {...props} />,
                                    ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-4 text-slate-700 dark:text-slate-300 space-y-1" {...props} />,
                                    a: ({ ...props }) => <a className="text-blue-600 hover:text-blue-500 underline" {...props} />,
                                    code: customCodeBlock
                                }}
                            >{solution2}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>

            {/* Judge Panel */}
            {judge && (
                <div className="mt-4 bg-linear-to-r from-amber-50/50 via-orange-50/30 to-red-50/20 dark:from-slate-800/50 dark:via-slate-700/50 dark:to-slate-600/20 border-2 border-amber-200/50 dark:border-amber-900/30 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-r from-amber-400/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-linear-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95１-.69l１.０７-３．２９２z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-１００">Expert Judgment {isEqual ? '⚖️' : isWinner ? '🏆' : ''}</h3>
                                <p className="text-sm text-amber-7００ dark:text-amber-３００ font-medium uppercase tracking-wider mt-１">Evaluated by Gemini AI</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`relative group rounded-2xl overflow-hidden ${isWinner && !isEqual ? 'ring-2 ring-emerald-400/40 bg-white dark:bg-slate-900 shadow-lg' : 'bg-white/60 dark:bg-slate-900/40'}`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Solution 1 Score</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-emerald-400 to-emerald-600">{judge.solution_1_score}</div>
                                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/10</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
                                        <div
                                            className="bg-linear-to-r from-emerald-400 to-emerald-600 h-full transition-all duration-500 ease-out"
                                            style={{ width: `${(judge.solution_1_score / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {judge.solution_1_reasoning}
                                    </p>
                                    {isWinner && !isEqual && (
                                        <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-900">
                                            <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                                </svg>
                                                Winner
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`relative group rounded-2xl overflow-hidden ${!isWinner && !isEqual ? 'ring-2 ring-violet-400/40 bg-white dark:bg-slate-900 shadow-lg' : 'bg-white/60 dark:bg-slate-900/40'}`}>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100">Solution 2 Score</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-violet-400 to-purple-600">{judge.solution_2_score}</div>
                                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/10</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden">
                                        <div
                                            className="bg-linear-to-r from-violet-400 to-purple-600 h-full transition-all duration-500 ease-out"
                                            style={{ width: `${(judge.solution_2_score / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                        {judge.solution_2_reasoning}
                                    </p>
                                    {!isWinner && !isEqual && (
                                        <div className="mt-4 pt-4 border-t border-violet-200 dark:border-violet-900">
                                            <span className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                                </svg>
                                                Winner
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isEqual && (
                            <div className="mt-6 p-4 bg-amber-100/50 dark:bg-amber-900/30 border border-amber-300/50 dark:border-amber-700/50 rounded-xl text-center">
                                <p className="text-amber-900 dark:text-amber-200 font-semibold">⚖️ It's a tie! Both solutions are equally strong.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
