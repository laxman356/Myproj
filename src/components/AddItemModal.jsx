import { useState } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';

const CATEGORIES = [
  'Necklace Sets', 'Necklaces', 'Earrings', 'Bangles', 'Bracelets',
  'Rings', 'Anklets', 'Maang Tikka', 'Nose Rings', 'Haar', 'Complete Bridal Set',
];

const EVENT_TYPES = [
  'Wedding', 'Engagement', 'Sangeet', 'Festival', 'Puja',
  'Religious Ceremony', 'Party', 'Anniversary', 'Birthday',
  'Corporate Event', 'Cultural Event', 'Reception',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai',
  'Kolkata', 'Jaipur', 'Ahmedabad', 'Udaipur', 'Pune', 'Surat',
];

export default function AddItemModal({ onClose, onSave, initialData }) {
  const [form, setForm] = useState(initialData || {
    name: '',
    description: '',
    category: '',
    eventTypes: [],
    pricePerDay: '',
    deposit: '',
    location: '',
    images: [''],
  });

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const toggleEvent = (ev) => {
    set('eventTypes', form.eventTypes.includes(ev)
      ? form.eventTypes.filter(e => e !== ev)
      : [...form.eventTypes, ev]
    );
  };

  const updateImage = (idx, val) => {
    const imgs = [...form.images];
    imgs[idx] = val;
    set('images', imgs);
  };

  const addImageSlot = () => set('images', [...form.images, '']);
  const removeImageSlot = (idx) => set('images', form.images.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.pricePerDay || !form.location) return;
    if (form.eventTypes.length === 0) return;
    onSave({
      ...form,
      pricePerDay: Number(form.pricePerDay),
      deposit: Number(form.deposit) || 0,
      images: form.images.filter(Boolean),
      availability: form.availability || [],
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? 'Edit Item' : 'Add New Jewelry'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jewelry Name *</label>
            <input
              className="input-apple"
              placeholder="e.g. Royal Kundan Necklace Set"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              className="input-apple resize-none"
              rows={3}
              placeholder="Describe the piece, materials, occasion suitability..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Category + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select
                className="select-apple"
                value={form.category}
                onChange={e => set('category', e.target.value)}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
              <select
                className="select-apple"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                required
              >
                <option value="">Select city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Deposit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per Day (₹) *</label>
              <input
                type="number"
                className="input-apple"
                placeholder="e.g. 2500"
                value={form.pricePerDay}
                onChange={e => set('pricePerDay', e.target.value)}
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Security Deposit (₹)</label>
              <input
                type="number"
                className="input-apple"
                placeholder="e.g. 10000"
                value={form.deposit}
                onChange={e => set('deposit', e.target.value)}
                min={0}
              />
            </div>
          </div>

          {/* Event Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Suitable For * <span className="text-gray-400 font-normal">(select all that apply)</span></label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TYPES.map(ev => (
                <button
                  key={ev}
                  type="button"
                  onClick={() => toggleEvent(ev)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    form.eventTypes.includes(ev)
                      ? 'bg-yellow-500 text-white border-yellow-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {ev}
                </button>
              ))}
            </div>
            {form.eventTypes.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Select at least one event type</p>
            )}
          </div>

          {/* Image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Image URLs <span className="text-gray-400 font-normal">(paste direct image links)</span>
            </label>
            <div className="space-y-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className="input-apple flex-1"
                    placeholder="https://..."
                    value={img}
                    onChange={e => updateImage(idx, e.target.value)}
                  />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => removeImageSlot(idx)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {form.images.length < 4 && (
              <button type="button" onClick={addImageSlot}
                className="mt-2 text-sm text-blue-600 flex items-center gap-1 hover:underline">
                <Plus size={14} /> Add another image
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="btn-outline-dark flex-1 justify-center py-3">
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.eventTypes.length === 0}
              className="btn-gold flex-1 justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialData ? 'Save Changes' : 'Add Jewelry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
