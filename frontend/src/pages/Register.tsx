import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAxios from '../lib/axios.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';

const Register = () => {
    const { axiosPublic } = useAxios();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validasi Client-side berbasis RegisterDto
  const isPasswordLongEnough = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await axiosPublic.post("/register", formData);
        const data = res.data;
        toast.success(data.message);
        navigate("/login");
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Side: Illustration & Info (Konsisten dengan referensi) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-gray-400 text-white relative">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
               <img src="/icons/apple-touch-icon.png" alt="logo chatbot" className="w-full h-full bg-white rounded-sm" />
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
              Automasi layanan <br /> WhatsApp desa.
            </h1>
            <p className="text-gray-50/80 max-w-sm">
              Kelola pesan warga, berikan balasan otomatis, dan tingkatkan kualitas pelayanan publik dengan platform EvolveWA.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
             <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 inline-block">
                <p className="text-sm italic">"Sistem RAG chatbot-nya sangat membantu efisiensi pelayanan desa kami."</p>
                <p className="text-xs mt-2 font-bold opacity-70">— Perangkat Desa</p>
             </div>
          </div>
          
          {/* Abstract pattern decoration */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
             <svg width="100%" height="100%"><pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#pattern)"/></svg>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Daftar Akun</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Lengkapi data untuk membuat akun warga baru</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Field 1: Username */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="budi_santoso"
                  onChange={(e) => setFormData((prev) => ({...prev, username: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all duration-200 outline-none ring-0 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Field 2: Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  onChange={(e) => setFormData((prev) => ({...prev, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all duration-200 outline-none ring-0 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Field 3: Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  onChange={(e) => setFormData((prev) => ({...prev, password: e.target.value }))}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-100 dark:bg-slate-800/50 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl transition-all duration-200 outline-none ring-0 focus:ring-4 focus:ring-blue-500/10 text-slate-800 dark:text-white"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Info Kriteria Password Real-time Sesuai RegisterDto */}
              {formData.password && (
                <div className="px-1 pt-1 space-y-1">
                  <p className={`text-xs flex items-center gap-1.5 ${isPasswordLongEnough ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isPasswordLongEnough ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    Minimal 8 karakter
                  </p>
                  <p className={`text-xs flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-500' : 'text-slate-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${hasUppercase ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    Harus mengandung setidaknya satu huruf besar
                  </p>
                </div>
              )}
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit"
              disabled={loading || !isPasswordLongEnough || !hasUppercase}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <span>Mendaftarkan...</span>
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Navigasi kembali ke Login */}
          <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            Sudah memiliki akun? <a href="/login" className="font-bold text-blue-500 hover:underline">Masuk disini</a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;