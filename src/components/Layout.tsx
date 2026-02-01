import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout as LayoutIcon, PlusCircle, Github } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2.5 font-semibold text-lg text-slate-800 hover:text-blue-600 transition-colors">
                        <LayoutIcon className="w-5 h-5 text-blue-600" />
                        <span>Lacordaire Hub</span>
                    </Link>

                    <div className="flex items-center space-x-8">
                        <NavLink to="/" current={location.pathname}>Galerie</NavLink>
                        <Link
                            to="/submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center space-x-2 text-sm shadow-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Soumettre un projet</span>
                        </Link>
                        <a
                            href="https://github.com/Moussandou/lacordaireWebsite"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-6 py-12">
                {children}
            </main>

            <footer className="border-t border-slate-200 py-8 bg-white mt-auto">
                <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} Lacordaire Hosting. Plateforme d'hébergement pour étudiants.</p>
                </div>
            </footer>
        </div>
    );
};

const NavLink = ({ to, current, children }: { to: string; current: string; children: React.ReactNode }) => {
    const isActive = current === to;
    return (
        <Link
            to={to}
            className={`text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
        >
            {children}
        </Link>
    );
};

export default Layout;
