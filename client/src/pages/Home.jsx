import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { Droplet, Heart, Activity, ArrowRight, PhoneCall } from 'lucide-react';

const Home = () => {
  const [stockSummary, setStockSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await API.get('/inventory');
        if (res.data.success) {
          setStockSummary(res.data.inventory || []);
        }
      } catch (err) {
        console.error('Failed to load home stock summary');
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  return (
    <div className="space-y-16 pb-16">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-crimson-950 text-white pt-16 pb-24 rounded-b-[40px] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-crimson-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/15 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">

            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-crimson-900/80 border border-crimson-700/60 text-crimson-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-crimson-400 animate-pulse" />
              <span>Unified Blood Bank &amp; Emergency Outreach Platform</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
              One Platform to <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-400 via-rose-300 to-amber-200">Save Lives</span> &amp; Request Emergency Blood.
            </h1>

            {/* Shortened, clear, and relevant hero sentence */}
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium max-w-2xl">
              Connecting blood donors with patients in urgent need. Check real-time stock, book donation slots, or request emergency blood instantly.
            </p>

            {/* Highlighted Hero Action Buttons */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
              
              {/* Highlighted Donate Blood Card */}
              <Link
                to="/donate"
                className="group relative overflow-hidden bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-crimson-900/50 transition-all transform hover:-translate-y-1 border-2 border-crimson-400/40 flex items-center justify-between"
              >
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Heart className="w-6 h-6 fill-white text-white" />
                    </div>
                    <span className="font-heading font-extrabold text-xl tracking-wide">Donate Blood</span>
                  </div>
                  <p className="text-xs text-crimson-100 font-medium pt-1">Schedule a voluntary donation slot</p>
                </div>
                <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1.5 transition-transform relative z-10" />
              </Link>

              {/* Highlighted Request Blood Card */}
              <Link
                to="/request"
                className="group relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-750 hover:to-slate-800 text-white p-6 rounded-2xl shadow-xl hover:shadow-rose-950/40 transition-all transform hover:-translate-y-1 border-2 border-rose-500/50 flex items-center justify-between"
              >
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 bg-rose-600/30 border border-rose-500/40 rounded-xl">
                      <Droplet className="w-6 h-6 text-rose-400 fill-rose-400" />
                    </div>
                    <span className="font-heading font-extrabold text-xl tracking-wide text-rose-100">Request Blood</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium pt-1">Submit an urgent request form</p>
                </div>
                <ArrowRight className="w-6 h-6 text-rose-400 group-hover:translate-x-1.5 transition-transform relative z-10" />
              </Link>

            </div>

          </div>
        </div>
      </section>

      {/* Live Inventory Bar Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-slate-700 gap-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-crimson-600" />
                <span>Live Blood Stock Availability</span>
              </h2>
              <p className="text-xs text-slate-400">Real-time inventory levels across central healthcare centers</p>
            </div>

            <Link
              to="/stock"
              className="text-crimson-400 hover:text-crimson-300 font-semibold text-xs flex items-center space-x-1 group"
            >
              <span>View Full Stock List</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {loading ? (
              <div className="col-span-full text-center py-6 text-slate-400 text-xs">Loading real-time inventory...</div>
            ) : (
              stockSummary.map((item) => (
                <div
                  key={item.bloodGroup}
                  className={`p-3.5 rounded-2xl text-center border transition-all ${
                    item.units === 0
                      ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                      : item.units < 8
                      ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                      : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                  }`}
                >
                  <span className="font-heading font-extrabold text-lg block">{item.bloodGroup}</span>
                  <span className="font-mono text-sm font-bold block">{item.units} <span className="text-[10px] font-normal font-sans text-slate-400">Units</span></span>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider mt-1 block">
                    {item.units === 0 ? 'CRITICAL' : item.units < 8 ? 'LOW' : 'SAFE'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Emergency Hotline Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-crimson-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 bg-crimson-600 text-white text-[11px] font-extrabold uppercase tracking-widest rounded-full">
              Urgent Medical Assistance
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Need Rare Blood Group Units Immediately?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Our admin team conducts live emergency donor outreach for critical cases. Call our 24/7 helpline or launch live chat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <a
              href="tel:18002566354"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-crimson-900 hover:bg-slate-100 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-crimson-700" />
              <span>Call 1800 256 6354</span>
            </a>
            <Link
              to="/request"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-sm text-center shadow-soft-glow transition-colors"
            >
              Submit Emergency Request
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
