'use client';
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { AuditLog } from '@/lib/types';

interface AdminViewProps {
  auditLogs: AuditLog[];
}

export const AdminView: React.FC<AdminViewProps> = ({ auditLogs }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">PricePulse Myanmar Oversight & Auditing</h2>
          <p className="text-xs text-slate-500 mt-1">
            Immutable audit trail of price publications, orders, stock receipts, and demo administration.
          </p>
        </div>
        <span className="text-xs bg-purple-100 text-purple-800 font-bold px-3 py-1.5 rounded-lg border border-purple-200 flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-600" />
          <span>Authorized Admin Session</span>
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">System Audit Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="p-2.5">Time</th>
                <th className="p-2.5">Actor</th>
                <th className="p-2.5">Role</th>
                <th className="p-2.5">Action</th>
                <th className="p-2.5">Target</th>
                <th className="p-2.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="p-2.5 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-2.5 font-bold text-slate-900">{log.actorName}</td>
                  <td className="p-2.5 text-slate-500">{log.actorRole}</td>
                  <td className="p-2.5 font-bold text-purple-700">{log.action}</td>
                  <td className="p-2.5 text-slate-600">{log.targetType}</td>
                  <td className="p-2.5 text-slate-500 max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};