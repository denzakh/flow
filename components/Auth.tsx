import React, { useState } from 'react';
import {
    Mail,
    Lock,
    User,
    ChevronRight,
    Chrome,
    ArrowRight,
    UserCircle,
    RefreshCcw,
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProps {
    onAuth: (user: UserProfile) => void;
    lang: string;
}

const Auth: React.FC<AuthProps> = ({ onAuth, lang }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            onAuth({
                id: Math.random().toString(36).substr(2, 9),
                name: mode === 'login' ? email.split('@')[0] || 'User' : name,
                email: email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                isGuest: false,
            });
            setIsLoading(false);
        }, 1200);
    };

    const handleGoogleAuth = () => {
        setIsLoading(true);
        setTimeout(() => {
            onAuth({
                id: 'google-123',
                name: 'Alex Flow',
                email: 'alex.flow@example.com',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                isGuest: false,
            });
            setIsLoading(false);
        }, 1000);
    };

    const handleGuest = () => {
        onAuth({
            id: 'guest',
            name: 'Guest User',
            email: 'guest@flow.local',
            isGuest: true,
        });
    };

    return (
        <div className='min-h-screen flex items-center justify-center p-6 animate-in fade-in duration-1000'>
            {/* Background Decorative Element */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none' />

            <div className='w-full max-w-md glass-container rounded-[2.5rem] p-12 space-y-10 shadow-2xl relative border-white/60 bg-white/70 overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400/30 to-indigo-500/30 rounded-t-[2.5rem]' />

                <div className='text-center space-y-3'>
                    <div className='w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/40'>
                        <RefreshCcw size={32} className='text-emerald-600' />
                    </div>
                    <h2 className='text-4xl font-black text-charcoal tracking-tight leading-none'>
                        {mode === 'login' ? 'Welcome Back' : 'Start Flow'}
                    </h2>
                    <p className='text-charcoal/40 text-sm font-bold tracking-tight'>
                        {mode === 'login'
                            ? 'Continue your rhythm'
                            : 'Your journey to recovery starts here'}
                    </p>
                </div>

                <div className='space-y-5'>
                    <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        className='w-full py-4 glass-card rounded-2xl flex items-center justify-center gap-4 font-bold text-charcoal hover:bg-white/80 transition-all border border-white/60 active:scale-[0.98] disabled:opacity-50 shadow-sm'
                    >
                        <div className='w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm'>
                            <svg viewBox='0 0 24 24' className='w-4 h-4'>
                                <path
                                    fill='#4285F4'
                                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                />
                                <path
                                    fill='#34A853'
                                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                />
                                <path
                                    fill='#FBBC05'
                                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
                                />
                                <path
                                    fill='#EA4335'
                                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                />
                            </svg>
                        </div>
                        <span>Continue with Google</span>
                    </button>

                    <div className='relative flex items-center py-4'>
                        <div className='flex-grow border-t border-charcoal/5'></div>
                        <span className='flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/20'>
                            or use email
                        </span>
                        <div className='flex-grow border-t border-charcoal/5'></div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {mode === 'signup' && (
                            <div className='relative group'>
                                <User
                                    className='absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/20 group-focus-within:text-emerald-500 transition-colors'
                                    size={18}
                                />
                                <input
                                    type='text'
                                    required
                                    placeholder='Full Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='w-full bg-white/40 border border-transparent rounded-[1.25rem] py-4.5 pl-14 pr-4 font-bold text-charcoal placeholder:text-charcoal/15 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white/80 focus:border-emerald-500/20 transition-all outline-none text-sm'
                                />
                            </div>
                        )}
                        <div className='relative group'>
                            <Mail
                                className='absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/20 group-focus-within:text-emerald-500 transition-colors'
                                size={18}
                            />
                            <input
                                type='email'
                                required
                                placeholder='Email Address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full bg-white/40 border border-transparent rounded-[1.25rem] py-4.5 pl-14 pr-4 font-bold text-charcoal placeholder:text-charcoal/15 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white/80 focus:border-emerald-500/20 transition-all outline-none text-sm'
                            />
                        </div>
                        <div className='relative group'>
                            <Lock
                                className='absolute left-5 top-1/2 -translate-y-1/2 text-charcoal/20 group-focus-within:text-emerald-500 transition-colors'
                                size={18}
                            />
                            <input
                                type='password'
                                required
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full bg-white/40 border border-transparent rounded-[1.25rem] py-4.5 pl-14 pr-4 font-bold text-charcoal placeholder:text-charcoal/15 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white/80 focus:border-emerald-500/20 transition-all outline-none text-sm'
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={isLoading}
                            className='w-full py-5 bg-emerald-500 text-white rounded-[1.25rem] font-black shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] mt-4'
                        >
                            {isLoading ? (
                                <RefreshCcw
                                    size={22}
                                    className='animate-spin'
                                />
                            ) : (
                                <>
                                    <span className='text-base'>
                                        {mode === 'login'
                                            ? 'Sign In'
                                            : 'Create Account'}
                                    </span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className='text-center space-y-6 pt-4'>
                    <button
                        onClick={() =>
                            setMode(mode === 'login' ? 'signup' : 'login')
                        }
                        className='text-xs font-bold text-charcoal/30 hover:text-emerald-600 transition-colors px-4 py-2'
                    >
                        {mode === 'login'
                            ? "Don't have an account? Sign up"
                            : 'Already have an account? Log in'}
                    </button>

                    <div className='h-px bg-charcoal/5 w-1/2 mx-auto' />

                    <button
                        onClick={handleGuest}
                        className='w-full py-2 text-[10px] font-black uppercase tracking-[0.25em] text-charcoal/15 hover:text-emerald-500 transition-all'
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
