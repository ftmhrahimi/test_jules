"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { ChevronLeft, Download, MapPin, Calendar, CheckCircle2, XCircle, Info, Maximize2, Globe } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl, getMinioUrl } from '../../utils';

export default function ReportDetail() {
  const params = useParams();
  const id = params?.id;
  const [report, setReport] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    if (id) fetchReport();
  }, [id]);

  const fetchReport = async () => {
    const apiUrl = getApiUrl();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLanguage = () => {
    setDir(dir === 'ltr' ? 'rtl' : 'ltr');
  };

  const handleDownload = async () => {
     const apiUrl = getApiUrl();
     try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${apiUrl}/reports/${id}/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PM_Report_${report.task_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  if (!report) return <div className="p-8">Loading...</div>;

  return (
    <div className={`min-h-screen bg-gray-50 pb-12 font-sans transition-all duration-300`} dir={dir}>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            <ChevronLeft size={20} className={dir === 'rtl' ? 'rotate-180' : ''} />
            {dir === 'ltr' ? 'Back to Dashboard' : 'بازگشت به داشبورد'}
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900">{report.task_id}</h1>
            <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-gray-100 transition flex items-center gap-1 text-sm font-bold text-gray-600">
               <Globe size={20} /> {dir === 'ltr' ? 'FA' : 'EN'}
            </button>
            <button onClick={handleDownload} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition text-sm">
              <Download size={18} /> {dir === 'ltr' ? 'Export PDF' : 'خروجی PDF'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
                {label: dir === 'ltr' ? 'Confirmation' : 'تاییدیه', value: `${report.overall_confirmation.toFixed(0)}%`, color: 'text-yellow-600'},
                {label: dir === 'ltr' ? 'Site ID' : 'شناسه سایت', value: report.site_id, color: 'text-gray-900'},
                {label: dir === 'ltr' ? 'Category' : 'دسته بندی', value: report.category, color: 'text-gray-900'},
                {label: dir === 'ltr' ? 'Items' : 'موارد', value: report.items.length, color: 'text-gray-900'}
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
            ))}
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Info size={24} className="text-yellow-500" /> {dir === 'ltr' ? 'Executive Summary' : 'خلاصه مدیریتی'}
            </h2>
            <p className="text-gray-700 leading-relaxed italic">{report.summary || "Summary not generated."}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase w-16 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>#</th>
                        <th className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{dir === 'ltr' ? 'Item Description' : 'شرح مورد'}</th>
                        <th className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase w-48 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{dir === 'ltr' ? 'Evidence' : 'مستندات'}</th>
                        <th className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase w-32 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{dir === 'ltr' ? 'Status' : 'وضعیت'}</th>
                        <th className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{dir === 'ltr' ? 'AI Verdict' : 'رای هوش مصنوعی'}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {report.items.map((item: any) => (
                        <tr key={item.id} className="align-top">
                            <td className={`px-6 py-4 text-gray-400 font-medium ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{item.item_num}</td>
                            <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <p className="text-sm text-gray-900 leading-relaxed font-medium mb-1" dir="rtl">{item.description}</p>
                                {item.causes && item.causes.length > 0 && (
                                    <div className={`flex flex-wrap gap-1 ${dir === 'rtl' ? 'justify-end' : 'justify-start'}`}>
                                        {item.causes.map((c: string) => (
                                            <span key={c} className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 font-bold uppercase">{c}</span>
                                        ))}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="grid grid-cols-2 gap-2">
                                    {item.photos.map((photo: any) => (
                                        <div key={photo.name} className="relative group cursor-pointer" onClick={() => setSelectedPhoto(photo.url)}>
                                            <img src={`${getMinioUrl()}/${photo.url}`} className="w-full h-16 object-cover rounded-lg border border-gray-100" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                                                <Maximize2 className="text-white" size={16} />
                                            </div>
                                        </div>
                                    ))}
                                    {item.photos.length === 0 && <span className="text-gray-400 text-xs italic">No photos</span>}
                                </div>
                            </td>
                            <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <span className={`flex items-center gap-1 text-sm font-bold ${item.reported_result === 'OK' ? 'text-green-600' : 'text-red-600'} ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                    {item.reported_result === 'OK' ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
                                    {item.reported_result}
                                </span>
                            </td>
                            <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                                    item.ai_verdict === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                    item.ai_verdict === 'DISPUTED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {item.ai_verdict}
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">{item.ai_explanation}</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
              <img src={`${getMinioUrl()}/${selectedPhoto}`} className="max-w-full max-h-full rounded-lg shadow-2xl" />
              <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">✕</button>
          </div>
      )}
    </div>
  );
}
