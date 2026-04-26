import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Gem, Eye, EyeOff, ArrowRight, Package, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') || '';

  const [userType, setUserType] = useState(defaultType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (!userType) { setError('Please select your account type.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    const result = signup(name, email, password, userType);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    if (userType === 'owner') navigate('/dashboard');
    else navigate('/browse');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Gem size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Ornamint</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of jewelry lovers</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* User type selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">I want to…</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('renter')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  userType === 'renter'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Search size={22} className={userType === 'renter' ? 'text-blue-600' : 'text-gray-400'} />
                <p className={`font-semibold text-sm mt-2 ${userType === 'renter' ? 'text-blue-700' : 'text-gray-700'}`}>
                  Rent Jewelry
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Browse & rent pieces</p>
              </button>

              <button
                type="button"
                onClick={() => setUserType('owner')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  userType === 'owner'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Package size={22} className={userType === 'owner' ? 'text-yellow-600' : 'text-gray-400'} />
                <p className={`font-semibold text-sm mt-2 ${userType === 'owner' ? 'text-yellow-700' : 'text-gray-700'}`}>
                  List Jewelry
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Earn from your pieces</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              className="input-apple"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              className="input-apple"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                className="input-apple pr-12"
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full justify-center py-3 text-sm ${userType === 'owner' ? 'btn-gold' : 'btn-primary'}`}
          >
            {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight size={15} />}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By signing up you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
