import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { Droplet, User, Shield, LogOut, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout, quickDemoLogin, isAdmin } = useContext(AuthContext);
  const { setIsOpen, isOpen } = useContext(ChatContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-crimson-800 to-crimson-600 flex items-center justify-center text-white shadow-soft-glow group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-white" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white group-hover:text-crimson-400 transition-colors">
                Hemo<span className="text-crimson-500">Life</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Blood Bank Portal
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive('/') ? 'text-crimson-400 font-semibold bg-crimson-950/60' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Home
            </Link>

            <Link
              to="/stock"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive('/stock') ? 'text-crimson-400 font-semibold bg-crimson-950/60' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Blood Stock
            </Link>

            <Link
              to="/donate"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive('/donate') ? 'text-crimson-400 font-semibold bg-crimson-950/60' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Donate Blood
            </Link>

            <Link
              to="/request"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive('/request') ? 'text-crimson-400 font-semibold bg-crimson-950/60' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Request Blood
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive('/contact') ? 'text-crimson-400 font-semibold bg-crimson-950/60' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">

            {/* Demo Role Toggle Switch */}
            <div className="hidden xl:flex items-center space-x-2 bg-black p-1 rounded-full border border-black">
              <span className="pl-2 text-white font-mono text-[10px] uppercase tracking-wider">Demo</span>
              {/* Toggle pill */}
              <button
                onClick={() => quickDemoLogin(isAdmin ? 'user' : 'admin')}
                title="Switch between Admin and User demo account"
                className="relative flex items-center w-28 h-7 rounded-full bg-black border border-white/20 transition-all duration-300 focus:outline-none overflow-hidden"
              >
                {/* Sliding thumb */}
                <span
                  className={`absolute top-0.5 h-6 w-[52px] rounded-full shadow transition-all duration-300 flex items-center justify-center text-[10px] font-extrabold tracking-wide ${
                    isAdmin
                      ? 'left-0.5 bg-white text-black'
                      : 'left-[calc(100%-54px)] bg-crimson-600 text-white'
                  }`}
                >
                  {isAdmin ? (
                    <span className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>Admin</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>User</span>
                    </span>
                  )}
                </span>

              </button>
            </div>

            {/* Socket Chat Icon */}
            {user && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-full border transition-all relative ${
                  isOpen
                    ? 'bg-crimson-600 text-white border-crimson-600 shadow-soft-glow'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-crimson-50 hover:text-crimson-700'
                }`}
                title="Real-time Chat Support"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </button>
            )}

            {/* User Profile / Dashboard / Auth buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-crimson-700 transition-all shadow-sm text-sm font-semibold"
                >
                  {isAdmin ? <Shield className="w-4 h-4 text-crimson-400" /> : <User className="w-4 h-4 text-crimson-300" />}
                  <span>{isAdmin ? 'Admin Portal' : 'My Dashboard'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono font-bold uppercase">
                    {user.bloodGroup}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2.5 text-slate-500 hover:text-crimson-600 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-crimson-700 text-white hover:bg-crimson-800 transition-all text-sm font-semibold shadow-soft-glow flex items-center"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
