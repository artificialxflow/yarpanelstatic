import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  Check, 
  X, 
  AlertTriangle,
  Upload,
  Sparkles
} from 'lucide-react';
import { Member, Department } from '../types';
import { toPersianDigits } from '../utils/helpers';

interface MembersViewProps {
  members: Member[];
  onAddMember: (newMember: Omit<Member, 'id'>) => void;
  onUpdateMember: (id: string, updatedData: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
  onViewMemberProfile: (id: string) => void;
}

const DEPARTMENTS: Department[] = [
  'فنی و مهندسی',
  'طراحی محصول',
  'مارکتینگ و فروش',
  'پشتیبانی مشتریان',
  'منابع انسانی و مالی',
];

const PRESET_AVATARS = [
  '/src/assets/images/avatar_member_female_1_1790488709030.jpg',
  '/src/assets/images/avatar_member_male_1_1790488721355.jpg',
  '/src/assets/images/avatar_member_female_2_1790488733731.jpg',
  '/src/assets/images/avatar_member_male_2_1790488746001.jpg',
];

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onViewMemberProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDept, setFormDept] = useState<Department>('فنی و مهندسی');
  const [formCode, setFormCode] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAvatar, setFormAvatar] = useState(PRESET_AVATARS[0]);
  const [formShift, setFormShift] = useState('۰۸:۳۰ - ۱۷:۰۰');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);

  const openAddModal = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('');
    setFormDept('فنی و مهندسی');
    setFormCode(`YAR-${100 + members.length + 1}`);
    setFormPhone('۰۹۱۲۰۰۰۱۱' + Math.floor(Math.random() * 90 + 10));
    setFormEmail('');
    setFormAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setFormShift('۰۸:۳۰ - ۱۷:۰۰');
    setFormIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (m: Member) => {
    setEditingMember(m);
    setFormName(m.name);
    setFormRole(m.role);
    setFormDept(m.department);
    setFormCode(m.employeeCode);
    setFormPhone(m.phone);
    setFormEmail(m.email);
    setFormAvatar(m.avatar);
    setFormShift(m.shift);
    setFormIsActive(m.isActive);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('لطفاً نام و نام خانوادگی را وارد فرمایید.');
      return;
    }
    if (!formRole.trim()) {
      setFormError('لطفاً سمت شغلی را مشخص نمایید.');
      return;
    }

    if (editingMember) {
      onUpdateMember(editingMember.id, {
        name: formName.trim(),
        role: formRole.trim(),
        department: formDept,
        employeeCode: formCode || editingMember.employeeCode,
        phone: formPhone || editingMember.phone,
        email: formEmail || editingMember.email,
        avatar: formAvatar,
        shift: formShift,
        isActive: formIsActive,
      });
    } else {
      onAddMember({
        name: formName.trim(),
        role: formRole.trim(),
        department: formDept,
        employeeCode: formCode || `YAR-${100 + members.length + 1}`,
        phone: formPhone || '۰۹۱۲۰۰۰۱۱۰۰',
        email: formEmail || `${formName.toLowerCase().replace(/\s+/g, '.')}@yar-panel.ir`,
        avatar: formAvatar,
        shift: formShift,
        isActive: formIsActive,
        joinedDate: '۱۴۰۵/۰۷/۰۱',
        baseWorkHours: 8,
      });
    }

    setIsModalOpen(false);
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.includes(searchQuery) ||
      m.role.includes(searchQuery) ||
      m.employeeCode.includes(searchQuery) ||
      m.phone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedDept !== 'all' && m.department !== selectedDept) return false;
    if (statusFilter === 'active' && !m.isActive) return false;
    if (statusFilter === 'inactive' && m.isActive) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>👥</span>
            <span>مدیریت اعضای تیم و پرسنل</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ثبت، ویرایش، اختصاص سمت و مشاهده پرونده کاری همکاران سازمانی
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-600/20 border border-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>افزودن عضو جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام، سمت، کد پرسنلی یا شماره تماس..."
              className="w-full pl-3 pr-9 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">همه دپارتمان‌ها</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            همه ({toPersianDigits(members.length)})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            فعال ({toPersianDigits(members.filter(m => m.isActive).length)})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            غیرفعال ({toPersianDigits(members.filter(m => !m.isActive).length)})
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4">مشخصات عضو</th>
                <th className="py-3 px-4">کد پرسنلی</th>
                <th className="py-3 px-4">دپارتمان</th>
                <th className="py-3 px-4">اطلاعات تماس</th>
                <th className="py-3 px-4">شیفت کاری</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    عضوی با مشخصات انتخابی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <button
                            onClick={() => onViewMemberProfile(member.id)}
                            className="font-bold text-slate-900 hover:text-emerald-700 transition-colors text-right block"
                          >
                            {member.name}
                          </button>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {member.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Employee Code */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {member.employeeCode}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {member.department}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{member.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[140px]">{member.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Shift */}
                    <td className="py-3.5 px-4 font-mono text-slate-700 text-[11px] tabular-nums">
                      {member.shift}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {member.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold bg-slate-100 text-slate-600 border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          غیرفعال
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewMemberProfile(member.id)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                          title="مشاهده پروفایل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-colors"
                          title="ویرایش اطلاعات"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(member)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors"
                          title="حذف عضو"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Graphic Modal (Phase 4 Requirement) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">{editingMember ? '✏️' : '✨'}</span>
                <h3 className="text-base font-bold text-slate-900">
                  {editingMember ? 'ویرایش مشخصات عضو تیم' : 'افزودن عضو جدید به سامانه'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-right">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  انتخاب تصویر پرسنلی / آواتار:
                </label>
                <div className="flex items-center gap-3">
                  {PRESET_AVATARS.map((avatarUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormAvatar(avatarUrl)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                        formAvatar === avatarUrl
                          ? 'border-emerald-600 ring-2 ring-emerald-400/20'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={avatarUrl}
                        alt="Avatar choice"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      {formAvatar === avatarUrl && (
                        <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-600 rounded-full text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="مثال: آرش سپهری"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    سمت شغلی *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="مثال: توسعه‌دهنده وب"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Department & Employee Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    دپارتمان سازمانی
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value as Department)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    کد پرسنلی
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="YAR-108"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    شماره همراه
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="۰۹۱۲..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ایمیل سازمانی
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="name@yar-panel.ir"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Shift & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ساعت شیفت کاری
                  </label>
                  <input
                    type="text"
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value)}
                    placeholder="۰۸:۳۰ - ۱۷:۰۰"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-700">عضو فعال سیستم</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm border border-emerald-500/40 transition-all cursor-pointer"
                >
                  {editingMember ? 'ذخیره تغییرات' : 'افزودن عضو'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full p-5 text-right animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 border border-rose-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              آیا از حذف {deleteTarget.name} اطمینان دارید؟
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              با حذف این عضو، سوابق تردد و یادداشت‌های مرتبط او از نمایش پیش‌فرض حذف خواهد شد. این عملیات قابل بازگشت نیست.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onDeleteMember(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
