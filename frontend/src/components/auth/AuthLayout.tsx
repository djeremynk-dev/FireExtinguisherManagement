import React from 'react';
import { Shield } from 'lucide-react';

type AuthLayoutProps = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    showBranding?: boolean;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({
    title,
    subtitle,
    children,
    showBranding = true
}) => {
    return (
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 font-sans text-slate-800">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {showBranding && (
                    <div className="hidden lg:flex flex-col space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#A02000] p-3 rounded-xl shadow-lg">
                                <Shield className="text-white w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">TZW LTD</h1>
                                <p className="text-sm text-slate-500 font-medium">Fire Safety Management</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                                Professional Fire Extinguisher Management
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                                Manage inspections, maintenance, compliance, and reporting from one secure platform.
                            </p>
                        </div>

                        <div className="flex gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
                                <span className="text-3xl font-bold text-[#A02000]">500+</span>
                                <p className="text-slate-500 text-sm mt-1">Buildings Protected</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
                                <span className="text-3xl font-bold text-[#A02000]">10K+</span>
                                <p className="text-slate-500 text-sm mt-1">Equipment Tracked</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-2xl shadow-slate-200/60 w-full">
                        <div className="lg:hidden flex flex-col items-center mb-8">
                            <Shield className="text-[#A02000] w-12 h-12 mb-2" />
                            <h1 className="text-xl font-bold">TZW LTD</h1>
                            <p className="text-sm text-slate-500">Fire Safety Management</p>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                            <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;