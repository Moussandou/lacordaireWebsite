import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ProjectCard from '../components/ProjectCard';
import { Loader2, Search } from 'lucide-react';

interface Project {
    id: string;
    studentName: string;
    projectTitle: string;
    description: string;
    previewUrl?: string;
    slug: string;
    createdAt?: any;
}

const Home: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projectsRef = collection(db, 'projects');
                const q = query(projectsRef);
                const querySnapshot = await getDocs(q);

                const fetchedProjects: Project[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Project));

                setProjects(fetchedProjects);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError("Impossible de charger les projets. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Chargement des projets étudiants...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="inline-block px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 font-medium">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-4 pt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                    Vitrine des Projets <span className="text-blue-600">Étudiants</span>
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed">
                    Découvrez les sites web réalisés par nos talentueux élèves.
                    Parcourez la collection, vérifiez leur progression et visitez leurs créations.
                </p>
            </div>

            <div className="relative max-w-md mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow"
                    placeholder="Rechercher un projet ou un élève..."
                />
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed shadow-sm">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-900 font-medium text-lg">Aucun projet soumis pour le moment.</p>
                    <p className="text-slate-500 mt-1">Soyez le premier à partager votre travail !</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
