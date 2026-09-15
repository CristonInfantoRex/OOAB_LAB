import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Droplet, User, Mail, Phone, Lock, MapPin, Heart, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await register({ name, email, phone, password, bloodGroup, city, address });
    setLoading(false);
    if (res?.success) navigate('/dashboard');
    else setError(res?.message || 'Registration failed');
  };

  const inputClass = "w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 focus:border-crimson-600 transition-all";
  const labelClass = "block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-crimson-600 to-crimson-800 text-white flex items-center justify-center mx-auto shadow-soft-glow">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">Single Registration Account</h1>
          <p className="text-xs text-slate-400">
            Register once to both donate blood or request emergency units anytime
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-900/50 text-rose-300 rounded-2xl text-xs font-semibold text-center border border-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" className={inputClass} required />
                <User className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className={labelClass}>Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-crimson-600 transition-all">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg} className="bg-slate-800">Blood Group {bg}</option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com" className={inputClass} required />
                <Mail className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210" className={inputClass} required />
                <Phone className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

          </div>

          {/* Password */}
          <div>
            <label className={labelClass}>Create Password</label>
            <div className="relative">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters" className={inputClass} required />
              <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>City / Region</label>
              <div className="relative">
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="Chennai" className={inputClass} required />
                <MapPin className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Street Address / Landmark</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Oak St, Suite 4" className={inputClass} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-extrabold text-sm shadow-soft-glow transition-all disabled:opacity-50 flex items-center justify-center space-x-2">
            <span>{loading ? 'Creating Account...' : 'Complete Account Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        <p className="text-center text-xs text-slate-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-crimson-500 hover:underline">Log in here</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
