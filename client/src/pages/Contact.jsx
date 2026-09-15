import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Info Box */}
        <div className="space-y-6">
          <div>
            <span className="text-crimson-500 font-bold text-xs uppercase tracking-widest block mb-1">Get in Touch</span>
            <h1 className="font-heading font-extrabold text-3xl text-white">We're Here 24/7 For Emergency Inquiries</h1>
            <p className="text-slate-400 text-sm mt-2">
              Have questions regarding blood donation slots, emergency stock, or hospital partnerships? Reach out directly.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center space-x-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-crimson-900/60 text-crimson-400 flex items-center justify-center border border-crimson-700/50">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Emergency Hotline</span>
                <span className="font-bold text-white text-sm">1800-BLOOD-LIFE (1800 256 6354)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Email Support</span>
                <span className="font-bold text-white text-sm">bloodlife@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center border border-emerald-700/50">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-semibold block">Headquarters</span>
                <span className="font-bold text-white text-sm">1205, Appaswamy Village, Altzer, Perungudi, Chennai - 600 115</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form - Full Dark Theme */}
        <div className="bg-slate-900 rounded-3xl p-8 border border-slate-700 shadow-xl">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-heading font-bold text-xl text-white">Message Sent!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out. Our support team will respond to your query shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-heading font-bold text-xl text-white mb-2">Send a Direct Message</h3>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 focus:border-crimson-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 focus:border-crimson-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="How can we assist you?"
                  className="w-full bg-slate-800 border border-slate-600 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 focus:border-crimson-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-sm shadow-soft-glow transition-all flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;
