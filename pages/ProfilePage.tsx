import React, { useState } from 'react';
import {
  User, Mail, Phone, Calendar, Shield, LogOut, Camera,
  MapPin, Heart, Activity, FileText, ChevronRight, Edit3, Save
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Button, Card, Badge, Input } from '../components/ui';

interface ProfilePageProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onLogout }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('nav.profile')}</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Manage your medical profile and security settings.</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <Button variant="primary" icon={Save} onClick={handleSave}>
              Save Changes
            </Button>
          ) : (
            <Button variant="secondary" icon={Edit3} onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
          <Button variant="danger" icon={LogOut} onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - ID Card */}
        <div className="space-y-6">
          <Card glass className="!p-0 overflow-hidden relative group">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="px-6 pb-6 text-center">
              <div className="relative inline-block -mt-12 mb-4">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 p-1.5 shadow-2xl relative">
                  <div className="w-full h-full rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-slate-300" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                    <Camera size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">Patient ID: VX-AI-2024</p>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</p>
                  <p className="font-bold text-slate-800 dark:text-white">{user.age || 'N/A'}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</p>
                  <p className="font-bold text-slate-800 dark:text-white">{user.gender || 'N/A'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-widest">Emergency Contact</h4>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
              <div>
                <p className="font-black text-rose-600 dark:text-rose-400 text-sm">{user.emergencyContact?.name || 'Not Set'}</p>
                <p className="text-xs text-rose-500/80 font-medium">{user.emergencyContact?.relation || 'Guardian'}</p>
              </div>
              <a href={`tel:${user.emergencyContact?.phone}`} className="p-2.5 bg-rose-600 text-white rounded-xl shadow-lg hover:bg-rose-700 transition-colors">
                <Phone size={16} />
              </a>
            </div>
          </Card>
        </div>

        {/* Right Column - Info Tabs / Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="!p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Personal Information</h3>
              <Badge variant="info">Verified Profile</Badge>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <Input
                    icon={User}
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <Input
                    icon={Mail}
                    disabled={!isEditing}
                    value={formData.email || 'user@example.com'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
                  <Input
                    icon={Calendar}
                    disabled={!isEditing}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Gender</label>
                  <Input
                    disabled={!isEditing}
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Blood Group</label>
                  <Input
                    icon={Activity}
                    disabled={!isEditing}
                    placeholder="e.g. O+"
                    value={formData.bloodGroup || ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Address</label>
                <Input
                  icon={MapPin}
                  disabled={!isEditing}
                  placeholder="Your full home address"
                />
              </div>
            </div>
          </Card>

          <Card className="!p-0 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield size={20} className="text-blue-500" /> Medical Overview
              </h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Known Allergies</h4>
                <div className="flex flex-wrap gap-2 text-wrap break-words">
                  {user.allergies && user.allergies.length > 0 ? (
                    user.allergies.map((allergy, i) => (
                      <Badge key={i} variant="error" className="!normal-case !text-sm !py-1.5 !px-3 font-semibold">{allergy}</Badge>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm italic">No allergies recorded</p>
                  )}
                  {isEditing && (
                    <button className="px-3 py-1.5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs font-bold hover:border-blue-500 hover:text-blue-500 transition-all">+ Add Allergy</button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Medical History</h4>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  {isEditing ? (
                    <textarea
                      className="w-full bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 min-h-[100px]"
                      value={formData.medicalHistory}
                      onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {user.medicalHistory || 'No medical history reported yet.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
