// Simple Analytics Engine - Real-time venture analytics

export interface ViewEvent {
  id: string;
  ventureId: string;
  investorId: string;
  investorName: string;
  timestamp: string;
  type?: 'view';
}

export interface SaveEvent {
  id: string;
  ventureId: string;
  investorId: string;
  investorName: string;
  timestamp: string;
  type?: 'save';
}

export interface AnalyticsData {
  views: {
    today: number;
    thisWeek: number;
    total: number;
  };
  saves: number;
  recentActivity: (ViewEvent | SaveEvent)[];
  dailyStats: {
    date: string;
    views: number;
    saves: number;
  }[];
}

// In-memory storage (replace with database in production)
const viewStore: ViewEvent[] = [];
const saveStore: SaveEvent[] = [];

// Helper to seed historical data
function seedHistoricalData() {
  const ventures = ["1", "2", "3"];
  const investorNames = [
    "Peak XV Partners", "Sequoia Capital", "Accel India", "Elevation Capital",
    "Matrix Partners", "Nexus Venture Partners", "Blume Ventures", "Kalaari Capital",
    "Y Combinator", "Antler India", "Tiger Global", "SoftBank Vision Fund",
    "Anicut Capital", "Titan Capital", "Inflection Point Ventures", "WaterBridge Ventures"
  ];
  
  const now = new Date();
  
  // Seed last 30 days of data to make trend charts beautiful
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    ventures.forEach(ventureId => {
      // Views per day: randomized between 8 and 35
      const numViews = Math.floor(Math.random() * 28) + 8;
      for (let j = 0; j < numViews; j++) {
        const timestamp = new Date(date);
        timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        
        viewStore.push({
          id: `seed_v_${ventureId}_${i}_${j}`,
          ventureId,
          investorId: `inv_${Math.floor(Math.random() * 1000)}`,
          investorName: investorNames[Math.floor(Math.random() * investorNames.length)],
          timestamp: timestamp.toISOString()
        });
      }
      
      // Saves per day: randomized based on views (approx 10-25% conversion rate)
      const maxPossibleSaves = Math.max(1, Math.floor(numViews * 0.25));
      const numSaves = Math.floor(Math.random() * maxPossibleSaves) + 1;
      for (let j = 0; j < numSaves; j++) {
        const timestamp = new Date(date);
        timestamp.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        
        saveStore.push({
          id: `seed_s_${ventureId}_${i}_${j}`,
          ventureId,
          investorId: `inv_${Math.floor(Math.random() * 1000)}`,
          investorName: investorNames[Math.floor(Math.random() * investorNames.length)],
          timestamp: timestamp.toISOString()
        });
      }
    });
  }
}

// Perform initial seed of in-memory store
seedHistoricalData();

export class Analytics {
  
  // Track a profile view
  static trackView(ventureId: string, investorId: string, investorName: string): ViewEvent {
    const event: ViewEvent = {
      id: Date.now().toString(),
      ventureId,
      investorId,
      investorName,
      timestamp: new Date().toISOString()
    };
    viewStore.push(event);
    return event;
  }

  // Track a save
  static trackSave(ventureId: string, investorId: string, investorName: string): SaveEvent {
    const event: SaveEvent = {
      id: Date.now().toString(),
      ventureId,
      investorId,
      investorName,
      timestamp: new Date().toISOString()
    };
    saveStore.push(event);
    return event;
  }

  // Get analytics for a venture
  static getAnalytics(ventureId: string): AnalyticsData {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const ventureViews = viewStore.filter(v => v.ventureId === ventureId);
    const ventureSaves = saveStore.filter(s => s.ventureId === ventureId);
    
    const viewsToday = ventureViews.filter(v => new Date(v.timestamp) >= today).length;
    const viewsThisWeek = ventureViews.filter(v => new Date(v.timestamp) >= thisWeek).length;
    const viewsTotal = ventureViews.length;
    
    // Generate daily stats for the last 14 days
    const dailyStats = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);
      
      const dateLabel = `${months[d.getMonth()]} ${d.getDate()}`;
      
      const dayViews = ventureViews.filter(v => {
        const ts = new Date(v.timestamp);
        return ts >= startOfDay && ts <= endOfDay;
      }).length;
      
      const daySaves = ventureSaves.filter(s => {
        const ts = new Date(s.timestamp);
        return ts >= startOfDay && ts <= endOfDay;
      }).length;
      
      dailyStats.push({
        date: dateLabel,
        views: dayViews,
        saves: daySaves
      });
    }
    
    // Get recent activity (last 10 events) with explicit 'type' injection
    const recentViewsWithTypes = ventureViews.map(v => ({ ...v, type: 'view' as const }));
    const recentSavesWithTypes = ventureSaves.map(s => ({ ...s, type: 'save' as const }));
    
    const recentActivity = [...recentViewsWithTypes, ...recentSavesWithTypes]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    return {
      views: {
        today: viewsToday,
        thisWeek: viewsThisWeek,
        total: viewsTotal
      },
      saves: ventureSaves.length,
      recentActivity,
      dailyStats
    };
  }
  
  // Get all ventures stats (for debugging)
  static getAllStats() {
    return {
      totalViews: viewStore.length,
      totalSaves: saveStore.length,
      viewsByVenture: viewStore.reduce((acc, v) => {
        acc[v.ventureId] = (acc[v.ventureId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}