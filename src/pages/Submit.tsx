import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const Submit: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        studentName: '',
        projectTitle: '',
        slug: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'slug') {
            const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
            setFormData({ ...formData, slug: sanitized });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && (selectedFile.type === "text/html" || selectedFile.name.endsWith('.html'))) {
            setFile(selectedFile);
        } else {
            alert("Veuillez sélectionner un fichier HTML.");
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert("Veuillez sélectionner votre fichier HTML.");
            return;
        }

        setStatus('submitting');

        try {
            const storageRef = ref(storage, `submissions/${formData.slug}/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            await addDoc(collection(db, 'projects'), {
                ...formData,
                htmlFileUrl: downloadURL,
                createdAt: new Date(),
                status: 'pending'
            });

            setStatus('success');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error("Erreur:", error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-md mx-auto text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Projet envoyé !</h2>
                <p className="text-gray-500">Redirection en cours...</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour aux projets
            </Link>

            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">Soumettre un projet</h1>
                <p className="text-sm text-gray-500 mb-6">Remplissez le formulaire pour partager votre site.</p>

                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800">Erreur lors de l'envoi</p>
                            <p className="text-sm text-red-600">Veuillez réessayer.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <FormField label="Votre nom" required>
                        <input
                            type="text"
                            name="studentName"
                            required
                            placeholder="Jean Dupont"
                            value={formData.studentName}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </FormField>

                    <FormField label="Titre du projet" required>
                        <input
                            type="text"
                            name="projectTitle"
                            required
                            placeholder="Mon Super Site"
                            value={formData.projectTitle}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </FormField>

                    <FormField label="Identifiant URL" hint="Lettres minuscules et tirets uniquement" required>
                        <input
                            type="text"
                            name="slug"
                            required
                            placeholder="mon-super-site"
                            value={formData.slug}
                            onChange={handleChange}
                            className="form-input font-mono text-sm"
                        />
                    </FormField>

                    <FormField label="Fichier HTML" required>
                        <label className="block">
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${file
                                    ? 'border-blue-300 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}>
                                <Upload className={`w-8 h-8 mx-auto mb-2 ${file ? 'text-blue-500' : 'text-gray-400'}`} />
                                {file ? (
                                    <p className="text-sm font-medium text-blue-600">{file.name}</p>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-gray-700">Cliquez pour sélectionner</p>
                                        <p className="text-xs text-gray-500 mt-1">Fichier .html uniquement</p>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                accept=".html"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </FormField>

                    <FormField label="Description" required>
                        <textarea
                            name="description"
                            required
                            rows={3}
                            placeholder="Décrivez brièvement votre projet..."
                            value={formData.description}
                            onChange={handleChange}
                            className="form-input resize-none"
                        />
                    </FormField>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {status === 'submitting' ? 'Envoi en cours...' : 'Envoyer le projet'}
                    </button>
                </form>
            </div>
        </div>
    );
};

interface FormFieldProps {
    label: string;
    hint?: string;
    required?: boolean;
    children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, hint, required, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
        {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
);

export default Submit;
