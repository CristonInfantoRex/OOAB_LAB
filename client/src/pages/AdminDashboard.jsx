import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import RequestCard from '../components/RequestCard';
import FindDonorsModal from '../components/FindDonorsModal';
import { AuthContext } from '../context/AuthContext';
import { Shield, Activity, Plus, Minus, UserSearch, RefreshCw, CheckCircle2, Package } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedGroupModal, setSelectedGroupModal] = useState(null);
  const [updateMsg, setUpdateMsg] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invRes, reqRes] = await Promise.all([
        API.get('/inventory'),
        API.get('/requests')
      ]);

      if (invRes.data.success) setInventory(invRes.data.inventory || []);
      if (reqRes.data.success) setRequests(reqRes.data.requests || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick Inline Stock Update
  const handleStockAdjust = async (bloodGroup, action) => {
    try {
      const res = await API.put(`/inventory/${encodeURIComponent(bloodGroup)}`, {
        action,
        units: 1
      });

      if (res.data.success) {
        setInventory(prev => prev.map(item => 
          item.bloodGroup === bloodGroup ? res.data.item : item
        ));
        setUpdateMsg(`Updated stock for Group ${bloodGroup}`);
        setTimeout(() => setUpdateMsg(null), 2500);
      }
    } catch (err) {
      console.error('Stock update failed:', err);
    }
  };

  // Request Status Update
  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const res = await API.put(`/requests/${requestId}/status`, { status: newStatus });
      if (res.data.success) {
        setRequests(prev => prev.map(req => 
          req._id === requestId ? { ...req, status: newStatus } : req
        ));
        // Refresh inventory to reflect automated stock transfer if fulfilled
        fetchData();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const filteredRequests = requests.filter(req => {
    if (statusFilter === 'all') return true;
    return req.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-crimson-600 flex items-center justify-center font-bold text-white shadow-soft-glow">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-heading font-extrabold text-2xl text-white">Blood Bank Control Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-crimson-500 text-white tracking-widest">
                ADMIN ROLE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as {user?.name} ({user?.email}) • Manager Access Granted
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center space-x-2 border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh All Feeds</span>
        </button>
      </div>

      {/* Toast Notification */}
      {updateMsg && (
        <div className="p-3 bg-emerald-950/80 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center justify-between border border-emerald-800 animate-fade-in">
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" /> {updateMsg}</span>
        </div>
      )}

      {/* Stock Management Quick Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-crimson-500" />
            <span>Stock Inventory Manager</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Quick inline +/- unit adjust</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {inventory.map((item) => (
            <div
              key={item.bloodGroup}
              className={`bg-slate-800 rounded-2xl p-4 border text-center shadow-md flex flex-col justify-between space-y-3 ${
                item.units === 0 ? 'border-rose-600/80 bg-rose-950/40' : 'border-slate-700'
              }`}
            >
              <div>
                <span className="font-heading font-extrabold text-lg text-white block">{item.bloodGroup}</span>
                <span className={`text-2xl font-extrabold font-mono block ${item.units === 0 ? 'text-rose-400' : 'text-slate-100'}`}>
                  {item.units}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Units</span>
              </div>

              {/* Quick +/- Buttons */}
              <div className="flex items-center justify-center space-x-1 pt-2 border-t border-slate-700">
                <button
                  onClick={() => handleStockAdjust(item.bloodGroup, 'subtract')}
                  className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center transition-colors"
                  title="Remove 1 Unit"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleStockAdjust(item.bloodGroup, 'add')}
                  className="w-7 h-7 rounded-lg bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs flex items-center justify-center transition-colors"
                  title="Add 1 Unit"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Find Donors shortcut for low/zero stock */}
              <button
                onClick={() => setSelectedGroupModal(item.bloodGroup)}
                className={`w-full py-1 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 transition-colors ${
                  item.units === 0 
                    ? 'bg-crimson-600 text-white hover:bg-crimson-700' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <UserSearch className="w-3 h-3" />
                <span>Outreach</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Requests Management Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-700">
          <div>
            <h2 className="font-heading font-bold text-xl text-white flex items-center space-x-2">
              <Package className="w-5 h-5 text-slate-300" />
              <span>Incoming Requests &amp; Donation Slots ({requests.length})</span>
            </h2>
            <p className="text-xs text-slate-400">Approve, reject, or mark requests as fulfilled to update stock automatically.</p>
          </div>

          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex text-xs font-semibold">
            {['all', 'pending', 'approved', 'fulfilled', 'rejected'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  statusFilter === st ? 'bg-slate-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading requests database...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-12 text-center bg-slate-800 rounded-3xl border border-dashed border-slate-700 text-slate-400 text-xs">
            No requests matching filter status "{statusFilter}"
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map(req => (
              <RequestCard
                key={req._id}
                request={req}
                isAdmin={true}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Emergency Donor Outreach Modal */}
      {selectedGroupModal && (
        <FindDonorsModal
          bloodGroup={selectedGroupModal}
          onClose={() => setSelectedGroupModal(null)}
        />
      )}

    </div>
  );
};

export default AdminDashboard;
