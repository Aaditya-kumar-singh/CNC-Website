import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, ServerCrash, Wifi } from 'lucide-react';
import { endpoint, projectId, projectName } from '../lib/appwrite';

const AppwriteSetup = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handlePing = async () => {
        if (!endpoint || !projectId) {
            const message = 'Appwrite env values are missing.';
            setStatus({ ok: false, message });
            toast.error(message);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${endpoint}/health`, {
                method: 'GET',
                headers: {
                    'X-Appwrite-Project': projectId,
                },
            });

            if (!response.ok) {
                throw new Error(`Ping failed with status ${response.status}`);
            }

            const data = await response.json();
            const message = data?.message || 'Appwrite ping succeeded.';
            setStatus({ ok: true, message });
            toast.success(message);
        } catch (error) {
            const message = error.message || 'Failed to ping Appwrite.';
            setStatus({ ok: false, message });
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-gray-400">Appwrite</p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-900">React Appwrite Setup</h1>
                    <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-gray-500">
                        This page uses the Appwrite env configuration added to the frontend. Use the ping button to verify
                        that the configured project endpoint is reachable from the browser.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Project Name</p>
                        <p className="mt-3 break-all text-sm font-semibold text-gray-900">{projectName || 'Not set'}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Project ID</p>
                        <p className="mt-3 break-all text-sm font-semibold text-gray-900">{projectId || 'Not set'}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Endpoint</p>
                        <p className="mt-3 break-all text-sm font-semibold text-gray-900">{endpoint || 'Not set'}</p>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={handlePing}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-full bg-[#111] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Wifi size={16} />
                        {loading ? 'Sending Ping...' : 'Send a Ping'}
                    </button>
                    <p className="text-sm font-medium text-gray-500">Configured for the `cncmarket` Appwrite project.</p>
                </div>

                {status && (
                    <div className={`mt-8 rounded-2xl border p-5 ${status.ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex items-start gap-3">
                            {status.ok ? (
                                <CheckCircle2 className="mt-0.5 text-green-600" size={18} />
                            ) : (
                                <ServerCrash className="mt-0.5 text-red-600" size={18} />
                            )}
                            <div>
                                <p className={`text-sm font-bold ${status.ok ? 'text-green-700' : 'text-red-700'}`}>
                                    {status.ok ? 'Connection Successful' : 'Connection Failed'}
                                </p>
                                <p className={`mt-1 text-sm font-medium ${status.ok ? 'text-green-700/90' : 'text-red-700/90'}`}>
                                    {status.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppwriteSetup;
