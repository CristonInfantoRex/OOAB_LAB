import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { ChatContext } from '../context/ChatContext';
import { X, UserSearch, Phone, Mail, MapPin, CheckCircle, MessageSquare, AlertTriangle } from 'lucide-react';

const FindDonorsModal = ({ bloodGroup, onClose }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setIsOpen, setActiveRecipient } = useContext(ChatContext);

  useEffect(() => {
    const fetchDonors = async () => {
      if (!bloodGroup) return;
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/donors/search?bloodGroup=${encodeURIComponent(bloodGroup)}`);
        if (res.data.success) {
          setDonors(res.data.donors || []);
        }
      } catch (err) {
        setError('Failed to query registered donor database');
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [bloodGroup]);

  const handleStartChat = (donor) => {
    setActiveRecipient(donor);
    setIsOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-700 relative overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-crimson-900/60 text-crimson-400 flex items-center justify-center font-bold border border-crimson-700/50">
              <UserSearch className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-white">
                Emergency Donor Search: <span className="text-crimson-400">Group {bloodGroup}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Direct outreach for registered donors matching blood group {bloodGroup}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 max-h-[60vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-8 h-8 border-3 border-crimson-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <span>Searching eligible donor registry...</span>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-950/60 text-rose-300 rounded-2xl text-xs font-semibold border border-rose-800">
              {error}
            </div>
          ) : donors.length === 0 ? (
            <div className="text-center py-10 bg-slate-800 rounded-2xl border border-dashed border-slate-700">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-200 text-sm">No Match Registered</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No active donors currently registered for group {bloodGroup}. Consider broadcasting a general emergency alert.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                <span>Matching Donors ({donors.length})</span>
                <span>Outreach Status</span>
              </div>

              {donors.map((donor) => (
                <div
                  key={donor._id || donor.email}
                  className="bg-slate-800 hover:bg-slate-750 rounded-2xl p-4 border border-slate-700 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">{donor.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-crimson-600 text-white font-mono">
                        {donor.bloodGroup}
                      </span>
                      {donor.eligible !== false && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> Eligible
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center">
                        <Phone className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        <a href={`tel:${donor.phone}`} className="hover:text-crimson-400 font-semibold text-slate-300">{donor.phone}</a>
                      </span>
                      <span className="flex items-center">
                        <Mail className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        <span className="text-slate-300">{donor.email}</span>
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        <span className="text-slate-300">{donor.city || 'Chennai'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`tel:${donor.phone}`}
                      className="px-3 py-2 rounded-xl bg-slate-700 text-white hover:bg-slate-600 text-xs font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <button
                      onClick={() => handleStartChat(donor)}
                      className="px-3 py-2 rounded-xl bg-crimson-600 text-white hover:bg-crimson-700 text-xs font-semibold flex items-center space-x-1 shadow-soft-glow transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Live Chat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};

export default FindDonorsModal;
