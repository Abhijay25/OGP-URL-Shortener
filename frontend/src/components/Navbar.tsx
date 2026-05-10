import { NavLink } from 'react-router-dom';
import { LinkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
            isActive
                ? 'text-indigo-700 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`;

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="h-16 flex items-center justify-between px-6 md:px-10 w-full">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                        <LinkIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900 text-lg tracking-tight">
                        Snip Snip
                    </span>
                </div>

                <nav className="flex items-center gap-1 shrink-0">
                    <NavLink to="/" end className={linkClass}>
                        Shorten
                    </NavLink>
                    <NavLink to="/history" className={linkClass}>
                        History
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
