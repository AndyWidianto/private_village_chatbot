

export default function ChatReatime() {
    return (
        <div>
            { /*Wrapper Utama */}
            <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">

                { /*Sisi Kiri: List Pengaduan */}
                <aside className="w-1/3 border-r border-slate-200 dark:border-slate-700 p-4">
                    <h2 className="text-xl font-bold mb-4">Pengaduan Anda</h2>
                    <div className="space-y-3">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <p className="font-semibold">Laporan Jalan Rusak</p>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Diproses</span>
                        </div>
                    </div>
                </aside>

                { /*Sisi Kanan: Chat Real-time */}
                <main className="flex-1 flex flex-col">
                    <header className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="font-bold">Chat Admin</h2>
                    </header>

                    { /*Area Pesan */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="max-w-xs p-3 rounded-lg bg-blue-500 text-white ml-auto">
                            Halo, ada yang bisa dibantu mengenai laporan Anda?
                        </div>
                    </div>

                    { /*Input Chat */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <input type="text" placeholder="Tulis pesan..." className="w-full p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600" />
                    </div>
                </main>
            </div>
        </div>
    )
}