// File: components/PublicDashboard.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import GaugeChart from 'react-gauge-chart';
import { Link } from 'react-router-dom';
import icon from './Indikator.png';
import logo from './InTress-KPPN-Liwa.png';
import logo1 from './KEMENKEU_LOGO-VERTICAL_W-1.png';
import logo2 from './Master-Logo-DJPb.png';
import logo3 from './logo-ih-papi.png';


export default function PublicDashboard() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const today = new Date().toISOString().split('T')[0];
      const q = query(collection(db, 'violations'), where('date', '==', today));
      const snapshot = await getDocs(q);
      setCount(snapshot.size);
    }
    fetchData();
  }, []);

  const percent = count > 10 ? 1 : count / 10;

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = today.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const getEmoji = () => {
    if (count <= 3) return '😊';
    if (count <= 7) return '😐';
    return '😠';
  };

  return (
    <div className="min-h-screen bg-white-100 flex flex-col items-center px-2">
      <header className="w-full bg-white p-2 shadow-md flex items-center justify-between">
        {/* Kiri: Logo Kemenkeu dan DJPb */}
        <div className="flex items-center gap-4">
          <img src={logo1} alt="Logo Kemenkeu" className="h-16" />
          <img src={logo2} alt="Logo DJPb" className="h-16" />
        </div>

        {/* Kanan: Logo InTress dan ihpapi (ihpapi di paling kanan) */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo InTress" className="h-16" />
          <img src={logo3} alt="Logo ihpapi" className="h-16" />
        </div>
      </header>



      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 px-2">
        <div className="bg-[#dbeafe] p-6 rounded-lg flex flex-col items-center justify-center text-center shadow-md">
          <h1 className="text-4xl font-semibold text-[#2a4f7e] mb-5 leading-tight">
            Indikator Harian <br /> Pengawasan Perilaku Internal
          </h1>
          <img src={icon} alt="PNS" className="w-[400px] h-auto" />
          <Link to="/login" className="bg-blue-600 text-white px-20 py-2 rounded-full hover:font-semibold text-lg shadow-md">
            Log In
          </Link>
        </div>

        <div className="bg-[#dbeafe] p-6 rounded-lg flex flex-col gap-4 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="bg-white rounded-lg p-8 flex flex-col justify-center items-center w-full md:w-1/2 shadow-md">
              <h2 className="text-xl font-semibold text-[#2a4f7e]">Total Pelanggaran</h2>
              <span className="text-7xl font-extrabold text-[#2a4f7e]">{count}</span>
            </div>

            <div className="bg-white rounded-lg p-6 flex flex-col justify-center items-center w-full md:w-1/2 shadow-md">
              <h2 className="text-xl font-semibold text-[#2a4f7e] mb-2">{dateStr}</h2>
              <div className="bg-[#f9f9f9] border-4 border-[#2a4f7e] px-4 py-4 rounded-md font-mono text-4xl shadow-inner">
                {timeStr}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-10 flex flex-col justify-center items-center shadow-md">
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
            <div className="text-5xl text-center">{getEmoji()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
