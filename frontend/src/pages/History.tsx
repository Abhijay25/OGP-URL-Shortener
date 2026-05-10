import { useState } from 'react';
import {
    ClipboardDocumentIcon,
    CheckIcon,
    LinkIcon,
} from '@heroicons/react/24/outline';
import type { UrlEntry } from '../types';

interface Props {
    history: UrlEntry[];
}

function getFavicon(url: string): string {
    try {
        const { hostname } = new URL(url);
        return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
        return '';
    }
}

export default function History({ history }: Props) {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    async function handleCopy(entry: UrlEntry) {
        await navigator.clipboard.writeText(entry.shortUrl);
        setCopiedCode(entry.shortCode);
        setTimeout(() => setCopiedCode(null), 2000);
    }

    return (
        <div className="px-4 py-10 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                        Shortened URLs
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {history.length} link{history.length !== 1 ? 's' : ''} created this session
                    </p>
                </div>

                {history.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <LinkIcon className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-600">No URLs shortened yet</p>
                        <p className="text-xs text-gray-400 mt-1">Go to Shorten to get started</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-sm table-fixed">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-[52%]">
                                            Original URL
                                        </th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-[40%]">
                                            Short URL
                                        </th>
                                        <th className="px-4 py-3.5 w-[8%]" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((entry) => (
                                        <tr
                                            key={entry.shortCode}
                                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <img
                                                        src={getFavicon(entry.originalUrl)}
                                                        alt=""
                                                        className="w-5 h-5 shrink-0 rounded-sm"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                    <a
                                                        href={entry.originalUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-gray-700 hover:text-indigo-600 truncate transition-colors"
                                                        title={entry.originalUrl}
                                                    >
                                                        {entry.originalUrl}
                                                    </a>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <a
                                                    href={entry.shortUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                                >
                                                    {entry.shortUrl}
                                                </a>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => handleCopy(entry)}
                                                    title="Copy short URL"
                                                    className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                                                >
                                                    {copiedCode === entry.shortCode ? (
                                                        <CheckIcon className="w-4 h-4 text-emerald-600" />
                                                    ) : (
                                                        <ClipboardDocumentIcon className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden flex flex-col gap-3">
                            {history.map((entry) => (
                                <div
                                    key={entry.shortCode}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3.5 flex items-center gap-3"
                                >
                                    <img
                                        src={getFavicon(entry.originalUrl)}
                                        alt=""
                                        className="w-6 h-6 shrink-0 rounded-sm"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <a
                                            href={entry.originalUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-gray-800 truncate block hover:text-indigo-600 transition-colors"
                                        >
                                            {entry.originalUrl}
                                        </a>
                                        <a
                                            href={entry.shortUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-gray-400 hover:text-indigo-500 truncate block mt-0.5 transition-colors"
                                        >
                                            {entry.shortUrl}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(entry)}
                                        title="Copy short URL"
                                        className="shrink-0 p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                                    >
                                        {copiedCode === entry.shortCode ? (
                                            <CheckIcon className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <ClipboardDocumentIcon className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
