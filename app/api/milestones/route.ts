import { NextRequest, NextResponse } from "next/server";
import { MilestoneContract } from "@/lib/milestoneContract";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ventureId = searchParams.get("ventureId");
  
  if (!ventureId) {
    return NextResponse.json({ error: "ventureId required" }, { status: 400 });
  }
  
  const milestones = MilestoneContract.getMilestones(ventureId);
  const progress = MilestoneContract.getProgress(ventureId);
  const escrow = MilestoneContract.getEscrowByVenture(ventureId);
  
  return NextResponse.json({ milestones, progress, escrow });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...data } = body;
  
  switch (action) {
    case 'create_escrow':
      const escrow = MilestoneContract.createEscrow(data.ventureId, data.investorId);
      return NextResponse.json({ success: true, escrow });
      
    case 'add_milestone':
      const milestone = MilestoneContract.addMilestone(data.escrowId, {
        ventureId: data.ventureId,
        title: data.title,
        description: data.description,
        amount: data.amount,
        deadline: data.deadline,
        verificationMethod: data.verificationMethod,
        verificationCriteria: data.verificationCriteria
      });
      if (!milestone) {
        return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, milestone });
      
    case 'deposit':
      const updatedEscrow = MilestoneContract.deposit(data.escrowId, data.amount);
      if (!updatedEscrow) {
        return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, escrow: updatedEscrow });
      
    case 'request_verification':
      const result = MilestoneContract.requestVerification(data.milestoneId);
      return NextResponse.json(result);
      
    case 'approve_milestone':
      const approval = MilestoneContract.approveMilestone(data.milestoneId, data.approved);
      return NextResponse.json(approval);
      
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}