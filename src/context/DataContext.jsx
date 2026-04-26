import { createContext, useContext, useState, useCallback } from 'react';
import { getItems, saveItems, getRentals, saveRentals } from '../utils/storage';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [items, setItemsState] = useState(getItems());
  const [rentals, setRentalsState] = useState(getRentals());

  const refreshItems = useCallback(() => {
    setItemsState(getItems());
  }, []);

  const addItem = (item) => {
    const newItem = { ...item, id: `item-${Date.now()}`, rating: 0, reviews: 0 };
    const updated = [...getItems(), newItem];
    saveItems(updated);
    setItemsState(updated);
    return newItem;
  };

  const updateItem = (id, changes) => {
    const current = getItems();
    const updated = current.map(i => i.id === id ? { ...i, ...changes } : i);
    saveItems(updated);
    setItemsState(updated);
  };

  const deleteItem = (id) => {
    const current = getItems();
    const updated = current.filter(i => i.id !== id);
    saveItems(updated);
    setItemsState(updated);
  };

  const updateAvailability = (itemId, dates) => {
    updateItem(itemId, { availability: dates });
  };

  const requestRental = (itemId, renterId, renterName, startDate, endDate) => {
    const rental = {
      id: `rental-${Date.now()}`,
      itemId,
      renterId,
      renterName,
      startDate,
      endDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const current = getRentals();
    const updated = [...current, rental];
    saveRentals(updated);
    setRentalsState(updated);
    return rental;
  };

  const updateRentalStatus = (rentalId, status) => {
    const current = getRentals();
    const updated = current.map(r => r.id === rentalId ? { ...r, status } : r);
    saveRentals(updated);
    setRentalsState(updated);
  };

  return (
    <DataContext.Provider value={{
      items, rentals,
      addItem, updateItem, deleteItem,
      updateAvailability, requestRental, updateRentalStatus,
      refreshItems,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
