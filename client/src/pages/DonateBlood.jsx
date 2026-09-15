import React, { useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { Heart, Calendar, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';

const DonateBlood = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || user?.bloodGroup || 'A+');
  const [units, setUnits] = useState(1);
  const [preferredTime, setPreferredTime] = useState('Tomorrow 10:00 AM');
  const [hospital, setHospital] = useState('Central Blood Bank Headquarters');
  const [reason, setReason] = useState('Voluntary quarterly blood donation');
  const [healthConfirmed, setHealthConfirmed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login?redirect=/donate'); return; }
    if (!healthConfirmed) { setError('Please confirm pre-donation health check requirements.'); return; }
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await API.post('/requests', { type: 'donate', bloodGroup, units: Number(units), preferredTime, hospital, reason });
      if (res.data.success) {
        setMessage(res.data.message || 'Donation slot booked successfully!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit donation slot request');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 focus:border-crimson-600 transition-all";
  const labelClass = "block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700 space-y-8">

        {/* Centered Page Header (Icon Removed) */}
        <div className="text-center pb-6 border-b border-slate-700 max-w-2xl mx-auto space-y-1">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Book Voluntary Blood Donation Slot
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Schedule your donation slot at a nearby clinic. One donation can save up to 3 lives.
          </p>
        </div>

        {/* Alerts */}
        {message && (
          <div className="p-4 bg-emerald-900/40 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center border border-emerald-700/50">
            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" />
            {message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-900/40 text-rose-300 rounded-2xl text-xs font-semibold flex items-center border border-rose-700/50">
            <ShieldAlert className="w-5 h-5 mr-2 text-rose-400" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Blood Group */}
            <div>
              <label className={labelClass}>Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={inputClass}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg} className="bg-slate-800">Blood Group {bg}</option>
                ))}
              </select>
            </div>

            {/* Units */}
            <div>
              <label className={labelClass}>Units to Donate</label>
              <select value={units} onChange={(e) => setUnits(e.target.value)} className={inputClass}>
                <option value={1} className="bg-slate-800">1 Unit (Standard ~450ml)</option>
                <option value={2} className="bg-slate-800">2 Units (Double Red Cell)</option>
              </select>
            </div>

            {/* Preferred Date/Time */}
            <div>
              <label className={labelClass}>Preferred Slot / Date</label>
              <div className="relative">
                <input type="text" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}
                  placeholder="e.g. Tomorrow 10:00 AM" className={inputClass} required />
                <Calendar className="w-5 h-5 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            {/* Clinic Location */}
            <div>
              <label className={labelClass}>Healthcare Center / Blood Bank</label>
              <div className="relative">
                <select value={hospital} onChange={(e) => setHospital(e.target.value)} className={inputClass}>
                  <option value="Central Blood Bank Headquarters" className="bg-slate-800">Central Blood Bank Headquarters</option>
                  <option value="City Care General Hospital" className="bg-slate-800">City Care General Hospital</option>
                  <option value="Metropolis Red Cross Clinic" className="bg-slate-800">Metropolis Red Cross Clinic</option>
                </select>
                <MapPin className="w-5 h-5 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes / Medical Comments (Optional)</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
              placeholder="Any specific comments or medical history notes..."
              className="w-full bg-slate-800 border border-slate-600 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 transition-all" />
          </div>

          {/* Health Eligibility Box */}
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-600 space-y-3">
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Donor Eligibility Declaration</h4>
            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
              <li>I am between 18 and 65 years of age and weigh over 50 kg.</li>
              <li>I have not donated blood in the past 90 days.</li>
              <li>I am currently in good overall health and free from fever or active infection.</li>
            </ul>
            <label className="flex items-center space-x-2 pt-2 cursor-pointer">
              <input type="checkbox" checked={healthConfirmed} onChange={(e) => setHealthConfirmed(e.target.checked)}
                className="w-4 h-4 text-crimson-600 rounded border-slate-500 bg-slate-700 focus:ring-crimson-500" />
              <span className="text-xs font-semibold text-slate-200">I confirm that I meet the donor eligibility criteria listed above.</span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold text-sm shadow-soft-glow transition-all disabled:opacity-50 flex items-center justify-center space-x-2">
            <Heart className="w-5 h-5 fill-white" />
            <span>{loading ? 'Submitting Slot Booking...' : 'Confirm & Book Donation Slot'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default DonateBlood;
