import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  Clock, 
  Calendar, 
  LogOut, 
  Check, 
  User as UserIcon,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { UserSession, AppNotification } from '../types';
import { toPersianDigits } from '../utils/helpers';

interface NavbarProps {
  session: UserSession;
  activeTabTitle: string;
  notifications: AppNotification[];
  onToggleSidebar: () => void;
  onLogout: () => void;
  onMarkNotificationsRead: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  session,
  activeTabTitle,
  notifications,
  onToggleSidebar,
  onLogout,
  onMarkNotificationsRead
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${toPersianDigits(h)}:${toPersianDigits(m)}:${toPersianDigits(s)}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Right Zone: Mobile Menu & Breadcrumb / Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="منوی کناری"
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70 hidden sm:inline-block">
            یار پنل
          </span>
          <span className="text-slate-300 hidden sm:inline-block">/</span>
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {activeTabTitle}
          </h1>
        </div>
      </div>

      {/* Left Zone: Live Time, Date, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Date and Live Clock */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>شنبه ۵ مهر ۱۴۰۵</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-800 tabular-nums">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{currentTime || '۱۲:۰۰:۰۰'}</span>
          </div>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            aria-label="اعلان‌ها"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white tabular-nums">
                {toPersianDigits(unreadCount)}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 p-4 z-40 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-800">اعلان‌های سامانه</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {toPersianDigits(unreadCount)} جدید
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onMarkNotificationsRead();
                      setShowNotifications(false);
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    علامت‌گذاری به عنوان خوانده‌شده
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">اعلان جدیدی وجود ندارد</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border text-right transition-colors ${
                        item.read
                          ? 'bg-slate-50/70 border-slate-100 text-slate-600'
                          : 'bg-emerald-50/40 border-emerald-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold">{item.title}</span>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-right"
          >
            <img
              src={session.avatar}
              alt={session.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-slate-800">{session.name}</div>
              <div className="text-[10px] text-slate-500 font-medium">{session.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/70 p-2 z-40 animate-in fade-in zoom-in-95">
              <div className="p-2.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{session.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{session.role}</p>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  دسترسی مدیر ارشد
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold transition-colors text-right"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج از حساب کاربری</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
