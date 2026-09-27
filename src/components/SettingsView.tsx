import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  RotateCcw, 
  Save, 
  ShieldCheck, 
  Clock, 
  BellRing, 
  Layers, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { toPersianDigits } from '../utils/helpers';

interface SettingsViewProps {
  onResetData: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData, onShowToast }) => {
  const [shiftStart, setShiftStart] = useState('۰۸:۳۰');
  const [shiftEnd, setShiftEnd] = useState('۱۷:۰۰');
  const [gracePeriod, setGracePeriod] = useState('۱۵');
  const [notifyAbsence, setNotifyAbsence] = useState(true);
  const [notifyLeaves, setNotifyLeaves] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('تنظیمات با موفقیت ذخیره شد', 'قوانین ساعت کاری و اعلان‌ها به‌روزرسانی شدند.', 'success');
  };

  const handleResetWithConfirm = () => {
    if (window.confirm('آیا از بازنشانی داده‌ها به اطلاعات اولیه دمو اطمینان دارید؟ تمام تغییرات به حالت پیش‌فرض برمی‌گردد.')) {
      onResetData();
      onShowToast('اطلاعات سامانه بازنشانی شد', 'داده‌های اعضا و حضور و غیاب به حالت اولیه برگشتند.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>⚙️</span>
            <span>تنظیمات سامانه و قوانین حضور و غیاب</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            پیکربندی ساعت کار رسمی، بازه مجاز تأخیر، اعلان‌های تردد و مدیریت داده‌ها
          </p>
        </div>

        <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 font-bold">
          سامانه فعال (نسخه ۴.۲)
        </span>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Working Hours */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">قوانین شیفت کاری و تأخیر</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ساعت شروع کار رسمی:
              </label>
              <input
                type="text"
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono text-center font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ساعت پایان کار رسمی:
              </label>
              <input
                type="text"
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono text-center font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                شناوری / فرجه تأخیر مجاز (دقیقه):
              </label>
              <input
                type="text"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono text-center font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BellRing className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">تنظیمات اعلان‌ها و هشدارهای سیستم</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">هشدار خودکار عدم ثبت حضور تا ساعت ۱۰ صبح</span>
                <span className="text-[11px] text-slate-500">ارسال هشدار به مدیر در صورت غیبت بدون هماهنگی</span>
              </div>
              <input
                type="checkbox"
                checked={notifyAbsence}
                onChange={(e) => setNotifyAbsence(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 border-slate-300 accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">اعلان تایید و ثبت درخواست‌های مرخصی</span>
                <span className="text-[11px] text-slate-500">نمایش پیام‌های مرتبط با مرخصی در نوار بالای پنل</span>
              </div>
              <input
                type="checkbox"
                checked={notifyLeaves}
                onChange={(e) => setNotifyLeaves(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 border-slate-300 accent-emerald-600"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs border border-emerald-500/40 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تغییرات تنظیمات</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>بازنشانی داده‌های سامانه به حالت اولیه (Demo Reset)</span>
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              در صورت تمایل به بازگردانی داده‌های پیش‌فرض اعضای تیم، رکوردهای تردد و یادداشت‌های ادمین، از دکمه زیر استفاده نمایید.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetWithConfirm}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs rounded-xl border border-rose-300 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>بازنشانی داده‌ها</span>
          </button>
        </div>
      </div>
    </div>
  );
};
