"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Plus, DollarSign, TrendingUp, CheckCircle, Shield, FileText, UserCheck, Calendar, Lock, Unlock } from "lucide-react";

interface Milestone {
  id: string;
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

interface Escrow {
  id: string;
  ventureId: string;
  investorId: string;
  totalDeposited: number;
  totalReleased: number;
  milestones: Milestone[];
  status: string;
  createdAt: string;
}

export default function MilestonesPage() {
  const params = useParams();
  const ventureId = params.id as string;
  
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progress, setProgress] = useState(0);
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    deadline: '',
    verificationMethod: 'investor',
    verificationCriteria: ''
  });

  useEffect(() => {
    fetchData();
  }, [ventureId]);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch(`/api/milestones?ventureId=${ventureId}`);
      const data = await res.json();
      setMilestones(data.milestones || []);
      setProgress(data.progress || 0);
      if (data.escrow) {
        setEscrow(data.escrow);
      } else {
        await createEscrow();
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createEscrow() {
    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_escrow',
          ventureId,
          investorId: 'investor_1'
        })
      });
      const data = await res.json();
      if (data.success) {
        setEscrow(data.escrow);
      }
    } catch (error) {
      console.error('Failed to create escrow:', error);
    }
  }

  async function addMilestone(e: React.FormEvent) {
    e.preventDefault();
    if (!escrow?.id) return;
    
    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_milestone',
          escrowId: escrow.id,
          ventureId,
          title: formData.title,
          description: formData.description,
          amount: parseInt(formData.amount),
          deadline: formData.deadline,
          verificationMethod: formData.verificationMethod,
          verificationCriteria: formData.verificationCriteria
        })
      });
      
      if (res.ok) {
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          amount: '',
          deadline: '',
          verificationMethod: 'investor',
          verificationCriteria: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add milestone:', error);
    }
  }

  async function depositFunds() {
    if (!escrow?.id) return;
    
    const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
    if (totalAmount === 0) {
      alert('Please add milestones first');
      return;
    }
    
    setDepositing(true);
    try {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deposit',
          escrowId: escrow.id,
          amount: totalAmount
        })
      });
      
      if (res.ok) {
        fetchData();
        alert(`✅ Successfully deposited $${totalAmount.toLocaleString()} into escrow!`);
      }
    } catch (error) {
      console.error('Failed to deposit:', error);
      alert('Failed to deposit funds. Please try again.');
    } finally {
      setDepositing(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200">COMPLETED</span>;
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200">IN PROGRESS</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200">REJECTED</span>;
      default:
        return <span className="px-2 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100">PENDING</span>;
    }
  };

  const totalFunding = milestones.reduce((sum, m) => sum + m.amount, 0);
  const totalDeposited = escrow?.totalDeposited || 0;
  const totalReleased = escrow?.totalReleased || 0;
  const remainingInEscrow = totalDeposited - totalReleased;
  const needsDeposit = totalFunding > 0 && totalDeposited === 0;

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#FDFAF7] dark:bg-slate-950">
        <div className="section-container py-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0F1825] dark:text-white mb-2">
                Milestone Funding
              </h1>
              {/* CHANGED: from text-[#4A5668] → text-[#2C3A4D] (light) and dark:text-slate-200 */}
              <p className="text-[#2C3A4D] dark:text-slate-200">
                Smart contract-based escrow system — funds released only when milestones are verified
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#81A6C6] hover:bg-[#6B8DB0] text-white font-semibold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <Plus className="size-4" /> 
              <span>Add Milestone</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Card 1 - Total Funding */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-[#D2C4B4] dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                {/* CHANGED: label text darker */}
                <span className="text-sm font-bold text-[#0F1825] dark:text-white">Total Funding</span>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                  <DollarSign className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0F1825] dark:text-white">
                ${totalFunding.toLocaleString()}
              </div>
              {/* CHANGED: subtext from text-[#4A5668] → text-[#374151] (light) and dark:text-slate-200 */}
              <p className="text-xs text-[#374151] dark:text-slate-200 mt-1 font-semibold">across all milestones</p>
            </div>

            {/* Card 2 - In Escrow */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-[#D2C4B4] dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#0F1825] dark:text-white">In Escrow</span>
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                  <Lock className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0F1825] dark:text-white">
                ${remainingInEscrow.toLocaleString()}
              </div>
              <p className="text-xs text-[#374151] dark:text-slate-200 mt-1 font-semibold">locked in smart contract</p>
            </div>

            {/* Card 3 - Released */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-[#D2C4B4] dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#0F1825] dark:text-white">Released</span>
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                  <Unlock className="size-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0F1825] dark:text-white">
                ${totalReleased.toLocaleString()}
              </div>
              <p className="text-xs text-[#374151] dark:text-slate-200 mt-1 font-semibold">to venture</p>
            </div>

            {/* Card 4 - Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-[#D2C4B4] dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#0F1825] dark:text-white">Progress</span>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                  <CheckCircle className="size-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0F1825] dark:text-white">{progress}%</div>
              <div className="w-full bg-[#D1CBC4] dark:bg-slate-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Deposit CTA */}
          {needsDeposit && (
            <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[#0F1825] dark:text-white mb-1 text-lg">
                    Ready to fund these milestones?
                  </h3>
                  {/* CHANGED: dark:text-slate-300 → dark:text-slate-200 */}
                  <p className="text-sm text-[#1A2332] dark:text-slate-200 font-medium">
                    Deposit ${totalFunding.toLocaleString()} into the escrow smart contract to begin
                  </p>
                </div>
                <button
                  onClick={depositFunds}
                  disabled={depositing}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 shadow-md"
                >
                  {depositing ? 'Processing...' : `Deposit $${totalFunding.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

          {/* Milestones Section */}
          <h2 className="text-xl font-bold text-[#0F1825] dark:text-white mb-4">
            Funding Milestones
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#81A6C6]"></div>
              {/* CHANGED: text-[#4A5668] → text-[#2C3A4D] and dark:text-slate-200 */}
              <p className="text-[#2C3A4D] dark:text-slate-200 mt-3">Loading milestones...</p>
            </div>
          ) : milestones.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-[#D2C4B4] dark:border-slate-700">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-[#0F1825] dark:text-white mb-2">
                No Milestones Yet
              </h3>
              <p className="text-[#2C3A4D] dark:text-slate-200 mb-4">
                Create your first milestone to start receiving funds
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-[#81A6C6] hover:bg-[#6B8DB0] text-white font-semibold px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
              >
                <Plus className="size-4" /> Create Milestone
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-[#D2C4B4] dark:border-slate-700 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E8D5BE] dark:bg-slate-700 text-[#0F1825] dark:text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0F1825] dark:text-white text-lg">
                          {milestone.title}
                        </h3>
                        {/* CHANGED: text-[#4A5668] → text-[#2C3A4D] and dark:text-slate-200 */}
                        <p className="text-sm text-[#2C3A4D] dark:text-slate-200 mt-0.5">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(milestone.status)}
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 pt-3 border-t border-[#D2C4B4] dark:border-slate-700">
                    <div>
                      {/* CHANGED: label uppercase text from text-[#4A5668] → text-[#374151] and dark:text-slate-300 → dark:text-slate-200 */}
                      <p className="text-xs text-[#374151] dark:text-slate-200 uppercase tracking-wide font-bold">
                        Amount
                      </p>
                      <p className="text-base font-bold text-[#0F1825] dark:text-white mt-1">
                        ${milestone.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#374151] dark:text-slate-200 uppercase tracking-wide font-bold">
                        Deadline
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {/* CHANGED: icon color from text-[#4A5668] → text-[#374151] */}
                        <Calendar className="size-3.5 text-[#374151] dark:text-slate-300" />
                        <p className="text-sm font-semibold text-[#0F1825] dark:text-white">
                          {new Date(milestone.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#374151] dark:text-slate-200 uppercase tracking-wide font-bold">
                        Verification
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {milestone.verificationMethod === 'document' && <FileText className="size-3.5 text-[#374151] dark:text-slate-300" />}
                        {milestone.verificationMethod === 'investor' && <UserCheck className="size-3.5 text-[#374151] dark:text-slate-300" />}
                        {milestone.verificationMethod === 'admin' && <Shield className="size-3.5 text-[#374151] dark:text-slate-300" />}
                        <p className="text-sm font-semibold text-[#0F1825] dark:text-white capitalize">
                          {milestone.verificationMethod}
                        </p>
                      </div>
                    </div>
                    {milestone.completedAt && (
                      <div>
                        <p className="text-xs text-[#374151] dark:text-slate-200 uppercase tracking-wide font-bold">
                          Completed
                        </p>
                        <p className="text-sm font-semibold text-[#0F1825] dark:text-white mt-1">
                          {new Date(milestone.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Verification Criteria */}
                  {milestone.verificationCriteria && milestone.status !== 'completed' && (
                    <div className="mt-2 p-3 bg-[#EDE8E2] dark:bg-slate-700/70 rounded-lg">
                      {/* CHANGED: label from text-[#4A5668] → text-[#374151] and dark:text-slate-400 → dark:text-slate-200 */}
                      <p className="text-xs text-[#374151] dark:text-slate-200 mb-1 flex items-center gap-1 font-bold">
                        <FileText className="size-3" /> Verification Criteria:
                      </p>
                      {/* CHANGED: body text from dark:text-slate-200 → dark:text-white */}
                      <p className="text-sm font-semibold text-[#0F1825] dark:text-white">
                        {milestone.verificationCriteria}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* How It Works */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-bold text-[#0F1825] dark:text-white mb-4 flex items-center gap-2 text-lg">
              <Shield className="size-5 text-[#81A6C6]" />
              How Smart Contract Funding Works
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">1</span>
                {/* CHANGED: text-[#1A2332] → text-[#0F1825] and dark:text-slate-300 → dark:text-slate-200 */}
                <span className="text-[#0F1825] dark:text-slate-200 font-semibold">Create milestones with funding amounts</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">2</span>
                <span className="text-[#0F1825] dark:text-slate-200 font-semibold">Investor deposits funds into escrow</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">3</span>
                <span className="text-[#0F1825] dark:text-slate-200 font-semibold">Complete milestones & submit verification</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">4</span>
                <span className="text-[#0F1825] dark:text-slate-200 font-semibold">Funds released automatically upon approval</span>
              </div>
            </div>
          </div>

          {/* Add Milestone Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl">
                <h2 className="text-xl font-bold text-[#0F1825] dark:text-white mb-4">Create Milestone</h2>
                <form onSubmit={addMilestone} className="space-y-4">
                  <div>
                    {/* CHANGED: all form labels from dark:text-slate-300 → dark:text-slate-200 */}
                    <label className="block text-sm font-semibold text-[#0F1825] dark:text-slate-200 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-[#D2C4B4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0F1825] dark:text-white placeholder:text-[#6B7A8D] dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#81A6C6] outline-none"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., MVP Development"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F1825] dark:text-slate-200 mb-1">Description</label>
                    <textarea
                      required
                      className="w-full px-4 py-2 rounded-lg border border-[#D2C4B4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0F1825] dark:text-white placeholder:text-[#6B7A8D] dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#81A6C6] outline-none"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what needs to be achieved..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F1825] dark:text-slate-200 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-[#D2C4B4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0F1825] dark:text-white placeholder:text-[#6B7A8D] dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#81A6C6] outline-none"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F1825] dark:text-slate-200 mb-1">Deadline</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2 rounded-lg border border-[#D2C4B4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0F1825] dark:text-white focus:ring-2 focus:ring-[#81A6C6] outline-none"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F1825] dark:text-slate-200 mb-1">Verification Method</label>
                    <select
                      className="w-full px-4 py-2 rounded-lg border border-[#D2C4B4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0F1825] dark:text-white focus:ring-2 focus:ring-[#81A6C6] outline-none"
                      value={formData.verificationMethod}
                      onChange={(e) => setFormData({ ...formData, verificationMethod: e.target.value })}
                    >
                      <option value="investor">Investor Approval</option>
                      <option value="document">Document Upload</option>
                      <option value="admin">Admin Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0F1825] dark:text-slate-200 mb-1">Verification Criteria</label>
                    <textarea
                      required
                      className="w-full px-4 py-2 rounded-lg border border-[#D2C4B4] dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0F1825] dark:text-white placeholder:text-[#6B7A8D] dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#81A6C6] outline-none"
                      rows={2}
                      value={formData.verificationCriteria}
                      onChange={(e) => setFormData({ ...formData, verificationCriteria: e.target.value })}
                      placeholder="What evidence is required?"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 rounded-lg border border-[#D2C4B4] dark:border-slate-600 text-[#0F1825] dark:text-slate-200 font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-all">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-[#81A6C6] hover:bg-[#6B8DB0] text-white font-semibold transition-all">
                      Create Milestone
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}