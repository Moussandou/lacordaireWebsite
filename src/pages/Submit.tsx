import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Send, UploadCloud, FileType } from 'lucide-react';

const Submit: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        studentName: '',
        projectTitle: '',
        slug: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "text/html" || selectedFile.name.endsWith('.html')) {
                setFile(selectedFile);
            } else {
                alert("Veuillez sélectionner un fichier HTML valide (.html)");
                e.target.value = ''; // Reset input
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Veuillez sélectionner votre fichier index.html");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload File to Firebase Storage
            const storageRef = ref(storage, `submissions/${formData.studentName}/${formData.slug}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 2. Save Metadata to Firestore
            await addDoc(collection(db, 'projects'), {
                ...formData,
                htmlFileUrl: downloadURL, // Store link to the uploaded file
                createdAt: new Date(),
                status: 'pending'
            });

            // Navigate home or show success
            navigate('/');
        } catch (error) {
            console.error("Erreur lors de la soumission : ", error);
            alert("Une erreur est survenue lors de l'envoi. Vérifiez votre connexion.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Soumettre votre Projet
                </h2>
                <p className="text-slate-500 mb-8">
                    Remplissez le formulaire ci-dessous et téléversez votre fichier HTML principal.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label htmlFor="studentName" className="text-sm font-semibold text-slate-700">Nom de l'élève</label>
                        <input
                            type="text"
                            id="studentName"
                            name="studentName"
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all outline-none"
                            placeholder="Jean Dupont"
                            value={formData.studentName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="projectTitle" className="text-sm font-semibold text-slate-700">Titre du Projet</label>
                        <input
                            type="text"
                            id="projectTitle"
                            name="projectTitle"
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all outline-none"
                            placeholder="Mon Super Site"
                            value={formData.projectTitle}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <label htmlFor="slug" className="text-sm font-semibold text-slate-700">Nom du Dossier (Slug)</label>
                            <span className="text-xs text-slate-400 font-medium">Minuscules, sans espaces</span>
                        </div>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            required
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-mono text-sm transition-all outline-none"
                            placeholder="mon-projet-web"
                            value={formData.slug}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="htmlFile" className="text-sm font-semibold text-slate-700">Fichier Principal (index.html)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FileType className={`h-5 w-5 ${file ? 'text-blue-500' : 'text-slate-400'}`} />
                            </div>
                            <input
                                type="file"
                                id="htmlFile"
                                accept=".html"
                                onChange={handleFileChange}
                                className="block w-full pl-10 text-sm text-slate-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer bg-slate-50 border border-slate-200 rounded-lg
                    py-2"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                            Sélectionnez uniquement votre fichier <code>index.html</code>.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows={4}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all outline-none resize-none"
                            placeholder="Décrivez votre projet en quelques mots..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? (
                            <>
                                <UploadCloud className="w-5 h-5 animate-bounce" />
                                <span>Envoi en cours...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Envoyer le Projet</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Submit;
