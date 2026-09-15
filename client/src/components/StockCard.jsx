import React, { useState } from 'react';
import { Droplet, AlertTriangle, UserSearch, ChevronDown, ChevronUp, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StockCard = ({ bloodGroup, units, lastUpdated, onFindDonors, isAdmin }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const maxCapacity = 30;
  const percentage = Math.min(100, Math.round((units / maxCapacity) * 100));

  const getStatusColor = () => {
    if (units === 0) return {
      text: 'text-rose-400',
      bg: 'bg-rose-600',
      badge: 'bg-rose-900/60 text-rose-300 border-rose-700',
      label: 'CRITICAL (0 Units)'
    };
    if (units < 8) return {
      text: 'text-amber-400',
      bg: 'bg-amber-500',
      badge: 'bg-amber-900/50 text-amber-300 border-amber-700',
      label: 'Low Stock'
    };
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      badge: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
      label: 'Optimal Availability'
    };
  };

  const status = getStatusColor();

  return (
    <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden transition-all duration-200 shadow-lg hover:border-slate-600">
      {/* Clickable Header Row */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-slate-750 transition-colors gap-4"
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading font-extrabold text-xl text-white shadow-md flex-shrink-0 ${
            units === 0 ? 'bg-slate-700 border border-slate-600' : 'bg-gradient-to-br from-crimson-600 to-crimson-700'
          }`}>
            {bloodGroup}
          </div>

          <div>
            <div className="flex items-center space-x-3">
              <h3 className="font-heading font-bold text-lg text-white">Blood Group {bloodGroup}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.badge}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click row to expand options &amp; action buttons
            </p>
          </div>
        </div>

        {/* Right side availability & expand arrow */}
        <div className="flex items-center justify-between sm:justify-end space-x-6">
          <div className="text-left sm:text-right">
            <span className={`text-2xl font-extrabold font-heading ${status.text}`}>
              {units} <span className="text-sm font-medium text-slate-400 font-sans">Units</span>
            </span>
            <div className="w-28 bg-slate-700 h-2 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${status.bg}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <button 
            className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-300 transition-colors"
            aria-label="Expand Blood Group Details"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Collapsible Section */}
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-700/80 bg-slate-900/50 space-y-5 animate-fadeIn">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block font-semibold">Available Units</span>
              <span className="text-white text-base font-bold font-heading">{units} Units ({percentage}% of capacity)</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block font-semibold">Status Rating</span>
              <span className={`text-sm font-bold ${status.text}`}>{status.label}</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block font-semibold">Last Verified</span>
              <span className="text-slate-200 font-medium">
                {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </span>
            </div>
          </div>

          {/* Action Buttons - Request and Donate in SAME COLOR as requested */}
          <div className="pt-2">
            {isAdmin ? (
              <button
                onClick={() => onFindDonors && onFindDonors(bloodGroup)}
                className="w-full py-3 px-4 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <UserSearch className="w-4 h-4" />
                <span>Outreach Emergency Donors for Group {bloodGroup}</span>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to={`/request?bloodGroup=${encodeURIComponent(bloodGroup)}`}
                  className="py-3 px-5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-sm text-center flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Droplet className="w-4 h-4 fill-white text-white" />
                  <span>Request Blood</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <Link
                  to={`/donate?bloodGroup=${encodeURIComponent(bloodGroup)}`}
                  className="py-3 px-5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-sm text-center flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Heart className="w-4 h-4 fill-white text-white" />
                  <span>Donate Blood</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard;
