// This is a directive that tells Next.js this file is a Client Component
"use client";

import React, { useState, useEffect } from "react";
import {
    CalendarDays,
    TrendingUp,
    User,
    LogOut,
    Plus,
    Search,
    Bell,
    Settings,
} from 'lucide-react';
import { Session } from "@/types/auth";

const navItems = [
    { name: 'Daily', icon: CalendarDays, active: true },
    { name: 'Trends', icon: TrendingUp, active: false },
    { name: 'Profile', icon: User, active: false }
];

export default function Dashboard() {
    const [session, setSession] = useState<Session | null>(null);


    useEffect(() => {
        const sessionData = localStorage.getItem('habit-tracker-session');
        if (sessionData) {
            setSession(JSON.parse(sessionData));
        } else {
            window.location.href = '/login'; //Redirect if no session
        }
    }, []);

    if (!session) return <div>Loading...</div>

    return (
        <div className="flex min-h-screen bg-[#f8f9fa] font-['Google_Sans',sans-serif]">

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-[#e8f0fe] p-6 fixed h-full">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-[#1a73e8] tracking tight">Habitly</h1>
                    <p className="text-[10px] text-slate-100 mt-1 uppercase">Precision Growth</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col gap-4">
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}>
                            <div className={item.active ? 'text-blue-600' : 'text-slate-400'}>
                                <item.icon size={20} />
                            </div>
                            <span className="text-[14px] font-medium">{item.name}</span>
                        </button>
                    ))}

                    <button
                        data-testid="auth-logout-button"
                        className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                        onClick={() => {
                            localStorage.removeItem('habit-tracker-session');
                            window.location.href = '/login';
                        }}>
                        <div className="text-inherit">
                            <LogOut size={20} />
                        </div>
                        <span className="text-[14px] font-medium text-slate-500">Log Out</span>
                    </button>
                </nav>

                {/* User Profile Card */}
                <div className="mt-auto p-4 bg-slate-50 border-slate-100 flex items-center gap-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden border border-slate-200">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.name}`} alt={session.name} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">Godwin Goje</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">Pro Member</p>
                    </div>
                </div>
            </aside>


            <main className="flex-1 md:ml-72 p-8">
                {/* Header with search Icons */}
                <header className="flex justify-between items-center mb-10">
                    <div className="relative w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input type="text"
                            placeholder="Search habits..."
                            className="w-full bg-white border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400" />
                    </div>
                    <div className="flex items-center gap-6 text-slate-400">
                        <button>
                            <Bell size={20} />
                        </button>
                        <button>
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                        Morning, <span className="text-blue-600">{session.name}.</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">You're on a 12-day streak. Keep the momentum.</p>
                </div>


                <div>
                    <div>
                        <div>
                            <div>
                                <h2>Today's Progress</h2>
                                <p></p>
                            </div>
                            <h1></h1>
                        </div>

                        {/* Progress Bar */}
                        <div></div>

                        {/* Progress grid cards */}
                        <div>
                            <div>
                                <h4>ACTIVE</h4>
                                <div></div>
                            </div>
                            <div>
                                <h4>DONE</h4>
                                <div></div>
                            </div>
                            <div>
                                <h4>STREAK</h4>
                                <div></div>
                            </div>
                            <div>
                                <h4>BEST</h4>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3>Consistency is key</h3>
                        <p>Success is the sum of small <br /> repeated efforts day in and day <br /> out</p>
                        <button>
                            <p>View Analytics</p>
                        </button>
                    </div>
                </div>


                <div>
                    <h3>Active Habits</h3>
                    <p>View All</p>
                </div>

                {/* Active Habits Grid Cards */}
                <div>

                </div>


                <button
                    data-testid="create-habit-button"
                    className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                    <Plus size={28}></Plus>
                </button>
            </main>


        </div>
    )
}