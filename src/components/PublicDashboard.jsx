import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import GaugeChart from 'react-gauge-chart';
import icon from './icon.png';
import logo from './InTress-KPPN-Liwa.png';
import logo1 from './KEMENKEU_LOGO-VERTICAL_W-1.png';
import logo2 from './Master-Logo-DJPb.png';

export default function PublicDashboard() {
  const [yesterdayCount, setYesterdayCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      const snapshot = await getDocs(collection(db, 'violations'));
      const allData = snapshot.docs.map(doc => doc.data());

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const currentMonth = today.toISOString().slice(0, 7);

      const yCount = allData.filter(v => v.date === yesterdayStr).length;
      const tCount = allData.filter(v => v.date === todayStr).length;
      const mCount = allData.filter(v => v.date?.startsWith(currentMonth)).length;

      setYesterdayCount(yCount);
      setTodayCount(tCount);
      setMonthlyCount(mCount);
    }

    fetchData();

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const percent = todayCount > 10 ? 1 : todayCount / 10;

  const dateStr = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const timeStr = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const getEmoji = () => {
    if (todayCount <= 3) return '😊😊😊';
    if (todayCount <= 7) return '😐😐😐';
    return '😠😠😠';
  };

  const getMonthlyStatus = () => {
    if (monthlyCount <= 5) return { color: 'bg-green-500', label: 'Baik' };
    if (monthlyCount <= 10) return { color: 'bg-yellow-400', label: 'Sedang' };
    return { color: 'bg-red-500', label: 'Perlu Perhatian' };
  };

  const monthlyStatus = getMonthlyStatus();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo1} alt="Logo Kemenkeu" className="h-16" />
          <img src={logo2} alt="Logo DJPb" className="h-16" />
        </div>
        <img src={logo} alt="Logo InTress" className="h-16" />
      </header>

      {/* Body */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 bg-[#e5edfb]">
        {/* Kiri - Judul & Ikon */}
        <div className="bg-[#dbeafe] p-6 rounded-lg text-center shadow-md flex flex-col items-center justify-center">
          <h1 className="text-2xl lg:text-4xl font-bold text-[#2a4f7e] mb-10 leading-tight">
            Indikator Harian <br /> Pengawasan Perilaku Internal
          </h1>
          <img src={icon} alt="Icon" className="w-[360px] h-auto" />
        </div>

        {/* Kanan - 4 Panel */}
        <div className="lg:col-span-2 grid grid-cols-2 grid-rows-2 gap-4">
          {/* 1 - Pelanggaran Bulan Ini */}
          <div className="bg-white rounded-xl px-4 py-6 flex flex-col items-center justify-center shadow-md">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#2a4f7e] mb-2 text-center">
              Pelanggaran Bulan Ini
            </h2>
            <span className="text-6xl md:text-8xl font-bold text-[#2a4f7e] leading-tight">
              {monthlyCount}
            </span>
            <div className="mt-4 flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${monthlyStatus.color}`}
                title={monthlyStatus.label}
              ></div>
              <p className="text-sm mt-1 font-medium text-[#2a4f7e]">{monthlyStatus.label}</p>
            </div>
          </div>

          {/* 2 - Tanggal dan Waktu */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-md">
            <h2 className="text-4xl font-semibold text-[#2a4f7e] mb-5">{dateStr}</h2>
            <div className="border-2 border-[#2a4f7e] px-6 py-5 rounded text-5xl font-mono shadow-inner">
              {timeStr}
            </div>
          </div>

          {/* 3 - Pelanggaran Kemarin */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-md">
            <h2 className="text-3xl font-semibold text-[#2a4f7e] mb-2">Pelanggaran Kemarin</h2>
            <p className="text-sm text-gray-500 mb-2">Sebagai pengingat untuk hari ini</p>
            <span className="text-9xl font-bold text-[#2a4f7e]">{yesterdayCount}</span>
          </div>

          {/* 4 - Gauge Chart Hari Ini */}
          <div className="bg-white rounded-lg p-6 flex flex-col items-center justify-center shadow-md">
            <div className="w-full max-w-[500px]">
              <GaugeChart
                id="gauge-chart"
                nrOfLevels={3}
                colors={["#00FF00", "#FFFF00", "#FF0000"]}
                arcWidth={0.3}
                percent={percent}
                needleColor="#333"
                needleBaseColor="#333"
                textColor="#00000000"
              />
            </div>
            <div className="text-5xl mt-4">{getEmoji()}</div>
            <p className="text-sm mt-2 text-gray-500">(Pelanggaran Hari Ini: {todayCount})</p>
          </div>
        </div>
      </main>
    </div>
  );
}
