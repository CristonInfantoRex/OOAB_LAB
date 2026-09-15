import React from 'react';
import { ShieldCheck, Heart, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-crimson-900/80 border border-crimson-700/60 text-crimson-300 text-xs font-bold uppercase tracking-widest">
          Mission &amp; Guidelines
        </span>
        <h1 className="font-heading font-extrabold text-4xl text-white">
          Bridging Donors &amp; Healthcare Facilities in Real-Time
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          HemoLife is an integrated blood bank management and emergency outreach system designed to eliminate critical shortages, reduce response times, and save lives.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-crimson-900/60 text-crimson-400 flex items-center justify-center font-bold border border-crimson-700/50">
            <Heart className="w-6 h-6 fill-crimson-500 text-crimson-500" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Who Can Donate Blood?</h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" /> Overall healthy individuals between 18 and 65 years old.</li>
            <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" /> Body weight of at least 50 kg (110 lbs).</li>
            <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" /> Minimum interval of 90 days since your last whole blood donation.</li>
            <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" /> Normal pulse, blood pressure, and hemoglobin levels (&ge;12.5 g/dL).</li>
          </ul>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-200 flex items-center justify-center font-bold border border-slate-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Safety &amp; Verification Protocol</h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" /> Every blood unit undergoes mandatory screening for infectious markers.</li>
            <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" /> Real-time stock counts are verified automatically upon request fulfillment.</li>
            <li className="flex items-start"><CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" /> Automated low-stock triggers instantly notify registered eligible donors.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};

export default About;
