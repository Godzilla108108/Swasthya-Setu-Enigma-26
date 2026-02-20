import React, { useState } from 'react';
import {
   Star, MapPin, Clock, Check, Video, Calendar, X, Briefcase, Award,
   CheckCircle, Search, Stethoscope, ChevronRight
} from 'lucide-react';
import { Doctor } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, Button, Badge } from '../components/ui';

interface DoctorsPageProps {
   doctors: Doctor[];
   filterSpecialty: string | null;
   onBook: (doctor: Doctor, date: string, time: string, type: 'video' | 'in-person') => void;
}

const DoctorsPage: React.FC<DoctorsPageProps> = ({ doctors, filterSpecialty, onBook }) => {
   const { t } = useLanguage();
   const [selectedDate, setSelectedDate] = useState('Today');
   const [bookingDoctor, setBookingDoctor] = useState<string | null>(null);
   const [videoOnly, setVideoOnly] = useState(false);
   const [viewProfileDoctor, setViewProfileDoctor] = useState<Doctor | null>(null);

   const filteredDoctors = doctors.filter(d => {
      const matchesSpecialty = filterSpecialty
         ? d.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()) || d.specialty === 'General Physician'
         : true;
      const matchesVideo = videoOnly ? d.isVideoEnabled : true;
      return matchesSpecialty && matchesVideo;
   });

   const handleBooking = (doctor: Doctor) => {
      setBookingDoctor(doctor.id);
      setTimeout(() => {
         onBook(doctor, selectedDate, doctor.nextAvailable.split(', ')[1] || '10:00 AM', videoOnly ? 'video' : 'in-person');
         setBookingDoctor(null);
         setViewProfileDoctor(null);
      }, 1500);
   };

   return (
      <div className="p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
         {/* Header & Filter Info */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('find_doc.title')}</h2>
               <div className="flex items-center gap-3">
                  {filterSpecialty && (
                     <Badge variant="info" className="!py-1.5 !px-3">{t('find_doc.recommended')}: {filterSpecialty}</Badge>
                  )}
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                     Showing {filteredDoctors.length} specialists
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button
                  onClick={() => setVideoOnly(!videoOnly)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${videoOnly
                     ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                     : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                     }`}
               >
                  <Video size={18} />
                  {t('find_doc.video_consult')}
               </button>
            </div>
         </div>

         {/* Date Filters */}
         <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {[t('common.today'), t('common.tomorrow'), 'Oct 24', 'Oct 25'].map(date => (
               <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 ${selectedDate === date
                     ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105'
                     : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-blue-400'
                     }`}
               >
                  {date}
               </button>
            ))}
         </div>

         {/* Doctors List */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDoctors.length === 0 ? (
               <div className="col-span-full text-center py-20">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                     <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('find_doc.no_results')}</h3>
                  <button onClick={() => window.location.reload()} className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all">
                     {t('find_doc.clear_filters')}
                  </button>
               </div>
            ) : (
               filteredDoctors.map(doctor => (
                  <Card key={doctor.id} glass className="!p-0 overflow-hidden group flex flex-col h-full border-white/10">
                     <div className="p-6 flex gap-5 cursor-pointer flex-1" onClick={() => setViewProfileDoctor(doctor)}>
                        <div className="relative">
                           <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover bg-slate-200 dark:bg-slate-800 group-hover:scale-105 transition-transform duration-500" />
                           {doctor.isVideoEnabled && (
                              <div className="absolute -bottom-2 -right-2 p-1.5 bg-purple-600 rounded-xl text-white shadow-lg">
                                 <Video size={14} />
                              </div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                 <h3 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-1.5 truncate">
                                    {doctor.name}
                                    {doctor.verified && <CheckCircle size={16} className="text-blue-500 shrink-0" />}
                                 </h3>
                                 <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{doctor.specialty}</p>
                              </div>
                              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg text-xs font-black">
                                 <Star size={12} fill="currentColor" />
                                 {doctor.rating}
                              </div>
                           </div>

                           <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {doctor.experience && (
                                 <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-200">
                                    <Briefcase size={14} className="text-slate-400" />
                                    <span>{doctor.experience}Y Exp</span>
                                 </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                 <MapPin size={14} className="text-slate-400" />
                                 <span className="truncate">Indiranagar</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50">
                        <div className="space-y-0.5">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{t('find_doc.next_available')}</p>
                           <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{doctor.nextAvailable}</p>
                        </div>
                        <Button
                           onClick={() => handleBooking(doctor)}
                           isLoading={bookingDoctor === doctor.id}
                           className="min-w-[120px] !py-2.5 !px-4 !text-sm"
                        >
                           {doctor.price}
                        </Button>
                     </div>
                  </Card>
               ))
            )}
         </div>
      </div>
   );
};

export default DoctorsPage;
