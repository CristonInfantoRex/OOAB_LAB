import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import API from '../api/axios';
import RequestCard from '../components/RequestCard';
import { Heart, Droplet, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const { setIsOpen } = useContext(ChatContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const res = await API.get('/requests/mine');
        if (res.data.success) setRequests(res.data.requests || []);
      } catch (err) {
        console.error('Error fetching user requests:', err);
      } finally { setLoading(false); }
    };
    if (user) fetchMyRequests();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson-600 to-crimson-800 flex items-center justify-center font-heading font-extrabold text-2xl shadow-soft-glow">
            {user.bloodGroup}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-heading font-bold text-2xl text-white">{user.name}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Member
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Phone: {user.phone} • Email: {user.email} • Location: {user.city || 'Chennai'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link to="/donate"
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-soft-glow transition-all">
            <Heart className="w-4 h-4 fill-white" />
            <span>Donate Slot</span>
          </Link>
          <Link to="/request"
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md transition-all">
            <Droplet className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Request Blood</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-crimson-900/50 text-crimson-400 flex items-center justify-center border border-crimson-700/40">
            <Heart className="w-6 h-6 fill-crimson-500" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-white">
              {requests.filter(r => r.type === 'donate' && r.status === 'fulfilled').length}
            </span>
            <span className="block text-xs text-slate-400 font-medium">Completed Donations</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-600">
            <Droplet className="w-6 h-6 text-rose-500 fill-rose-500" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-white">
              {requests.filter(r => r.type === 'request').length}
            </span>
            <span className="block text-xs text-slate-400 font-medium">Submitted Requests</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center border border-emerald-700/40">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase block">Eligible Donor</span>
            <span className="text-xs text-slate-400 font-medium">Ready for voluntary slot</span>
          </div>
        </div>

      </div>

      {/* Activity History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-white">
            My Activity History ({requests.length})
          </h2>
          <button onClick={() => setIsOpen(true)}
            className="text-xs font-semibold text-crimson-400 hover:text-crimson-300 flex items-center space-x-1">
            <MessageSquare className="w-4 h-4" />
            <span>Chat Support</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading activity history...</div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center bg-slate-800 rounded-3xl border border-dashed border-slate-600 space-y-3">
            <Clock className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-bold text-slate-300">No requests submitted yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Book a voluntary donation slot or request blood units whenever required.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <RequestCard key={req._id} request={req} isAdmin={false} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserDashboard;
