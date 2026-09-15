import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { Droplet, AlertTriangle, Hospital, ShieldAlert, CheckCircle2 } from 'lucide-react';

const RequestBlood = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bloodGroup, setBloodGroup] = useState(searchParams.get('bloodGroup') || 'A+');
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState('Emergency (Immediate)');
  const [hospital, setHospital] = useState('City Care Hospital');
  const [reason, setReason] = useState('');
  const [currentStock, setCurrentStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkStock = async () => {
      try {
        const res = await API.get('/inventory');
        if (res.data.success) {
          const item = res.data.inventory.find(i => i.bloodGroup === bloodGroup);
          setCurrentStock(item ? item.units : 0);
        }
      } catch (err) { console.error('Error checking stock:', err); }
    };
    checkStock();
  }, [bloodGroup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login?redirect=/request'); return; }
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await API.post('/requests', { type: 'request', bloodGroup, units: Number(units), preferredTime: urgency, hospital, reason });
      if (res.data.success) {
        setMessage(res.data.message || 'Blood request submitted successfully!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit blood request');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 focus:border-crimson-600 transition-all";
  const labelClass = "block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700 space-y-8">

        {/* Centered Page Header (Icon Removed) */}
        <div className="text-center pb-6 border-b border-slate-700 max-w-2xl mx-auto space-y-1">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">Submit Blood Request</h1>
          <p className="text-slate-400 text-xs sm:text-sm">Request required blood units for surgeries, emergencies, or medical procedures.</p>
        </div>

        {/* Live Stock Warning */}
        {currentStock !== null && (
          <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            currentStock === 0
              ? 'bg-crimson-900/40 text-crimson-300 border-crimson-700/60'
              : currentStock < 5
              ? 'bg-amber-900/40 text-amber-300 border-amber-700/60'
              : 'bg-emerald-900/40 text-emerald-300 border-emerald-700/60'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Current Stock for <strong>Group {bloodGroup}</strong>: <strong>{currentStock} Units</strong> available.</span>
            </div>
            {currentStock === 0 && (
              <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 bg-crimson-600 text-white rounded">
                Emergency Outreach Triggered
              </span>
            )}
          </div>
        )}

        {/* Alerts */}
        {message && (
          <div className="p-4 bg-emerald-900/40 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center border border-emerald-700/50">
            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" />{message}
          </div>
        )}
        {error && (
          <div className="p-4 bg-rose-900/40 text-rose-300 rounded-2xl text-xs font-semibold flex items-center border border-rose-700/50">
            <ShieldAlert className="w-5 h-5 mr-2 text-rose-400" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Blood Group */}
            <div>
              <label className={labelClass}>Required Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={inputClass}>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg} className="bg-slate-800">Blood Group {bg}</option>
                ))}
              </select>
            </div>

            {/* Units */}
            <div>
              <label className={labelClass}>Units Required</label>
              <input type="number" min="1" max="10" value={units} onChange={(e) => setUnits(e.target.value)}
                className={inputClass} required />
            </div>

            {/* Urgency */}
            <div>
              <label className={labelClass}>Urgency Level / Timeframe</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className={inputClass}>
                <option value="Emergency (Immediate)" className="bg-slate-800">Emergency (Immediate)</option>
                <option value="Within 6 Hours" className="bg-slate-800">Within 6 Hours</option>
                <option value="Within 24 Hours" className="bg-slate-800">Within 24 Hours</option>
                <option value="Scheduled Procedure (Next 2-3 Days)" className="bg-slate-800">Scheduled Procedure (Next 2-3 Days)</option>
              </select>
            </div>

            {/* Hospital */}
            <div>
              <label className={labelClass}>Hospital / Delivery Location</label>
              <div className="relative">
                <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)}
                  placeholder="e.g. City General Hospital, Room 304" className={inputClass} required />
                <Hospital className="w-5 h-5 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className={labelClass}>Reason / Diagnosis / Patient Condition</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
              placeholder="e.g. Emergency surgery, trauma case, anemia treatment..."
              className="w-full bg-slate-800 border border-slate-600 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 transition-all"
              required />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold text-sm shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2">
            <Droplet className="w-5 h-5 text-white fill-white" />
            <span>{loading ? 'Submitting Request...' : 'Submit Blood Request'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default RequestBlood;
