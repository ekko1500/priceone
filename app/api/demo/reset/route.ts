import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { AuditLog } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId, role } = body;

    // Reset demo records cleanly
    dbStore.resetDemoData();

    // Log the reset
    const nowISO = new Date().toISOString();
    const auditLog: AuditLog = {
      id: `audit-reset-${Date.now()}`,
      actorId: userId || 'judge_demo_user',
      actorName: 'Demo / Judge Operator',
      actorRole: (role as any) || 'admin',
      action: 'DEMO_DATA_RESET',
      targetType: 'DATABASE',
      targetId: 'demo_partition',
      details: {
        message: 'All demo records restored to pristine initial competition scenario',
      },
      timestamp: nowISO,
      isDemo: true,
    };
    dbStore.addAuditLog(auditLog);

    return NextResponse.json({
      success: true,
      message: 'Demo dataset successfully restored to original benchmark state',
    });
  } catch (error: any) {
    console.error('API demo reset error:', error);
    return NextResponse.json({ error: error.message || 'Failed to reset demo data' }, { status: 500 });
  }
}