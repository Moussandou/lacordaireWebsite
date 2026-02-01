import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Plus, Github } from 'lucide-react';

interface NavLinkProps {
    to: string;
    active: boolean;
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => (
    <Link
        to={to}
        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
    >
        {children}
    </Link>
);

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-gray-900 font-semibold text-lg hover:text-blue-600 transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <LayoutGrid className="w-4 h-4 text-white" />
                            </div>
                            <span>Lacordaire</span>
                        </Link>

                        <nav className="flex items-center gap-1">
                            <NavLink to="/" active={isHome}>
                                Projets
                            </NavLink>
                            <Link
                                to="/submit"
                                className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Nouveau</span>
                            </Link>
                            <a
                                href="https://github.com/Moussandou/lacordaireWebsite"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                                title="Voir sur GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {children}
            </main>

            <footer className="bg-white border-t border-gray-100 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Lacordaire · Tous droits réservés
                </div>
            </footer>
        </div>
    );
};

export default Layout;
