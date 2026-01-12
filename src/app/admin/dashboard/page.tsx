"use client";

import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout requiredRole="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
        <p className="text-gray-500">Ringkasan data sistem parkir</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium">Total Petugas</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium">
            Total Pendapatan
          </h3>
          <p className="text-3xl font-bold text-primary mt-2">Rp 2.5jt</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-sm font-medium">
            Kendaraan Parkir
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">45</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
