"use client";

import React from "react";
import {
    CheckCircle2

} from "lucide-react";

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 min-h-[600px]">

                {/* Left Side */}
                <div className="h-full bg-[#0056b3] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div>
                        <div className="flex items-center gap-2 mb-12">
                            <CheckCircle2 size={28} />
                            <span className="font-bold text-xl tracking-tight">Habit Tracker</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">Precision Growth <br /> Starts with Today.</h1>
                        <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
                            The analytical instrument for your personal evolution. Track, analyze, and master your daily disciplines
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-8">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0056b3] bg-slate-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="w-full h-full object-cover" alt="user" />
                                </div>
                            ))}

                        </div>
                        <p className="text-[10px] font-bold tracking-widest text-blue-200 uppercase">Join 12,000+ High-Performers</p>
                    </div>
                </div>


                {/* Right Side: Form Section */}
                <div className="h-full p-12 flex flex-col justify-center"
                >
                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Create an account</h2>
                        <p className="text-slate-500 text-sm mb-8">Enter your details to begin your journey.</p>
                        <form className="space-y-6">

                            <div className="flex flex-col gap-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 pr-2">Email Address</label>
                                <input data-testid="auth-signup-email" type="email" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-all" placeholder="name@company.com" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-2 pr-2">Password</label>
                                <input data-testid="auth-signup-password" type="password" placeholder="••••••••" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-all" />
                                <p className="block text-[10px] text-slate-400 tracking-[0.1em] mt-2">At least 8 characters with one number</p>
                            </div>
                            <button
                                data-testid="auth-signup-submit"
                                className="w-full bg-[#0056b3] text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 cursor-pointer">
                                Sign Up
                            </button>
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>

                                <div className="flex items-center justify-center gap-1">

                                    <span className="text-slate-500 w-full border-t border-slate-200 my-4"></span>
                                    <div className="relative flex items-center flex-shrink-0 flex-1 whitespace-nowrap justify-center text-[10px] uppercase tracking-widest font-bold text-slate-400 bg-white px-4">
                                        Or continue with
                                    </div>
                                    <span className="text-slate-500 w-full border-t border-slate-200 my-4"></span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                                    <span>Google</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                                    <span>Apple</span>
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-xs text-slate-500">Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Log In</a></p>
                        <div className="text-slate-500 w-full border-t border-slate-200 my-4"></div>
                        <div className="flex justify-center items-center gap-4">
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">PRIVACY POLICY</p>
                            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">TERMS OF SERVICE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}