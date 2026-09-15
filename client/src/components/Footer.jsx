import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, PhoneCall, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-800">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-crimson-600 flex items-center justify-center text-white">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                Hemo<span className="text-crimson-500">Life</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering communities through seamless blood donation, emergency stock management, and donor outreach. Every drop counts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/stock" className="hover:text-crimson-400 transition-colors">Check Blood Stock</Link></li>
              <li><Link to="/donate" className="hover:text-crimson-400 transition-colors">Donate Blood Slot</Link></li>
              <li><Link to="/request" className="hover:text-crimson-400 transition-colors">Request Emergency Blood</Link></li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">24/7 Emergency Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3 text-emerald-400 font-semibold">
                <PhoneCall className="w-4 h-4" />
                <span>Hotline: 1800 256 6354</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <Mail className="w-4 h-4 text-crimson-400" />
                <span>bloodlife@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3 text-slate-400">
                <MapPin className="w-4 h-4 text-crimson-400 mt-1 flex-shrink-0" />
                <span>1205, Appaswamy Village, Altzer, Perungudi, Chennai - 600 115</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HemoLife Blood Bank System. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Single Action-Based Unified Portal (Donor / Acceptor)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
