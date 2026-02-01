import React from 'react';
import { ExternalLink, User, Calendar } from 'lucide-react';

interface Project {
    id: string;
    studentName: string;
    projectTitle: string;
    description: string;
    previewUrl?: string; // URL of the screenshot or specific preview asset
    slug: string; // The subdirectory name
}

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    // Construct the hosted URL based on the slug
    const projectUrl = `/students/${project.slug}/index.html`;

    return (
        <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
            <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                {project.previewUrl ? (
                    <img
                        src={project.previewUrl}
                        alt={project.projectTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-slate-300">
                        <span className="text-4xl mb-2">💻</span>
                        <span className="text-xs font-medium uppercase tracking-wider">Aperçu non disponible</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                    <a
                        href={projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-blue-600/20"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>Voir le site</span>
                    </a>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 truncate group-hover:text-blue-600 transition-colors">
                    {project.projectTitle}
                </h3>

                <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4 mt-auto">
                    <div className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span className="font-medium text-slate-600">{project.studentName}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Promo 2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
