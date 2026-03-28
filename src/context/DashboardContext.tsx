import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Transaction, InventoryItem, dataEngine } from '../utils/dataEngine';

interface DashboardContextType {
  hasData: boolean;
  isLoading: boolean;
  transactions: Transaction[];
  inventory: InventoryItem[];
  llmApiKey: string;
  setLlmApiKey: (key: string) => void;
  loadCsvData: (file: File) => Promise<void>;
  riskScore: number;
  stockMap: Record<string, number>;
  updateStock: (productName: string, change: number) => void;
  skipUpload: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [llmApiKey, setLlmApiKey] = useState(localStorage.getItem('shopgenie_apikey') || 'AIzaSyC0sS3KOm-cKlU9Y0IeJBvM23vcMe-iofE');
  const [riskScore, setRiskScore] = useState(0);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [hasSkipped, setHasSkipped] = useState(false);

  // Helper: get user-scoped collection path using email prefix
  const getUserKey = () => {
    const email = user!.email || user!.uid;
    return email.split('@')[0];
  };
  const getInventoryPath = () => `users/${getUserKey()}/inventory`;

  // On login: hydrate inventory from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchFromFirestore = async () => {
      try {
        const snapshot = await getDocs(collection(db, getInventoryPath()));
        const newStockMap: Record<string, number> = {};
        const loadedInventory: InventoryItem[] = [];

        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          newStockMap[docSnap.id] = data.currentStock ?? 100;
          loadedInventory.push({
            ProductName: data.ProductName,
            Category: data.Category || 'Uncategorized',
            TotalSold: data.TotalSold || 0,
            Revenue: data.Revenue || 0,
            TotalCost: data.TotalCost || 0,
            Profit: (data.Revenue || 0) - (data.TotalCost || 0),
            Margin: data.Margin || 0,
            Status: data.Status || 'Normal',
            CurrentPrice: data.CurrentPrice || 0,
            Cost: data.Cost || 0,
          });
        });

        if (loadedInventory.length > 0) {
          setInventory(loadedInventory);
          setStockMap(newStockMap);
        }
      } catch (e) {
        console.warn('Firestore read failed:', e);
      }
    };
    fetchFromFirestore();
  }, [user]);

  const updateStock = async (productName: string, change: number) => {
    const newVal = Math.max(0, (stockMap[productName] || 0) + change);
    setStockMap(prev => ({ ...prev, [productName]: newVal }));
    if (!user) return;
    try {
      await updateDoc(doc(db, getInventoryPath(), productName), { currentStock: newVal });
    } catch (e) {
      console.error('Firestore stock update failed:', e);
    }
  };

  const handleSetApiKey = (key: string) => {
    setLlmApiKey(key);
    localStorage.setItem('shopgenie_apikey', key);
  };

  const loadCsvData = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await dataEngine.parseCSV(file);
      setTransactions(data);
      const inv = dataEngine.categorizeInventory(data);
      setInventory(inv);
      setRiskScore(dataEngine.calculateRiskScore(data));

      // Sync to Firestore under user's account
      const newStockMap: Record<string, number> = { ...stockMap };
      if (user) {
        try {
          for (const item of inv) {
            const docRef = doc(db, getInventoryPath(), item.ProductName);
            const existing = await getDoc(docRef);
            const currentStock = existing.exists() ? existing.data().currentStock : 100;
            newStockMap[item.ProductName] = currentStock;
            await setDoc(docRef, {
              ProductName: item.ProductName,
              Category: item.Category,
              TotalSold: item.TotalSold,
              Revenue: item.Revenue,
              TotalCost: item.TotalCost,
              Status: item.Status,
              Margin: item.Margin,
              CurrentPrice: item.CurrentPrice,
              Cost: item.Cost,
              currentStock,
            }, { merge: true });
          }
        } catch (firestoreError) {
          console.error('Firestore sync failed:', firestoreError);
        }
      }
      setStockMap(newStockMap);
    } catch (error) {
      console.error('Failed to load CSV', error);
      alert('Error validating CSV formatting. Please ensure it has Date, ProductName, Category, QuantitySold, SalePrice, UnitCost.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContext.Provider value={{
      hasData: inventory.length > 0 || hasSkipped,
      isLoading,
      transactions,
      inventory,
      llmApiKey,
      setLlmApiKey: handleSetApiKey,
      loadCsvData,
      riskScore,
      stockMap,
      updateStock,
      skipUpload: () => setHasSkipped(true)
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
