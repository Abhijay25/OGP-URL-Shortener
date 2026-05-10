import { NavLink } from 'react-router-dom';
import { LinkIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    return (
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-gray-200 bg-white h-full">
            <div className="px-5 py-5 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm tracking-tight">
                        Snip
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                <NavLink to="/" end className={linkClass}>
                    <LinkIcon className="w-4 h-4 shrink-0" />
                    Shorten URL
                </NavLink>
                <NavLink to="/history" className={linkClass}>
                    <ClockIcon className="w-4 h-4 shrink-0" />
                    History
                </NavLink>
            </nav>

            <div className="px-5 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-400">OGP URL Shortener</p>
            </div>
        </aside>
    );
}
