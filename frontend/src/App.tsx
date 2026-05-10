import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import type { UrlEntry } from './types';

export default function App() {
    const [history, setHistory] = useState<UrlEntry[]>([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/history`)
            .then((r) => r.json() as Promise<{ urls: UrlEntry[] }>)
            .then((data) => setHistory(data.urls))
            .catch(() => {});
    }, []);

    function addEntry(entry: UrlEntry) {
        setHistory((prev) => [entry, ...prev]);
    }

    return (
        <BrowserRouter>
            <div className="min-h-screen w-full flex flex-col bg-gray-50 overflow-x-hidden">
                <Navbar />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Home onShorten={addEntry} history={history} />} />
                        <Route path="/history" element={<History history={history} />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
