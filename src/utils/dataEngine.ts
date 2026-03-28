import Papa from 'papaparse';

export interface Transaction {
  Date: string;
  ProductName: string;
  Category: string;
  QuantitySold: number;
  SalePrice: number;
  UnitCost: number;
}

export interface InventoryItem {
  ProductName: string;
  Category: string;
  TotalSold: number;
  Revenue: number;
  TotalCost: number;
  Profit: number;
  Margin: number;
  Status: 'Fast Moving' | 'Dead Weight' | 'Normal';
  CurrentPrice: number;
  Cost: number;
}

export const dataEngine = {
  parseCSV: (file: File): Promise<Transaction[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          // Validate and clean data
          const data = results.data as any[];
          const cleaned = data.filter(row => row.Date && row.ProductName).map(row => ({
            Date: String(row.Date),
            ProductName: String(row.ProductName),
            Category: String(row.Category || 'Uncategorized'),
            QuantitySold: Number(row.QuantitySold || 0),
            SalePrice: Number(row.SalePrice || 0),
            UnitCost: Number(row.UnitCost || 0),
          }));
          resolve(cleaned);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  },

  categorizeInventory: (data: Transaction[]): InventoryItem[] => {
    // Group by product
    const productMap = new Map<string, InventoryItem>();
    
    data.forEach(t => {
      if (!productMap.has(t.ProductName)) {
        productMap.set(t.ProductName, {
          ProductName: t.ProductName,
          Category: t.Category,
          TotalSold: 0,
          Revenue: 0,
          TotalCost: 0,
          Profit: 0,
          Margin: 0,
          Status: 'Normal',
          CurrentPrice: t.SalePrice,
          Cost: t.UnitCost,
        });
      }
      
      const item = productMap.get(t.ProductName)!;
      item.TotalSold += t.QuantitySold;
      item.Revenue += (t.QuantitySold * t.SalePrice);
      item.TotalCost += (t.QuantitySold * t.UnitCost);
      // Update with latest prices
      item.CurrentPrice = t.SalePrice;
      item.Cost = t.UnitCost;
    });

    const items = Array.from(productMap.values());
    
    // Calculate global stats to find thresholds
    const totalSoldArray = items.map(i => i.TotalSold).sort((a,b) => a-b);
    if (totalSoldArray.length === 0) return items;
    
    // Bottom 25% is Dead Weight, Top 25% is Fast Moving
    const p25Index = Math.floor(totalSoldArray.length * 0.25);
    const p75Index = Math.floor(totalSoldArray.length * 0.75);
    
    const deadWeightThreshold = totalSoldArray[p25Index];
    const fastMovingThreshold = totalSoldArray[p75Index];

    return items.map(item => {
      item.Profit = item.Revenue - item.TotalCost;
      item.Margin = item.Revenue > 0 ? (item.Profit / item.Revenue) * 100 : 0;
      
      if (item.TotalSold <= deadWeightThreshold) {
        item.Status = 'Dead Weight';
      } else if (item.TotalSold >= fastMovingThreshold) {
        item.Status = 'Fast Moving';
      }
      
      return item;
    });
  },

  calculateDailyRevenue: (data: Transaction[]) => {
    const daily = new Map<string, number>();
    data.forEach(t => {
      const existing = daily.get(t.Date) || 0;
      daily.set(t.Date, existing + (t.SalePrice * t.QuantitySold));
    });
    
    // Sort by date assuming date string is sortable (YYYY-MM-DD)
    return Array.from(daily.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  calculateMovingAverage: (dailyData: {date: string, revenue: number}[], windowSize: number = 7) => {
    return dailyData.map((day, index, arr) => {
      const start = Math.max(0, index - windowSize + 1);
      const window = arr.slice(start, index + 1);
      const sum = window.reduce((acc, curr) => acc + curr.revenue, 0);
      return {
        ...day,
        movingAverage: sum / window.length
      };
    });
  },
  
  calculateRiskScore: (data: Transaction[]) => {
    // A deterministic risk score based on margin and dead weight ratio.
    const inventory = dataEngine.categorizeInventory(data);
    const totalItems = inventory.length;
    if (totalItems === 0) return 0;

    const deadWeightItems = inventory.filter(i => i.Status === 'Dead Weight').length;
    const deadWeightRatio = deadWeightItems / totalItems;
    
    const totalRevenue = inventory.reduce((acc, i) => acc + i.Revenue, 0);
    const totalCost = inventory.reduce((acc, i) => acc + i.TotalCost, 0);
    const globalMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) : 0;

    // High risk if global margin is < 10% and dead weight > 30%
    // Score out of 100.
    // Base risk from dead weight: up to 50 points
    const dwRisk = Math.min(50, deadWeightRatio * 100);
    
    // Risk from margin: up to 50 points (if margin < 0.2)
    const marginRisk = Math.max(0, 50 - (globalMargin * 250)); // 20% margin = 0 risk, 0% margin = 50 risk.

    return Math.min(100, Math.round(dwRisk + marginRisk));
  }
};
