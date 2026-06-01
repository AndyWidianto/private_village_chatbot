import { Link } from "react-router";



const mockInstances = [
    { id: 'inst-01', name: 'SaaS Platform Production', phone: '+62 812-3456-7890', status: 'connected' },
    { id: 'inst-02', name: 'Customer Service Utama', phone: '+62 877-9988-1122', status: 'connected' },
    { id: 'inst-03', name: 'Testing & Sandbox Bot', phone: '+62 851-0022-3344', status: 'disconnected' },
];



export default function InstanceSelector() {
  return (
    // Background Global (Light: bg-slate-50, Dark: from-slate-900 via-slate-850 to-indigo-950)
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* Card Utama */}
      <div className="w-full max-w-2xl p-8 bg-white/80 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-2xl transition-all duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">
            Evolve WA Gateway
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Pilih atau hubungkan *instance* WhatsApp untuk mulai mengelola chat real-time
          </p>
        </div>

        {/* List Instance */}
        <div className="space-y-4">
          {mockInstances.map((inst) => {
            const isConnected = inst.status === 'connected';
            return (
              <Link
                key={inst.id}
                to={`/dashboard/chat-realtime/${inst.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 hover:bg-indigo-50/30 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-150 hover:border-indigo-400/50 dark:border-slate-700 dark:hover:border-indigo-500/50 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon Indikator */}
                  <div className={`mt-1 w-3 h-3 rounded-full shrink-0 ${
                    isConnected 
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' 
                      : 'bg-rose-500 shadow-lg shadow-rose-500/30'
                  }`} />
                  
                  <div>
                    <h3 className="font-semibold text-slate-700 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400 transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{inst.phone}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">{inst.id}</p>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-4 sm:mt-0 flex items-center justify-end">
                  {isConnected ? (
                    <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors">
                      Masuk Dashboard →
                    </button>
                  ) : (
                    <span className="text-xs font-medium px-3 py-1 rounded-full border text-rose-600 bg-rose-50/50 border-rose-200 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-500/20">
                      Disconnected
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Butuh menghubungkan nomor baru?{' '}
          <span className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
            Tambah Instance Baru
          </span>
        </div>
      </div>
    </div>
  );
}