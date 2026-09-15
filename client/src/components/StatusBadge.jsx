import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return {
          bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
          label: 'Approved'
        };
      case 'fulfilled':
        return {
          bg: 'bg-blue-950/70 text-blue-300 border-blue-800/80',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
          label: 'Fulfilled'
        };
      case 'rejected':
        return {
          bg: 'bg-rose-950/70 text-rose-300 border-rose-800/80',
          icon: <XCircle className="w-3.5 h-3.5 mr-1" />,
          label: 'Rejected'
        };
      case 'pending':
      default:
        return {
          bg: 'bg-amber-950/70 text-amber-300 border-amber-800/80',
          icon: <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />,
          label: 'Pending'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
