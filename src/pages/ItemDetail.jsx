import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Calendar, Shield, Sparkles, CheckCircle, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export default function ItemDetail() {
  const { id } = useParams();
  const { items, requestRental } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const item = items.find(i => i.id === id);
  const [imgIdx, setImgIdx] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [wishlist, setWishlist] = useState(false);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <Link to="/browse" className="btn-outline">Back to Browse</Link>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const getDatesInRange = (start, end) => {
    const dates = [];
    const cur = new Date(start);
    const last = new Date(end);
    while (cur <= last) {
      dates.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  };

  const rentalDays = (startDate && endDate)
    ? Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000) + 1)
    : 0;

  const totalPrice = rentalDays * item.pricePerDay;

  const isRangeAvailable = () => {
    if (!startDate || !endDate) return false;
    const range = getDatesInRange(startDate, endDate);
    return range.every(d => item.availability.includes(d));
  };

  const handleBook = () => {
    setBookingError('');
    if (!user) { navigate('/login'); return; }
    if (user.type === 'owner') { setBookingError('Owner accounts cannot make rental requests.'); return; }
    if (!startDate || !endDate) { setBookingError('Please select rental dates.'); return; }
    if (endDate < startDate) { setBookingError('End date must be after start date.'); return; }
    if (!isRangeAvailable()) { setBookingError('Some selected dates are not available. Please choose different dates.'); return; }

    requestRental(item.id, user.id, user.name, startDate, endDate);
    setBookingSubmitted(true);
  };

  const images = item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80'];

  return (
    <div className="min-h-screen bg-white">
      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left: Images */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-4">
              <img
                src={images[imgIdx]}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80'; }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx(i => Math.max(0, i - 1))}
                    disabled={imgIdx === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md disabled:opacity-30 hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImgIdx(i => Math.min(images.length - 1, i + 1))}
                    disabled={imgIdx === images.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md disabled:opacity-30 hover:bg-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <Heart size={18} className={wishlist ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      i === imgIdx ? 'border-gray-900' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&q=80'; }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Availability preview */}
            <div className="mt-6 bg-gray-50 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
              <div className="flex flex-wrap gap-1.5">
                {item.availability.slice(0, 14).map(date => (
                  <span key={date} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                ))}
                {item.availability.length > 14 && (
                  <span className="text-xs text-gray-500 px-2 py-1">+{item.availability.length - 14} more dates</span>
                )}
              </div>
              {item.availability.length === 0 && (
                <p className="text-sm text-gray-500">No available dates at the moment.</p>
              )}
            </div>
          </div>

          {/* Right: Details + Booking */}
          <div>
            {/* Category + rating */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 font-medium">{item.category}</span>
              {item.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star size={15} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">{item.rating}</span>
                  <span className="text-gray-400 text-sm">({item.reviews} reviews)</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{item.name}</h1>

            <div className="flex items-center gap-2 mb-5">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-sm text-gray-500">Listed from {item.location}</span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">by <span className="font-medium text-gray-700">{item.ownerName}</span></span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>

            {/* Event types */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Perfect for</p>
              <div className="flex flex-wrap gap-2">
                {item.eventTypes.map(ev => (
                  <span key={ev} className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full border border-yellow-100 font-medium">
                    {ev}
                  </span>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-2xl p-5 mb-6">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-gray-900">₹{item.pricePerDay.toLocaleString()}</span>
                <span className="text-gray-500">per day</span>
              </div>
              <p className="text-sm text-gray-500">
                Security deposit: ₹{item.deposit.toLocaleString()} (refundable)
              </p>
            </div>

            {/* Booking form */}
            {bookingSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 text-lg mb-1">Booking Request Sent!</h3>
                <p className="text-green-700 text-sm">
                  Your request for <strong>{rentalDays} day{rentalDays > 1 ? 's' : ''}</strong> has been sent to {item.ownerName}.
                  You'll be notified once they confirm.
                </p>
                <Link to="/browse" className="btn-outline mt-4 inline-flex">Browse More</Link>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-semibold text-gray-900">Request to Rent</h3>

                {bookingError && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700 flex items-start gap-2">
                    <X size={15} className="flex-shrink-0 mt-0.5" />
                    {bookingError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">From Date</label>
                    <input
                      type="date"
                      className="input-apple text-sm"
                      min={today}
                      value={startDate}
                      onChange={e => {
                        setStartDate(e.target.value);
                        setBookingError('');
                        if (endDate && e.target.value > endDate) setEndDate('');
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">To Date</label>
                    <input
                      type="date"
                      className="input-apple text-sm"
                      min={startDate || today}
                      value={endDate}
                      onChange={e => { setEndDate(e.target.value); setBookingError(''); }}
                    />
                  </div>
                </div>

                {rentalDays > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">₹{item.pricePerDay.toLocaleString()} × {rentalDays} day{rentalDays > 1 ? 's' : ''}</span>
                      <span className="font-medium text-gray-900">₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Security deposit</span>
                      <span className="font-medium text-gray-900">₹{item.deposit.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Total payable</span>
                      <span className="font-bold text-gray-900">₹{(totalPrice + item.deposit).toLocaleString()}</span>
                    </div>
                    {startDate && endDate && !isRangeAvailable() && (
                      <p className="text-xs text-red-600 font-medium">⚠ Some dates in this range are not available</p>
                    )}
                    {startDate && endDate && isRangeAvailable() && (
                      <p className="text-xs text-green-600 font-medium">✓ All selected dates are available</p>
                    )}
                  </div>
                )}

                <button
                  onClick={handleBook}
                  className="btn-gold w-full justify-center py-3"
                >
                  {user ? 'Request to Rent' : 'Sign in to Rent'}
                  <Calendar size={16} />
                </button>

                {!user && (
                  <p className="text-xs text-center text-gray-500">
                    <Link to="/login" className="text-blue-600 underline">Sign in</Link> or{' '}
                    <Link to="/signup?type=renter" className="text-blue-600 underline">create an account</Link> to rent
                  </p>
                )}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { icon: Shield, label: 'Insured', sub: 'Up to ₹5L' },
                { icon: CheckCircle, label: 'Verified', sub: 'KYC checked' },
                { icon: Sparkles, label: 'Cleaned', sub: 'Before delivery' },
              ].map(t => (
                <div key={t.label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <t.icon size={18} className="text-gray-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-700">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
