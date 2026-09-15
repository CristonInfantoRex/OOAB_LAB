import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Droplet, Lock, Mail, Phone, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

const Login = () => {
  const { login, googleLogin, sendOtp, verifyOtp, quickDemoLogin, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [mode, setMode] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      navigate(res.user.role === 'admin' ? '/admin' : redirect);
    } else {
      setError(res?.message || 'Login failed');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    const res = await sendOtp(phone);
    setLoading(false);
    if (res.success) { setOtpSent(true); setError(null); }
    else { setError(res.message); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await verifyOtp(phone, otp);
    setLoading(false);
    if (res.success) {
      if (res.isNewUser) navigate(`/register?phone=${phone}`);
      else navigate(res.user?.role === 'admin' ? '/admin' : redirect);
    } else { setError(res.message); }
  };

  const handleGoogleSubmit = async () => {
    setLoading(true);
    const res = await googleLogin('john@example.com', 'John Doe (Google)', 'A+');
    setLoading(false);
    if (res?.success) navigate(res.user.role === 'admin' ? '/admin' : redirect);
  };

  const handleDemo = async (role) => {
    setLoading(true);
    const res = await quickDemoLogin(role);
    setLoading(false);
    if (res?.success) navigate(role === 'admin' ? '/admin' : redirect);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-crimson-600 text-white flex items-center justify-center mx-auto shadow-soft-glow">
            <Droplet className="w-6 h-6 fill-white" />
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Log in to manage your blood donations &amp; requests</p>
        </div>

        {/* Quick Demo Logins Box */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            One-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemo('admin')}
              className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-crimson-400" />
              <span>Demo Admin</span>
            </button>
            <button
              onClick={() => handleDemo('user')}
              className="py-2 px-3 bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Demo Donor</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => { setMode('password'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-colors ${
              mode === 'password' ? 'bg-slate-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Email &amp; Password
          </button>
          <button
            onClick={() => { setMode('otp'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-colors ${
              mode === 'otp' ? 'bg-slate-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {(error || authError) && (
          <div className="p-3 bg-rose-900/50 text-rose-300 rounded-xl text-xs font-semibold text-center border border-rose-800">
            {error || authError}
          </div>
        )}

        {/* Email Password Form */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bloodbank.org or john@example.com"
                  className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 focus:border-crimson-600 transition-all"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 focus:border-crimson-600 transition-all"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-sm shadow-soft-glow transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Logging in...' : 'Log In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Phone OTP Form */}
        {mode === 'otp' && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 transition-all"
                      required
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-sm transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending Code...' : 'Send OTP Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-amber-900/40 text-amber-300 rounded-xl text-xs border border-amber-700/50">
                  Demo OTP Code: <strong>123456</strong> sent to {phone}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-800 border border-slate-600 rounded-2xl px-4 py-3 text-center text-lg font-mono font-bold text-white placeholder-slate-500 focus:ring-2 focus:ring-crimson-600 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-crimson-600 hover:bg-crimson-700 text-white font-bold text-sm shadow-soft-glow transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Log In'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-700 w-full"></div>
          <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 relative">OR</span>
        </div>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSubmit}
          className="w-full py-3 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-crimson-500 hover:underline">
            Register single donor/acceptor account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
