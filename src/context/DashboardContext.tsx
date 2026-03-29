import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { Transaction, InventoryItem, dataEngine } from '../utils/dataEngine';
import { logActivity } from '../utils/activityLogger';

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
  updateStock: (productName: string, change: number, newAbsoluteValue?: number) => void;
  skipUpload: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [llmApiKey, setLlmApiKey] = useState((import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('shopgenie_apikey') || '');
  const [riskScore, setRiskScore] = useState(0);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [showDashboard, setShowDashboard] = useState(false);

  const getInventoryPath = () => `users/${user!.uid}/inventory`;

  // Hydrate from Firestore on login
  useEffect(() => {
    // Force the upload screen to show on every fresh login session
    console.log('🔄 ShopGenie Auth Change: Reseting Dashboard State');
    setShowDashboard(false);

    if (!user) {
      setInventory([]);
      setTransactions([]);
      setStockMap({});
      return;
    }
    const fetchFromFirestore = async () => {
      try {
        console.log('📥 ShopGenie: Fetching existing inventory from Firestore...');
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
          console.log(`✅ Loaded ${loadedInventory.length} items. Staying on Upload Screen until opted-in.`);
          setInventory(loadedInventory);
          setStockMap(newStockMap);
        }
      } catch (e) {
        console.warn('Firestore read failed:', e);
      }
    };
    fetchFromFirestore();
  }, [user]);

  /**
   * updateStock: pass change (delta) OR newAbsoluteValue if editing inline.
   * If newAbsoluteValue is defined, it overrides.
   */
  const updateStock = async (productName: string, change: number, newAbsoluteValue?: number) => {
    const oldVal = stockMap[productName] || 0;
    const newVal = newAbsoluteValue !== undefined
      ? Math.max(0, newAbsoluteValue)
      : Math.max(0, oldVal + change);

    setStockMap(prev => ({ ...prev, [productName]: newVal }));

    if (!user) return;
    try {
      await updateDoc(doc(db, getInventoryPath(), productName), { currentStock: newVal });
      // Log the stock change
      await logActivity(
        user.uid,
        user.email ?? '',
        'STOCK_UPDATE',
        `${productName}: ${oldVal} → ${newVal} units`
      );
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
          // Log upload
          await logActivity(
            user.uid,
            user.email ?? '',
            'CSV_UPLOADED',
            `Uploaded ${file.name} — ${data.length} transactions, ${inv.length} products`
          );
        } catch (firestoreError) {
          console.error('Firestore sync failed:', firestoreError);
        }
      }
      setStockMap(newStockMap);
      setShowDashboard(true);
    } catch (error) {
      console.error('Failed to load CSV', error);
      alert('Error validating CSV. Please ensure it has: Date, ProductName, Category, QuantitySold, SalePrice, UnitCost.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardContext.Provider value={{
      hasData: showDashboard,
      isLoading,
      transactions,
      inventory,
      llmApiKey,
      setLlmApiKey: handleSetApiKey,
      loadCsvData,
      riskScore,
      stockMap,
      updateStock,
      skipUpload: () => setShowDashboard(true),
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within a DashboardProvider');
  return context;
};
