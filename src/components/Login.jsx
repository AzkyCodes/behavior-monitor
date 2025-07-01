// File: components/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import icon from './Indikator.png';
import logo from './InTress-KPPN-Liwa.png'; 
import logo1 from './logo-ih-papi.png'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      alert('Login gagal. Periksa kembali email & password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f1f5ff] relative">

      {/* === Logo Kiri Atas === */}
      <img
        src={logo}
        alt="InTress"
        className="absolute top-3 left-6 h-20 w-auto z-10"
      />

      {/* === Logo Kanan Atas === */}
      <img
        src={logo1}
        alt="ihpapi"
        className="absolute top-3 right-6 h-20 w-auto z-10"
      />

      {/* === Kiri - Form Login === */}
      <div className="flex-1 flex flex-col justify-center px-10 bg-white">
        <div className="max-w-md w-full mx-auto pb-10 mb-2">
          <h2 className="text-5xl font-bold text-[#2a4f7e] mb-2 text-center">Welcome Back</h2>
          <p className="text-sm text-[#496589] mb-10 text-center">
            Enter your email and password to access your account
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="pb-5">
              <label className="block text-sm mt-6 mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 font-semibold"
            >
              Login
            </button>

            {/* Tombol ke dashboard publik */}
            <button
              type="button"
              onClick={() => navigate('/public-dashboard')}
              className="w-full mt-2 border border-gray-400 text-gray-600 py-2 rounded hover:bg-gray-100"
            >
              Back
            </button>
          </form>
        </div>
      </div>

      {/* === Kanan - Ilustrasi & Judul === */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 bg-[#f1f5ff]">
        <h1 className="text-3xl md:text-6xl font-bold text-[#274e7d] pb-10 leading-relaxed mt-10">
          Indikator Harian <br /> Pengawasan Perilaku <br /> Internal
        </h1>
        <img src={icon} alt="PNS" className="w-[400px] h-auto" />
      </div>
    </div>
  );
}
