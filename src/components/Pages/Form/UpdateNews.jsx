import React, { useState } from 'react';
import { Database, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { newsService } from '../../../services/api';

const UpdateNews = () => {
    const [category, setCategory] = useState('politics');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({});
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            // This is the Base64 string of your image
            setFormData({ ...formData, imageUrl: reader.result });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const categories = ["global", "national", "state", "business", "crime", "entertainment", "sports", "health", "politics", "travel"];

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', text: '' });


        try {
            await newsService.postNews(category, formData);
            setStatus({ type: 'success', text: `Successfully added news to ${category}!` });
            setFormData({}); // Clear form after success
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', text: 'Failed to update database. Check Spring Boot / CORS.' });
        } finally {
            setLoading(false);
        }
    };

    const renderFields = () => {
        const inputClass = "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-blue-500 transition-all";

        switch (category) {
            case 'business':
                return (
                    <div className="space-y-4">
                        <input type="text" placeholder="Company Name" className={inputClass}
                            value={formData.companyName || ''} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                        <input type="text" placeholder="Headline" className={inputClass}
                            value={formData.headline || ''} onChange={(e) => setFormData({ ...formData, headline: e.target.value })} />
                        <textarea placeholder="Market Analysis" rows="4" className={inputClass}
                            value={formData.analysis || ''} onChange={(e) => setFormData({ ...formData, analysis: e.target.value })} />
                        <input type="text" placeholder="Stock Update (e.g. +2.5%)" className={inputClass}
                            value={formData.stockUpdate || ''} onChange={(e) => setFormData({ ...formData, stockUpdate: e.target.value })} />
                    </div>
                );

            case 'entertainment':
                return (
                    <div className="space-y-4">
                        <input type="text" placeholder="Movie Title" className={inputClass}
                            value={formData.movieTitle || ''} onChange={(e) => setFormData({ ...formData, movieTitle: e.target.value })} />
                        <input type="text" placeholder="Celebrity Name" className={inputClass}
                            value={formData.celebrityName || ''} onChange={(e) => setFormData({ ...formData, celebrityName: e.target.value })} />
                        <textarea placeholder="Gossip Content" rows="4" className={inputClass}
                            value={formData.gossipContent || ''} onChange={(e) => setFormData({ ...formData, gossipContent: e.target.value })} />
                        {/* Replace your existing Image URL input with this */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
                                Upload Local Image
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {formData.imageUrl && (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500 shadow-md"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'sports':
                return (
                    <div className="space-y-4">
                        <input type="text" placeholder="Match Title (e.g. IND vs AUS)" className={inputClass}
                            value={formData.matchTitle || ''} onChange={(e) => setFormData({ ...formData, matchTitle: e.target.value })} />
                        <input type="text" placeholder="Score Update" className={inputClass}
                            value={formData.scoreUpdate || ''} onChange={(e) => setFormData({ ...formData, scoreUpdate: e.target.value })} />
                        <textarea placeholder="Match Summary" rows="4" className={inputClass}
                            value={formData.summary || ''} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} />
                        {/* Replace your existing Image URL input with this */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
                                Upload Local Image
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {formData.imageUrl && (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500 shadow-md"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'health':
                return (
                    <div className="space-y-4">
                        <input type="text" placeholder="Topic (e.g. Nutrition)" className={inputClass}
                            value={formData.topic || ''} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} />
                        <input type="text" placeholder="Article Title" className={inputClass}
                            value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        <textarea placeholder="Medical Advice" rows="4" className={inputClass}
                            value={formData.medicalAdvice || ''} onChange={(e) => setFormData({ ...formData, medicalAdvice: e.target.value })} />
                        <input type="text" placeholder="Doctor Name" className={inputClass}
                            value={formData.doctorConsultant || ''} onChange={(e) => setFormData({ ...formData, doctorConsultant: e.target.value })} />
                        {/* Replace your existing Image URL input with this */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
                                Upload Local Image
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {formData.imageUrl && (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500 shadow-md"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-4">
                        <input type="text" placeholder="News Title" className={inputClass}
                            value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        <textarea placeholder="Detailed Content" rows="5" className={inputClass}
                            value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        {/* Replace your existing Image URL input with this */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-slate-400 ml-1">
                                Upload Local Image
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {formData.imageUrl && (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500 shadow-md"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                    <Database size={24} className={loading ? 'animate-spin' : ''} />
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
                    Manual <span className="text-blue-600">Data Entry</span>
                </h2>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Target Category</label>
                    <select
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl font-bold capitalize outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setFormData({}); // Reset data when switching categories
                        }}
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {renderFields()}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase italic tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    {loading ? "Processing..." : <><Send size={20} /> Push to {category}</>}
                </button>

                {status.text && (
                    <div className={`mt-8 p-4 rounded-2xl text-center font-bold flex items-center justify-center gap-2 animate-bounce ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                        {status.text}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UpdateNews;