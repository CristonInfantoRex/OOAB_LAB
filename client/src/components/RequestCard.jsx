import React from 'react';
import StatusBadge from './StatusBadge';
import { HeartHandshake, Stethoscope, Clock, MapPin, CheckCircle, XCircle, PackageCheck } from 'lucide-react';

const RequestCard = ({ request, onUpdateStatus, isAdmin }) => {
  const isDonate = request.type === 'donate';

  return (
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-md hover:border-slate-600 transition-all space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDonate ? 'bg-emerald-900/60 text-emerald-400 border border-emerald-700/50' : 'bg-crimson-900/60 text-crimson-400 border border-crimson-700/50'
          }`}>
            {isDonate ? <HeartHandshake className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-bold text-white capitalize text-base">
                {isDonate ? 'Blood Donation Slot' : 'Emergency Blood Request'}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase bg-slate-900 text-crimson-400 border border-slate-700 font-mono">
                {request.bloodGroup}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Submitted by <span className="font-semibold text-slate-200">{request.userName || 'User'}</span> ({request.userPhone || 'N/A'})
            </p>
          </div>
        </div>

        <StatusBadge status={request.status} />
      </div>

      <div className="py-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span><strong className="text-slate-200">Time:</strong> {request.preferredTime || 'Asap'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span><strong className="text-slate-200">Facility:</strong> {request.hospital || 'Central Clinic'}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-200">Quantity:</span> {request.units} Unit(s)
        </div>
      </div>

      {request.reason && (
        <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 italic">
          "{request.reason}"
        </p>
      )}

      {/* Admin Quick Action Controls */}
      {isAdmin && request.status === 'pending' && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2 justify-end">
          <button
            onClick={() => onUpdateStatus(request._id, 'approved')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Approve Request</span>
          </button>
          <button
            onClick={() => onUpdateStatus(request._id, 'fulfilled')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Fulfill & Update Stock</span>
          </button>
          <button
            onClick={() => onUpdateStatus(request._id, 'rejected')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-rose-900/60 hover:text-rose-300 text-slate-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors border border-slate-600"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>
        </div>
      )}

      {isAdmin && request.status === 'approved' && (
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2 justify-end">
          <button
            onClick={() => onUpdateStatus(request._id, 'fulfilled')}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Mark as Fulfilled (Stock Transferred)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
