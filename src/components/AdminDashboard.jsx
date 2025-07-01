import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import logo from './InTress-KPPN-Liwa.png';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import GaugeChart from 'react-gauge-chart';

export default function AdminDashboard({ user }) {
  const [violations, setViolations] = useState([]);
  const [form, setForm] = useState({ name: '', type: '', date: '' });
  const [filter, setFilter] = useState('today');
  const navigate = useNavigate();

  const [names, setNames] = useState([]);
  const [newName, setNewName] = useState('');
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    loadViolations();
    loadNames();
  }, []);

  const loadViolations = async () => {
    const snapshot = await getDocs(collection(db, 'violations'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setViolations(data);
  };

  const loadNames = async () => {
    const snapshot = await getDocs(collection(db, 'names'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNames(data);
  };

  const handleAddName = async () => {
    if (!newName.trim()) return;
    await addDoc(collection(db, 'names'), { name: newName });
    setNewName('');
    loadNames();
  };

  const handleDeleteName = async id => {
    await deleteDoc(doc(db, 'names', id));
    loadNames();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const newViolation = { ...form, date: today };
    await addDoc(collection(db, 'violations'), newViolation);
    setForm({ name: '', type: '', date: '' });
    loadViolations();
  };

  const handleDelete = async id => {
    await deleteDoc(doc(db, 'violations', id));
    loadViolations();
  };

  const exportData = () => {
    const ws = XLSX.utils.json_to_sheet(violations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Violations');
    XLSX.writeFile(wb, 'violations.xlsx');
  };

  const exportWeeklyReport = () => {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 6);

    const weeklyViolations = violations.filter(v => {
      const date = new Date(v.date);
      return date >= lastWeek && date <= today;
    });

    if (weeklyViolations.length === 0) {
      alert('Tidak ada data pelanggaran dalam 7 hari terakhir.');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(weeklyViolations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Mingguan');
    XLSX.writeFile(wb, 'laporan_pelanggaran_mingguan.xlsx');
  };

  const logout = async () => {
    navigate('/public-dashboard');
    await auth.signOut();
  };

  const today = new Date().toISOString().split('T')[0];
  const isSameWeek = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    const diff = today.getTime() - date.getTime();
    return diff >= 0 && diff <= 6 * 24 * 60 * 60 * 1000 && today.getDay() >= date.getDay();
  };

  const isSameMonth = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth();
  };

  const filteredViolations = violations.filter(v => {
    if (filter === 'today') return v.date === today;
    if (filter === 'week') return isSameWeek(v.date);
    if (filter === 'month') return isSameMonth(v.date);
    return true;
  });

  const todayCount = filteredViolations.length;
  const gaugePercent = Math.min(todayCount / 10, 1);

  return (
    <div className="min-h-screen bg-white">
      <header className="text-[#2a4f7e] px-6 py-4 flex justify-between items-center px-6 py-4 border-b-2 border-[#0047a0]">
        <img src={logo} alt="Intress" className="h-12 w-auto mb-2" />
        <button onClick={logout} className="bg-blue-600 text-white px-3 py-1 rounded col-span-full hover:bg-[#ef3a37]">
          Log Out
        </button>
      </header>

      <h1 className="text-4xl font-bold text-center text-[#1c2a59] mt-10 mb-6">Admin Dashboard</h1>

      <div className="mb-6 text-center">
        <label className="mr-2 font-semibold text-[#1c2a59]">Filter: </label>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="today">Hari Ini</option>
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
          <option value="all">Semua</option>
        </select>
      </div>

      <div className="flex justify-center gap-10 flex-wrap mb-20 px-4">
        <div className="bg-[#f0f4ff] rounded-xl shadow-md p-12 w-55 text-center">
          <p className="flex justify-center text-xl font-semibold text-[#1c2a59]">Total Pelanggaran</p>
          <p className="text-6xl font-bold text-[#1c2a59] mt-2">{todayCount}</p>
        </div>
        <div className="bg-[#f0f4ff] rounded-xl shadow-md p-6 w-70 flex items-center justify-center">
          <GaugeChart
            id="gauge-chart"
            nrOfLevels={3}
            colors={['#1aff5c', '#ffdd00', '#ff4c4c']}
            arcWidth={0.3}
            animate={false}
            needleColor="#2f3e5c"
            needleBaseColor="#2f3e5c"
            textColor="transparent"
            percent={gaugePercent}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <select
            className="border p-2 rounded"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          >
            <option value="">Pilih Nama</option>
            {names.map(n => (
              <option key={n.id} value={n.name}>{n.name}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Jenis Pelanggaran"
            className="border p-2 rounded"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          />

          <button
            type="submit"
            className="bg-[#336cb0] text-white px-4 py-2 rounded hover:bg-[#0047a0]"
          >
            Simpan Data Pelanggaran
          </button>
        </form>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1c2a59] mb-2">Tambah Nama Pelanggar</h2>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nama Baru"
              className="border p-2 rounded w-full"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
            <button
              onClick={handleAddName}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-[#0047a0]"
            >
              Tambah
            </button>
          </div>
          <button
            onClick={() => setShowList(!showList)}
            className="text-sm text-blue-600 hover:underline mb-2"
          >
            {showList ? 'Sembunyikan Daftar Nama' : 'Tampilkan Daftar Nama'}
          </button>

          {showList && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {names.map(n => (
                <div key={n.id} className="flex justify-between items-center border p-2 rounded">
                  <span>{n.name}</span>
                  <button
                    onClick={() => handleDeleteName(n.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <button
            onClick={exportData}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export Semua Data
          </button>
          <button
            onClick={exportWeeklyReport}
            className="bg-[#336cb0] text-white px-4 py-2 rounded hover:bg-[#0047a0]"
          >
            Cetak Laporan Mingguan
          </button>
        </div>

        <div className="overflow-auto">
          <table className="w-full table-auto border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2">Nama</th>
                <th className="border px-4 py-2">Jenis</th>
                <th className="border px-4 py-2">Tanggal</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((v, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{v.name}</td>
                  <td className="border px-4 py-2">{v.type}</td>
                  <td className="border px-4 py-2">{v.date}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
