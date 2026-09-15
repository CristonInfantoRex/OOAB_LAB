import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import StockCard from '../components/StockCard';
import FindDonorsModal from '../components/FindDonorsModal';
import { AuthContext } from '../context/AuthContext';
import { Activity, RefreshCw, AlertCircle } from 'lucide-react';

const StockPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'critical', 'optimal'
  const [selectedGroupModal, setSelectedGroupModal] = useState(null);
  const { isAdmin } = useContext(AuthContext);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await API.get('/inventory');
      if (res.data.success) {
        setInventory(res.data.inventory || []);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter((item) => {
    if (filter === 'critical') return item.units < 8;
    if (filter === 'optimal') return item.units >= 8;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700">
        <div>
          <div className="inline-flex items-center space-x-2 text-crimson-500 text-xs font-bold uppercase tracking-widest mb-1">
            <Activity className="w-4 h-4" />
            <span>Central Blood Bank Inventory</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Real-Time Blood Stock Monitor
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Expand any blood group list item to request or book a donation slot.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 p-1 rounded-2xl border border-slate-700 flex text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                filter === 'all' ? 'bg-slate-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Groups ({inventory.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                filter === 'critical' ? 'bg-crimson-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Low / Critical
            </button>
            <button
              onClick={() => setFilter('optimal')}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                filter === 'optimal' ? 'bg-emerald-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Optimal
            </button>
          </div>

          <button
            onClick={fetchInventory}
            className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-crimson-400 hover:bg-slate-700 transition-colors shadow-sm"
            title="Refresh Stock Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expandable Accordion List of Stock Items */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="w-10 h-10 border-4 border-crimson-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span className="text-sm font-medium">Fetching real-time stock parameters...</span>
        </div>
      ) : filteredInventory.length === 0 ? (
        <div className="py-16 text-center bg-slate-800 rounded-3xl border border-dashed border-slate-600">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="font-bold text-slate-300">No matching stock items</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInventory.map((item) => (
            <StockCard
              key={item.bloodGroup}
              bloodGroup={item.bloodGroup}
              units={item.units}
              lastUpdated={item.lastUpdated}
              isAdmin={isAdmin}
              onFindDonors={(group) => setSelectedGroupModal(group)}
            />
          ))}
        </div>
      )}

      {/* Emergency Donor Outreach Modal Trigger */}
      {selectedGroupModal && (
        <FindDonorsModal
          bloodGroup={selectedGroupModal}
          onClose={() => setSelectedGroupModal(null)}
        />
      )}

    </div>
  );
};

export default StockPage;
