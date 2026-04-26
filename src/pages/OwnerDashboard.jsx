import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Package, Star, TrendingUp, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import AddItemModal from '../components/AddItemModal';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { items, rentals, addItem, updateItem, deleteItem, updateAvailability, updateRentalStatus } = useData();

  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedCalendar, setExpandedCalendar] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const myItems = items.filter(i => i.ownerId === user.id);
  const myRentals = rentals.filter(r => myItems.some(i => i.id === r.itemId));
  const pendingRentals = myRentals.filter(r => r.status === 'pending');
  const totalEarnings = myRentals
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => {
      const item = myItems.find(i => i.id === r.itemId);
      if (!item) return sum;
      const days = Math.max(1, Math.ceil((new Date(r.endDate) - new Date(r.startDate)) / 86400000));
      return sum + item.pricePerDay * days;
    }, 0);

  const handleSaveItem = (data) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
      setEditingItem(null);
    } else {
      addItem({ ...data, ownerId: user.id, ownerName: user.name });
      setShowAddModal(false);
    }
  };

  const handleDelete = (id) => {
    deleteItem(id);
    setDeleteConfirm(null);
  };

  const handleRentalAction = (rentalId, status) => {
    updateRentalStatus(rentalId, status);
  };

  const TABS = [
    { key: 'inventory', label: 'My Inventory', icon: Package },
    { key: 'bookings', label: 'Bookings', icon: Calendar, badge: pendingRentals.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name.split(' ')[0]}</h1>
              <p className="text-gray-500 mt-1">Manage your jewelry inventory and rental requests</p>
            </div>
            {activeTab === 'inventory' && (
              <button onClick={() => setShowAddModal(true)} className="btn-gold">
                <Plus size={16} /> Add Jewelry
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Items', value: myItems.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Pending Requests', value: pendingRentals.length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: 'Active Rentals', value: myRentals.filter(r => r.status === 'approved').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Total Earned', value: `₹${totalEarnings.toLocaleString()}`, icon: TrendingUp, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <stat.icon size={22} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 bg-gray-100 rounded-xl p-1 w-fit">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Inventory Tab ── */}
        {activeTab === 'inventory' && (
          <div>
            {myItems.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 border-dashed">
                <Package size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No jewelry listed yet</h3>
                <p className="text-gray-500 text-sm mb-6">Start earning by listing your first piece</p>
                <button onClick={() => setShowAddModal(true)} className="btn-gold">
                  <Plus size={16} /> Add Your First Item
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Item row */}
                    <div className="p-5 flex gap-5">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&q=80'; }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{item.category} · {item.location}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.eventTypes.slice(0, 3).map(ev => (
                                <span key={ev} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-100">
                                  {ev}
                                </span>
                              ))}
                              {item.eventTypes.length > 3 && (
                                <span className="text-xs text-gray-400">+{item.eventTypes.length - 3} more</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-gray-900 text-lg">₹{item.pricePerDay.toLocaleString()}<span className="text-xs text-gray-400 font-normal">/day</span></p>
                            <p className="text-xs text-gray-500 mt-0.5">Deposit: ₹{item.deposit.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1 font-medium">{item.availability.length} days available</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => setExpandedCalendar(expandedCalendar === item.id ? null : item.id)}
                            className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
                          >
                            <Calendar size={13} />
                            Manage Availability
                            {expandedCalendar === item.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Calendar */}
                    {expandedCalendar === item.id && (
                      <div className="border-t border-gray-100 p-5 bg-gray-50">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Click dates to toggle availability. Green = available for rental.
                        </p>
                        <AvailabilityCalendar
                          availability={item.availability}
                          onChange={(dates) => updateAvailability(item.id, dates)}
                        />
                      </div>
                    )}

                    {/* Delete confirmation */}
                    {deleteConfirm === item.id && (
                      <div className="border-t border-red-100 p-4 bg-red-50 flex items-center justify-between">
                        <p className="text-sm text-red-700 font-medium">Remove this item from your inventory?</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeleteConfirm(null)}
                            className="text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-white border border-gray-200 transition-colors">
                            Cancel
                          </button>
                          <button onClick={() => handleDelete(item.id)}
                            className="text-sm text-white bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Bookings Tab ── */}
        {activeTab === 'bookings' && (
          <div>
            {myRentals.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 border-dashed">
                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No booking requests yet</h3>
                <p className="text-gray-500 text-sm">Rental requests will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myRentals.map(rental => {
                  const item = myItems.find(i => i.id === rental.itemId);
                  if (!item) return null;
                  const days = Math.max(1, Math.ceil((new Date(rental.endDate) - new Date(rental.startDate)) / 86400000));
                  const total = item.pricePerDay * days;

                  return (
                    <div key={rental.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex gap-5">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=200&q=80'; }}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500 mt-0.5">Requested by <span className="font-medium">{rental.renterName}</span></p>
                              <p className="text-sm text-gray-500 mt-1">
                                {rental.startDate} → {rental.endDate} · {days} day{days > 1 ? 's' : ''}
                              </p>
                              <p className="text-sm font-bold text-gray-900 mt-1">Total: ₹{total.toLocaleString()}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                rental.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                rental.status === 'approved' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          {rental.status === 'pending' && (
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => handleRentalAction(rental.id, 'approved')}
                                className="flex items-center gap-1.5 text-sm text-white bg-green-500 px-4 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                onClick={() => handleRentalAction(rental.id, 'rejected')}
                                className="flex items-center gap-1.5 text-sm text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <XCircle size={14} /> Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveItem}
        />
      )}
      {editingItem && (
        <AddItemModal
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}
