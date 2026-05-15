// Simple Analytics Engine - Real-time venture analytics

export interface ViewEvent {
  id: string;
  ventureId: string;
  investorId: string;
  investorName: string;
  timestamp: string;
}

export interface SaveEvent {
  id: string;
  ventureId: string;
  investorId: string;
  investorName: string;
  timestamp: string;
}

export interface AnalyticsData {
  views: {
    today: number;
    thisWeek: number;
    total: number;
  };
  saves: number;
  recentActivity: (ViewEvent | SaveEvent)[];
}

// In-memory storage (replace with database in production)
const viewStore: ViewEvent[] = [];
const saveStore: SaveEvent[] = [];

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
    
    // Get recent activity (last 10 events)
    const recentActivity = [...ventureViews, ...ventureSaves]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    return {
      views: {
        today: viewsToday,
        thisWeek: viewsThisWeek,
        total: viewsTotal
      },
      saves: ventureSaves.length,
      recentActivity
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