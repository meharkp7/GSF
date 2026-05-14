// Smart Contract-Based Milestone Funding System

export interface Milestone {
  id: string;
  ventureId: string;
  title: string;
  description: string;
  amount: number;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  verificationMethod: 'document' | 'investor' | 'admin';
  verificationCriteria: string;
  createdAt: string;
  completedAt?: string;
}

export interface Escrow {
  id: string;
  ventureId: string;
  investorId: string;
  totalDeposited: number;
  totalReleased: number;
  milestones: Milestone[];
  status: 'active' | 'completed' | 'disputed';
  createdAt: string;
}

export class MilestoneContract {
  private static escrows: Map<string, Escrow> = new Map();

  // Create new escrow
  static createEscrow(ventureId: string, investorId: string): Escrow {
    const escrow: Escrow = {
      id: `esc_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      ventureId,
      investorId,
      totalDeposited: 0,
      totalReleased: 0,
      milestones: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };
    this.escrows.set(escrow.id, escrow);
    return escrow;
  }

  // Add milestone
  static addMilestone(escrowId: string, data: Omit<Milestone, 'id' | 'status' | 'createdAt'>): Milestone | null {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) return null;

    const milestone: Milestone = {
      ...data,
      id: `ms_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    escrow.milestones.push(milestone);
    this.escrows.set(escrowId, escrow);
    return milestone;
  }

  // Deposit funds
  static deposit(escrowId: string, amount: number): Escrow | null {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) return null;
    
    escrow.totalDeposited += amount;
    this.escrows.set(escrowId, escrow);
    return escrow;
  }

  // Request milestone verification
  static requestVerification(milestoneId: string): { success: boolean; message: string } {
    for (const [escrowId, escrow] of this.escrows) {
      const milestone = escrow.milestones.find(m => m.id === milestoneId);
      if (milestone && milestone.status === 'pending') {
        milestone.status = 'in_progress';
        this.escrows.set(escrowId, escrow);
        return { success: true, message: 'Verification requested' };
      }
    }
    return { success: false, message: 'Milestone not found' };
  }

  // Approve/Reject milestone
  static approveMilestone(milestoneId: string, approved: boolean): { success: boolean; released?: number; message: string } {
    for (const [escrowId, escrow] of this.escrows) {
      const milestone = escrow.milestones.find(m => m.id === milestoneId);
      if (milestone && milestone.status === 'in_progress') {
        if (approved) {
          milestone.status = 'completed';
          milestone.completedAt = new Date().toISOString();
          escrow.totalReleased += milestone.amount;
          this.escrows.set(escrowId, escrow);
          return { success: true, released: milestone.amount, message: 'Milestone approved! Funds released.' };
        } else {
          milestone.status = 'rejected';
          this.escrows.set(escrowId, escrow);
          return { success: false, message: 'Milestone rejected. Funds remain in escrow.' };
        }
      }
    }
    return { success: false, message: 'Milestone not found' };
  }

  // Get escrow by venture ID
  static getEscrowByVenture(ventureId: string): Escrow | null {
    for (const escrow of this.escrows.values()) {
      if (escrow.ventureId === ventureId) {
        return escrow;
      }
    }
    return null;
  }

  // Get all milestones for a venture
  static getMilestones(ventureId: string): Milestone[] {
    const escrow = this.getEscrowByVenture(ventureId);
    return escrow ? escrow.milestones : [];
  }

  // Get progress percentage
  static getProgress(ventureId: string): number {
    const escrow = this.getEscrowByVenture(ventureId);
    if (!escrow || escrow.milestones.length === 0) return 0;
    
    const total = escrow.milestones.reduce((sum, m) => sum + m.amount, 0);
    const completed = escrow.milestones
      .filter(m => m.status === 'completed')
      .reduce((sum, m) => sum + m.amount, 0);
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}