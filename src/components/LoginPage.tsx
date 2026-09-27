import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles, Building2, Users } from 'lucide-react';
import { UserSession } from '../types';

interface LoginPageProps {
  onLogin: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('لطفاً نام کاربری را وارد فرمایید.');
      return;
    }
    if (!password) {
      setError('لطفاً رمز عبور را وارد فرمایید.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        username: username.trim(),
        name: 'امیرحسین رضایی',
        role: 'مدیر ارشد منابع انسانی و سرپرست تیم',
        avatar: '/src/assets/images/avatar_member_male_1_1790488721355.jpg',
        isLoggedIn: true,
      });
    }, 450);
  };

  const handleQuickLogin = (userType: 'admin' | 'hr') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (userType === 'admin') {
        onLogin({
          username: 'admin_yar',
          name: 'امیرحسین رضایی',
          role: 'مدیر ارشد سامانه یار',
          avatar: '/src/assets/images/avatar_member_male_1_1790488721355.jpg',
          isLoggedIn: true,
        });
      } else {
        onLogin({
          username: 'sara_hr',
          name: 'سارا ابراهیمی',
          role: 'مدیر منابع انسانی و امور پرسنلی',
          avatar: '/src/assets/images/avatar_member_female_1_1790488709030.jpg',
          isLoggedIn: true,
        });
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/40 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative background grid and borders */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-600/20 border border-emerald-400/30 mb-4 ring-4 ring-emerald-50">
            <span className="text-2xl font-black tracking-tight">یار</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            سامانه مدیریت حضور و غیاب یار
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            پنل یکپارچه کنترل تردد، ساعات کاری و مدیریت اعضای تیم
          </p>
        </div>

        {/* Main Card with sharp borders & crisp light theme */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-8 relative">
          <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔐</span>
              <h2 className="text-lg font-bold text-slate-800">ورود به پنل مدیریت</h2>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
              نسخه ۴.۲ (Light)
            </span>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <span>👤</span>
                <span>نام کاربری (Username)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="نام کاربری سازمانی"
                  className="w-full px-4 py-2.5 pr-10 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>🔐</span>
                  <span>رمز عبور (Password)</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('جهت بازیابی رمز عبور با پشتیبانی فنی داخلی تماس حاصل فرمایید (داخلی ۱۰۴)')}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  رمز را فراموش کرده‌اید؟
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 pl-10 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600">مرا به خاطر بسپار</span>
              </label>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                اتصال امن SSL
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 border border-emerald-500/40 flex items-center justify-center gap-2 transition-all group cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>ورود به سامانه</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login for Demo convenience */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-3 text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              ورود سریع آزمایشی (Demo Access)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-right transition-all group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>👔</span> مدیر سیستم
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">امیرحسین رضایی</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('hr')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-right transition-all group"
              >
                <div className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>👩‍💼</span> مدیر منابع انسانی
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">سارا ابراهیمی</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500 space-y-1">
          <p>© تمام حقوق برای سامانه مدیریت تیم و حضور و غیاب «یار» محفوظ است.</p>
          <p className="text-slate-400">پشتیبانی و مانیتورینگ آنلاین منابع انسانی</p>
        </div>
      </div>
    </div>
  );
};
