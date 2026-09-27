import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Users, 
  BarChart3, 
  Settings, 
  X, 
  CheckCircle2, 
  XCircle,
  Palmtree,
  ShieldCheck
} from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

export type NavTab = 'dashboard' | 'attendance' | 'members' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalMembers: number;
    presentCount: number;
    absentCount: number;
    leaveCount: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  stats,
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
    { id: 'dashboard', label: 'داشبورد مدیریتی', icon: LayoutDashboard },
    { id: 'attendance', label: 'ثبت و کنترل تردد', icon: Clock, badge: 'زنده' },
    { id: 'members', label: 'مدیریت اعضای تیم', icon: Users },
    { id: 'reports', label: 'گزارش‌ها و آمار', icon: BarChart3 },
    { id: 'settings', label: 'تنظیمات سامانه', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-64 bg-white border-l border-slate-200/90 shadow-xl lg:shadow-none flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo & Close button */}
          <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-600/20 border border-emerald-400/40">
                یار
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight block">
                  سامانه یار
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  مدیریت هوشمند تردد تیم
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 border border-emerald-500/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-emerald-700/80 text-emerald-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Status Overview */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/70">
          <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">خلاصه روزانه</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                امروز
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  حاضرین:
                </span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {toPersianDigits(stats.presentCount)} نفر
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-rose-600">
                  <XCircle className="w-3.5 h-3.5" />
                  غایبین:
                </span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {toPersianDigits(stats.absentCount)} نفر
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Palmtree className="w-3.5 h-3.5" />
                  مرخصی:
                </span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {toPersianDigits(stats.leaveCount)} نفر
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>سامانه یار v4.2</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              اتصال آنلاین
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
