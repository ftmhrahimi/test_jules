"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FileUp, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '../utils';

export default function Dashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const apiUrl = getApiUrl();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const token = localStorage.getItem('token');

    const apiUrl = getApiUrl();
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      try {
        await axios.post(`${apiUrl}/process-pdf`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
    setUploading(false);
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PM Reports Dashboard</h1>
            <p className="text-gray-500">Manage and generate preventive maintenance reports</p>
          </div>
          <label className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition">
            <FileUp size={20} />
            {uploading ? 'Processing...' : 'Upload PDFs'}
            <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-yellow-500" size={48} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-bottom border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Task ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Site ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Confirmation</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{report.task_id}</td>
                    <td className="px-6 py-4 text-gray-600">{report.site_id}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(report.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${report.overall_confirmation >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {report.overall_confirmation.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/reports/${report.id}`} className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center justify-end gap-1">
                        <FileText size={18} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reports.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                No reports found. Upload a PDF to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
