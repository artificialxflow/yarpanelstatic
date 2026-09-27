import React, { useState, useEffect } from 'react';
import { 
  Member, 
  AttendanceRecord, 
  AdminNote, 
  AppNotification, 
  UserSession, 
  AttendanceStatus 
} from './types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_ATTENDANCE, 
  INITIAL_ADMIN_NOTES, 
  INITIAL_NOTIFICATIONS,
  TODAY_JALALI
} from './data/mockData';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { MembersView } from './components/MembersView';
import { AttendanceView } from './components/AttendanceView';
import { MemberProfileView } from './components/MemberProfileView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { getCurrentPersianTime, calculateDuration } from './utils/helpers';

export default function App() {
  // Session State
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('yar_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      username: 'admin',
      name: 'امیرحسین رضایی',
      role: 'مدیر ارشد منابع انسانی و سرپرست تیم',
      avatar: '/src/assets/images/avatar_member_male_1_1790488721355.jpg',
      isLoggedIn: true, // Default logged-in for instant preview, can logout anytime
    };
  });

  // App Data in State (with localStorage persistence)
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('yar_members');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MEMBERS;
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('yar_attendance');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ATTENDANCE;
  });

  const [adminNotes, setAdminNotes] = useState<AdminNote[]>(() => {
    const saved = localStorage.getItem('yar_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ADMIN_NOTES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('yar_notifs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedMemberIdForProfile, setSelectedMemberIdForProfile] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast-' + Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('yar_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('yar_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('yar_attendance', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('yar_notes', JSON.stringify(adminNotes));
  }, [adminNotes]);

  useEffect(() => {
    localStorage.setItem('yar_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Auth Handlers
  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    addToast('ورود موفق به سامانه', `خوش آمدید، ${newSession.name}`);
  };

  const handleLogout = () => {
    setSession((prev) => ({ ...prev, isLoggedIn: false }));
    addToast('خروج از حساب', 'شما با موفقیت از سامانه خارج شدید.', 'info');
  };

  // Members Management Handlers
  const handleAddMember = (newMemberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...newMemberData,
      id: 'mem-' + Date.now(),
    };
    setMembers((prev) => [newMember, ...prev]);
    addToast('عضو جدید اضافه شد', `${newMember.name} به فهرست پرسنل اضافه گردید.`);
  };

  const handleUpdateMember = (id: string, updatedData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m))
    );
    addToast('به‌روزرسانی موفق', 'اطلاعات پرسنل با موفقیت ذخیره شد.');
  };

  const handleDeleteMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (selectedMemberIdForProfile === id) {
      setSelectedMemberIdForProfile(null);
    }
    addToast('حذف پرسنل', `${target?.name || 'عضو'} از سامانه حذف شد.`, 'warning');
  };

  // Attendance Handlers
  const handleRecordAttendance = (item: Partial<AttendanceRecord> & { memberId: string }) => {
    const member = members.find((m) => m.id === item.memberId);
    const existingIndex = records.findIndex(
      (r) => r.memberId === item.memberId && r.date === (item.date || TODAY_JALALI)
    );

    const nowTime = getCurrentPersianTime();
    let updatedRecord: AttendanceRecord;

    if (existingIndex >= 0) {
      const old = records[existingIndex];
      updatedRecord = {
        ...old,
        ...item,
      };
      const updatedList = [...records];
      updatedList[existingIndex] = updatedRecord;
      setRecords(updatedList);
    } else {
      updatedRecord = {
        id: 'att-' + Date.now(),
        memberId: item.memberId,
        date: item.date || TODAY_JALALI,
        dayName: item.dayName || 'شنبه',
        status: item.status || 'present',
        entryTime: item.entryTime || nowTime,
        exitTime: item.exitTime || null,
        workHours: item.workHours || 8,
        delayMinutes: item.delayMinutes || 0,
        leaveType: item.leaveType,
        note: item.note,
      };
      setRecords((prev) => [updatedRecord, ...prev]);
    }

    // Add notification
    const notifText = item.status === 'present' 
      ? `ورود ${member?.name} ثبت گردید.`
      : item.status === 'left'
      ? `خروج ${member?.name} ثبت شد.`
      : item.status === 'leave'
      ? `مرخصی ${member?.name} ثبت شد.`
      : `غیبت ${member?.name} ثبت شد.`;

    setNotifications((prev) => [
      {
        id: 'notif-' + Date.now(),
        title: 'ثبت تردد در سیستم',
        message: notifText,
        time: 'هم‌اکنون',
        type: 'info',
        read: false,
      },
      ...prev,
    ]);

    addToast('ثبت وضعیت تردد', notifText);
  };

  // Quick Status change from Dashboard
  const handleQuickStatusChange = (memberId: string, status: AttendanceStatus, note?: string) => {
    const nowTime = getCurrentPersianTime();
    const existing = records.find(
      (r) => r.memberId === memberId && r.date === TODAY_JALALI
    );

    if (status === 'present') {
      handleRecordAttendance({
        memberId,
        date: TODAY_JALALI,
        status: 'present',
        entryTime: nowTime,
        exitTime: existing?.exitTime || null,
        workHours: 8,
        note: note || 'ورود ثبت‌شده',
      });
    } else if (status === 'left') {
      const entry = existing?.entryTime || '۰۸:۳۰';
      const calc = calculateDuration(entry, nowTime);
      handleRecordAttendance({
        memberId,
        date: TODAY_JALALI,
        status: 'left',
        entryTime: entry,
        exitTime: nowTime,
        workDurationFormatted: calc.formatted,
        workHours: calc.hoursDecimal,
        note: note || 'خروج ثبت‌شده',
      });
    } else if (status === 'leave') {
      handleRecordAttendance({
        memberId,
        date: TODAY_JALALI,
        status: 'leave',
        entryTime: null,
        exitTime: null,
        leaveType: 'استحقاقی',
        workHours: 0,
        note: note || 'مرخصی استحقاقی',
      });
    } else if (status === 'absent') {
      handleRecordAttendance({
        memberId,
        date: TODAY_JALALI,
        status: 'absent',
        entryTime: null,
        exitTime: null,
        workHours: 0,
        note: note || 'عدم حضور بدون هماهنگی',
      });
    }
  };

  // Admin Notes Handlers
  const handleAddAdminNote = (memberId: string, content: string, category: AdminNote['category']) => {
    const newNote: AdminNote = {
      id: 'note-' + Date.now(),
      memberId,
      author: session.name,
      createdAt: TODAY_JALALI + ' - ' + getCurrentPersianTime(),
      content,
      category,
    };
    setAdminNotes((prev) => [newNote, ...prev]);
    addToast('یادداشت اختصاصی ثبت شد', 'یادداشت ادمین به پرونده پرسنل اضافه گردید.');
  };

  const handleDeleteAdminNote = (noteId: string) => {
    setAdminNotes((prev) => prev.filter((n) => n.id !== noteId));
    addToast('یادداشت حذف شد', undefined, 'info');
  };

  // Reset demo data
  const handleResetData = () => {
    setMembers(INITIAL_MEMBERS);
    setRecords(INITIAL_ATTENDANCE);
    setAdminNotes(INITIAL_ADMIN_NOTES);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem('yar_members');
    localStorage.removeItem('yar_attendance');
    localStorage.removeItem('yar_notes');
    localStorage.removeItem('yar_notifs');
  };

  // Calculate Daily Stats
  const activeMembers = members.filter((m) => m.isActive);
  const todayRecords = records.filter((r) => r.date === TODAY_JALALI);
  const presentCount = todayRecords.filter(
    (r) => r.status === 'present' || r.status === 'left' || r.status === 'late'
  ).length;
  const absentCount = todayRecords.filter((r) => r.status === 'absent').length;
  const leaveCount = todayRecords.filter((r) => r.status === 'leave').length;

  // View Title lookup
  const getTabTitle = () => {
    if (selectedMemberIdForProfile) {
      const m = members.find((item) => item.id === selectedMemberIdForProfile);
      return `پروفایل پرسنلی · ${m?.name || 'عضو'}`;
    }
    switch (activeTab) {
      case 'dashboard': return 'داشبورد مدیریتی و مانیتورینگ';
      case 'attendance': return 'ثبت و کنترل تردد روزانه';
      case 'members': return 'مدیریت اعضای تیم و پرسنل';
      case 'reports': return 'گزارش‌های جامع و آماری';
      case 'settings': return 'تنظیمات سامانه';
      default: return 'سامانه یار';
    }
  };

  // If user is not logged in, show Login Screen (Phase 2)
  if (!session.isLoggedIn) {
    return (
      <div dir="rtl" className="font-sans antialiased">
        <LoginPage onLogin={handleLogin} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // Selected member for profile
  const profileMember = selectedMemberIdForProfile
    ? members.find((m) => m.id === selectedMemberIdForProfile)
    : null;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedMemberIdForProfile(null);
          setActiveTab(tab);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        stats={{
          totalMembers: activeMembers.length,
          presentCount,
          absentCount,
          leaveCount,
        }}
      />

      {/* Main Content Area (offset by 256px / w-64 on desktop) */}
      <div className="lg:pr-64 flex flex-col flex-1 min-h-screen transition-all">
        {/* Navbar */}
        <Navbar
          session={session}
          activeTabTitle={getTabTitle()}
          notifications={notifications}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
          onMarkNotificationsRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            addToast('تمام اعلان‌ها به عنوان خوانده‌شده ثبت شدند', undefined, 'info');
          }}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {profileMember ? (
            /* Phase 6: Member Profile View */
            <MemberProfileView
              member={profileMember}
              attendanceHistory={records}
              adminNotes={adminNotes}
              onBack={() => setSelectedMemberIdForProfile(null)}
              onAddAdminNote={handleAddAdminNote}
              onDeleteAdminNote={handleDeleteAdminNote}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                /* Phase 3: Dashboard View */
                <DashboardView
                  members={members}
                  todayRecords={todayRecords}
                  onQuickStatusChange={handleQuickStatusChange}
                  onViewMemberProfile={(id) => setSelectedMemberIdForProfile(id)}
                  onNavigateToAttendance={() => setActiveTab('attendance')}
                  onNavigateToMembers={() => setActiveTab('members')}
                />
              )}

              {activeTab === 'attendance' && (
                /* Phase 5: Attendance View */
                <AttendanceView
                  members={members}
                  records={records}
                  currentDate={TODAY_JALALI}
                  onRecordAttendance={handleRecordAttendance}
                  onViewMemberProfile={(id) => setSelectedMemberIdForProfile(id)}
                />
              )}

              {activeTab === 'members' && (
                /* Phase 4: Members View */
                <MembersView
                  members={members}
                  onAddMember={handleAddMember}
                  onUpdateMember={handleUpdateMember}
                  onDeleteMember={handleDeleteMember}
                  onViewMemberProfile={(id) => setSelectedMemberIdForProfile(id)}
                />
              )}

              {activeTab === 'reports' && (
                /* Phase 7: Reports View */
                <ReportsView
                  members={members}
                  records={records}
                />
              )}

              {activeTab === 'settings' && (
                /* Settings View */
                <SettingsView
                  onResetData={handleResetData}
                  onShowToast={addToast}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
