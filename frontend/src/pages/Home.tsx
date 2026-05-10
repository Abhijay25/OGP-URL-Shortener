import { useState } from 'react';
import {
    ClipboardDocumentIcon,
    CheckIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';
import type { UrlEntry } from '../types';

interface Props {
    onShorten: (entry: UrlEntry) => void;
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

export default function Home({ onShorten, history }: Props) {
    const [url, setUrl] = useState('');
    const [alias, setAlias] = useState('');
    const [result, setResult] = useState<UrlEntry | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const recent = history.slice(0, 5);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const body: { url: string; customAlias?: string } = { url };
            if (alias.trim()) body.customAlias = alias.trim();

            const res = await fetch(`${import.meta.env.VITE_API_URL}/shorten`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json() as { shortUrl?: string; error?: string };

            if (!res.ok) {
                setError(data.error ?? 'Something went wrong');
                return;
            }

            const shortUrl = data.shortUrl!;
            const shortCode = shortUrl.split('/').at(-1)!;
            const entry: UrlEntry = {
                shortCode,
                shortUrl,
                originalUrl: url,
                createdAt: new Date().toISOString(),
            };
            setResult(entry);
            onShorten(entry);
            setUrl('');
            setAlias('');
        } catch {
            setError('Could not reach the server. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }

    async function handleCopyResult() {
        if (!result) return;
        await navigator.clipboard.writeText(result.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleCopyRecent(entry: UrlEntry) {
        await navigator.clipboard.writeText(entry.shortUrl);
        setCopiedCode(entry.shortCode);
        setTimeout(() => setCopiedCode(null), 2000);
    }

    return (
        <div className="max-w-xl mx-auto px-4 pt-10 pb-16">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    Shorten a URL
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Paste a long link and get a short one instantly.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label
                            htmlFor="url"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Long URL
                        </label>
                        <input
                            id="url"
                            type="url"
                            required
                            placeholder="https://example.com/very/long/url"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError('');
                            }}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        />
                        {error && (
                            <p className="mt-1.5 text-xs text-red-600">{error}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="alias"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                        >
                            Custom alias{' '}
                            <span className="font-normal text-gray-400">(optional)</span>
                        </label>
                        <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
                            <span className="px-3.5 py-2.5 text-sm text-gray-400 bg-gray-50 border-r border-gray-300 select-none whitespace-nowrap">
                                {import.meta.env.VITE_API_URL.replace('http://', '').replace('https://', '')}/
                            </span>
                            <input
                                id="alias"
                                type="text"
                                placeholder="my-link"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                className="flex-1 min-w-0 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                        {loading ? 'Shortening…' : 'Shorten'}
                        {!loading && <ArrowRightIcon className="w-4 h-4" />}
                    </button>
                </form>
            </div>

            {result && (
                <div className="mt-3 bg-white rounded-xl border border-indigo-200 shadow-sm p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 mb-0.5">Your short link</p>
                        <a
                            href={result.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 truncate block"
                        >
                            {result.shortUrl}
                        </a>
                    </div>
                    <button
                        onClick={handleCopyResult}
                        title="Copy to clipboard"
                        className="shrink-0 p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        {copied ? (
                            <CheckIcon className="w-4 h-4 text-emerald-600" />
                        ) : (
                            <ClipboardDocumentIcon className="w-4 h-4" />
                        )}
                    </button>
                </div>
            )}

            {recent.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Recent
                    </h2>
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {recent.map((entry, i) => (
                            <div
                                key={entry.shortCode}
                                className={`flex items-center gap-3 px-4 py-3 ${
                                    i < recent.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                            >
                                <img
                                    src={getFavicon(entry.originalUrl)}
                                    alt=""
                                    className="w-4 h-4 shrink-0 rounded-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 truncate">
                                        {entry.originalUrl}
                                    </p>
                                    <a
                                        href={entry.shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                                    >
                                        {entry.shortUrl}
                                    </a>
                                </div>
                                <button
                                    onClick={() => handleCopyRecent(entry)}
                                    title="Copy short URL"
                                    className="shrink-0 p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {copiedCode === entry.shortCode ? (
                                        <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                        <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
