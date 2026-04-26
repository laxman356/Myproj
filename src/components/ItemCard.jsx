import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar } from 'lucide-react';

export default function ItemCard({ item, selectedDate }) {
  const isAvailable = selectedDate ? item.availability.includes(selectedDate) : true;

  return (
    <Link to={`/item/${item.id}`} className="block">
      <div className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80'; }}
          />
          {/* Availability badge */}
          {selectedDate && (
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}>
              {isAvailable ? '✓ Available' : '✗ Booked'}
            </div>
          )}
          {/* Category tag */}
          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {item.category}
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
            {item.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <MapPin size={11} className="text-gray-400" />
            <span className="text-xs text-gray-400">{item.location}</span>
          </div>

          {/* Event types */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.eventTypes.slice(0, 2).map(ev => (
              <span key={ev} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-100">
                {ev}
              </span>
            ))}
            {item.eventTypes.length > 2 && (
              <span className="text-xs text-gray-400">+{item.eventTypes.length - 2}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-gray-900">₹{item.pricePerDay.toLocaleString()}</span>
              <span className="text-xs text-gray-400">/day</span>
            </div>
            {item.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium text-gray-700">{item.rating}</span>
                <span className="text-xs text-gray-400">({item.reviews})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <Calendar size={11} />
            <span>{item.availability.length} days available</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
