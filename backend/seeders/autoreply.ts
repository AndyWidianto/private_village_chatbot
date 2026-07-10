import { Prisma, PrismaClient } from "@prisma/client"


const data = [
    {
        "keyword": "hai, halo, hello, assalamualaikum",
        "content": "Waalaikumsalam/Halo! Selamat datang di layanan informasi otomatis Pemerintah Desa Gembongdadi, Kec. Suradadi, Kab. Tegal. Ketik 'INFO' untuk melihat daftar menu layanan kami."
    },
    {
        "keyword": "info, menu, bantuan, layanan",
        "content": "Berikut kategori layanan Desa Gembongdadi:\n1. Kependudukan (KTP, KK, Akta)\n2. Surat Keterangan (SKTM, SKU, Domisili)\n3. Sosial & Kesehatan (Bansos, Posyandu)\n4. Profil Desa\nKetik kata kunci yang Anda butuhkan (contoh: 'syarat ktp' atau 'jam kerja')."
    },
    {
        "keyword": "alamat, lokasi, kantor desa, balai desa",
        "content": "Kantor Kepala Desa Gembongdadi beralamat di Jl. Raya Gembongdadi, Kecamatan Suradadi, Kabupaten Tegal, Jawa Tengah. Anda bisa mencari 'Balai Desa Gembongdadi' di Google Maps."
    },
    {
        "keyword": "jam kerja, buka, operasional, tutup",
        "content": "Jam operasional pelayanan Balai Desa Gembongdadi:\n- Senin s.d. Kamis: 08.00 - 15.00 WIB\n- Jumat: 08.00 - 11.30 WIB\nSabtu, Minggu, dan Hari Libur Nasional TUTUP."
    },
    {
        "keyword": "kontak, no telpon, hubungi, call center",
        "content": "Untuk keadaan darurat atau informasi lebih lanjut, silakan hubungi Perangkat Desa yang bertugas atau datang langsung ke Balai Desa Gembongdadi pada jam kerja."
    },
    {
        "keyword": "ktp, e-ktp, buat ktp, rekam ktp",
        "content": "Syarat pengajuan/pembuatan KTP-el baru:\n1. Berusia 17 tahun / sudah menikah\n2. Fotokopi Kartu Keluarga (KK)\n3. Surat Pengantar RT/RW\nSilakan bawa berkas ke Balai Desa untuk dibuatkan pengantar ke Kecamatan Suradadi."
    },
    {
        "keyword": "ktp hilang, ktp rusak",
        "content": "Syarat cetak ulang KTP hilang/rusak:\n1. Surat Keterangan Kehilangan dari Kepolisian (jika hilang)\n2. KTP asli yang rusak (jika rusak)\n3. Fotokopi KK.\nBawa ke Balai Desa untuk pengantar."
    },
    {
        "keyword": "kk, kartu keluarga, buat kk, tambah anggota",
        "content": "Syarat pembuatan/perubahan KK:\n1. KK Asli (lama)\n2. Fotokopi Buku Nikah / Akta Cerai\n3. Surat Pengantar RT/RW\n4. Fotokopi Surat Keterangan Lahir (jika tambah anak)."
    },
    {
        "keyword": "akta lahir, akta kelahiran",
        "content": "Syarat pengajuan Akta Kelahiran:\n1. Surat Keterangan Lahir (Bidan/RS/Desa)\n2. Fotokopi Buku Nikah orang tua\n3. Fotokopi KK dan KTP orang tua\n4. Fotokopi KTP 2 orang saksi."
    },
    {
        "keyword": "akta kematian, surat mati, meninggal",
        "content": "Syarat pengajuan Akta Kematian:\n1. Surat Keterangan Meninggal dari RS/Bidan/Desa\n2. KTP asli dan KK almarhum\n3. Fotokopi KTP Pelapor (Ahli waris)\n4. Fotokopi KTP 2 orang saksi."
    },
    {
        "keyword": "sktm, surat miskin, keterangan tidak mampu",
        "content": "Syarat pembuatan SKTM (Surat Keterangan Tidak Mampu):\n1. Surat Pengantar RT/RW\n2. Fotokopi KK dan KTP\n3. Foto rumah (tampak depan, samping, dalam).\nProses penerbitan dilakukan di Balai Desa."
    },
    {
        "keyword": "sku, keterangan usaha, surat usaha",
        "content": "Syarat pembuatan SKU (Surat Keterangan Usaha) untuk bank/bantuan:\n1. Surat Pengantar RT/RW\n2. Fotokopi KTP & KK\n3. Foto tempat usaha\n4. Keterangan jenis usaha."
    },
    {
        "keyword": "skck, surat kelakuan baik, pengantar polisi",
        "content": "Syarat pengantar SKCK dari Desa:\n1. Fotokopi KTP\n2. Fotokopi KK\n3. Fotokopi Akta Kelahiran / Ijazah Terakhir\n4. Surat Pengantar RT/RW.\nSetelah dari desa, dilanjutkan ke Polsek Suradadi."
    },
    {
        "keyword": "domisili, surat domisili, keterangan tinggal",
        "content": "Syarat pembuatan Surat Keterangan Domisili:\n1. Fotokopi KTP dan KK asal\n2. Surat Pengantar dari RT/RW setempat (di Gembongdadi)\n3. Pas foto 3x4 (2 lembar)."
    },
    {
        "keyword": "pindah, surat pindah, pindah keluar",
        "content": "Syarat Surat Keterangan Pindah (Keluar Desa):\n1. KK dan KTP asli\n2. Surat Pengantar RT/RW\n3. Pas foto 3x4 (3 lembar)\n4. Alamat tujuan pindah yang lengkap (RT/RW, Desa, Kec, Kab, Provinsi)."
    },
    {
        "keyword": "datang, pindah datang, masuk desa",
        "content": "Syarat Pindah Datang ke Gembongdadi:\n1. Surat Pindah Asli (SKPWNI) dari daerah asal\n2. KTP asli\n3. Fotokopi Buku Nikah (jika ada)\n4. Melapor ke RT/RW tujuan di Gembongdadi."
    },
    {
        "keyword": "nikah, pengantar nikah, na, n1, n2",
        "content": "Syarat Pengantar Nikah (N1-N4):\n1. Fotokopi KTP, KK, Akta Lahir Calon Suami & Istri\n2. Fotokopi KTP Orang Tua\n3. Pas foto 2x3 dan 3x4 (latar biru)\n4. Surat Keterangan Belum Menikah / Akta Cerai (jika duda/janda)."
    },
    {
        "keyword": "ahli waris, keterangan waris",
        "content": "Syarat Surat Keterangan Ahli Waris:\n1. Surat Pernyataan Ahli Waris bermaterai\n2. Fotokopi Akta Kematian Pewaris\n3. Fotokopi KK dan KTP seluruh ahli waris\n4. Surat Pengantar RT/RW."
    },
    {
        "keyword": "beda nama, ralat nama",
        "content": "Syarat Keterangan Beda Nama (KTP/KK dengan Ijazah/Buku Nikah):\n1. Fotokopi KTP dan KK\n2. Fotokopi dokumen yang terdapat perbedaan nama (Ijazah/Buku Nikah/Akta)\n3. Pengantar RT/RW."
    },
    {
        "keyword": "belum nikah, janda, duda",
        "content": "Syarat Keterangan Belum Pernah Menikah / Janda / Duda:\n1. Pengantar RT/RW\n2. Fotokopi KTP & KK\n3. Surat Pernyataan Belum Menikah bermaterai / Akta Cerai asli / Akta Kematian Pasangan."
    },
    {
        "keyword": "blt, dana desa, blt dd",
        "content": "Informasi BLT Dana Desa Gembongdadi: Penentuan KPM (Keluarga Penerima Manfaat) diputuskan melalui Musyawarah Desa berdasarkan kriteria kemiskinan ekstrem. Info pencairan akan diumumkan melalui Kepala Dusun/RT masing-masing."
    },
    {
        "keyword": "pkh, bpnt, bansos, bantuan sosial",
        "content": "Bantuan PKH dan BPNT adalah program dari Kemensos RI. Untuk pengecekan status penerima, Anda bisa mengakses cekbansos.kemensos.go.id atau menanyakan ke operator SIKS-NG di Balai Desa."
    },
    {
        "keyword": "bpjs, kis, pbi, kesehatan gratis",
        "content": "Pembuatan BPJS KIS PBI (Gratis dari Pemerintah):\n1. Terdaftar di DTKS (Data Terpadu Kesejahteraan Sosial)\n2. Fotokopi KTP & KK\n3. SKTM dari Desa. Pendaftaran diajukan melalui Dinas Sosial Kab. Tegal."
    },
    {
        "keyword": "pbb, pajak bumi, bayar pajak, sppt",
        "content": "Untuk pembayaran Pajak Bumi dan Bangunan (PBB), SPPT dibagikan melalui RT/Perangkat Desa. Pembayaran dapat dilakukan melalui Bank Jateng, Kantor Pos, Indomaret/Alfamart, atau Petugas Pungut Desa Gembongdadi."
    },
    {
        "keyword": "posyandu, balita, imunisasi",
        "content": "Jadwal Posyandu Balita Desa Gembongdadi diadakan rutin setiap bulan di masing-masing RW. Informasi jadwal pasti akan diumumkan oleh Kader Posyandu/Bidan Desa setempat. Pastikan membawa Buku KIA."
    },
    {
        "keyword": "posbindu, lansia, cek kesehatan",
        "content": "Kegiatan Posbindu dan Posyandu Lansia (cek gula darah, tensi, dll) diadakan rutin bulanan. Silakan hubungi Kader Kesehatan di lingkungan RT Anda untuk jadwal bulan ini."
    },
    {
        "keyword": "stunting, gizi buruk, pmt",
        "content": "Pemerintah Desa Gembongdadi mendukung percepatan penurunan stunting melalui program PMT (Pemberian Makanan Tambahan) di Posyandu. Jika ada keluhan gizi anak, segera konsultasikan ke Bidan Desa."
    },
    {
        "keyword": "bidan desa, perawat, kesehatan",
        "content": "Layanan Bidan Desa Gembongdadi siap melayani pemeriksaan kehamilan, KB, dan kesehatan dasar. Lokasi PKD (Poliklinik Kesehatan Desa) berada di area desa. Untuk kondisi gawat darurat, silakan menuju Puskesmas Suradadi."
    },
    {
        "keyword": "puskesmas, rumah sakit, rujukan",
        "content": "Fasilitas kesehatan tingkat pertama untuk warga Gembongdadi adalah Puskesmas Suradadi. Pastikan membawa KTP, KK, dan Kartu BPJS/KIS saat berobat."
    },
    {
        "keyword": "bumdes, badan usaha, usaha desa",
        "content": "BUMDes Gembongdadi adalah badan usaha milik desa yang bertujuan menggerakkan perekonomian warga. Untuk informasi kemitraan, unit usaha, dan sewa fasilitas, silakan hubungi pengurus BUMDes di Balai Desa."
    },
    {
        "keyword": "sampah, pengelolaan sampah, buang sampah",
        "content": "Mari jaga kebersihan Desa Gembongdadi! Buanglah sampah pada tempatnya dan jangan membuang sampah di sungai. Program pengelolaan sampah dikoordinasikan oleh BUMDes/Kelompok Swadaya Masyarakat setempat."
    },
    {
        "keyword": "keamanan, linmas, siskamling, ronda",
        "content": "Keamanan lingkungan adalah tanggung jawab bersama. Jadwal siskamling/ronda diatur oleh masing-masing RT. Jika terjadi gangguan kamtibmas, segera lapor ke Ketua RT atau Babinsa/Bhabinkamtibmas Desa Gembongdadi."
    },
    {
        "keyword": "karang taruna, pemuda",
        "content": "Karang Taruna Desa Gembongdadi mewadahi kegiatan kepemudaan, olahraga, dan sosial. Pemuda-pemudi desa yang ingin bergabung atau memiliki usulan kegiatan dapat menghubungi pengurus Karang Taruna."
    },
    {
        "keyword": "pkk, ibu-ibu, dawis, dasa wisma",
        "content": "Tim Penggerak PKK Desa Gembongdadi aktif dalam program pemberdayaan keluarga, kesehatan, dan keterampilan ibu-ibu. Kegiatan rutin dilaksanakan dari tingkat Dasa Wisma hingga Desa."
    },
    {
        "keyword": "bpd, badan permusyawaratan desa",
        "content": "BPD (Badan Permusyawaratan Desa) Gembongdadi merupakan wakil dari penduduk desa berdasarkan keterwakilan wilayah. Anda bisa menyampaikan aspirasi terkait pembangunan desa melalui anggota BPD di wilayah Anda."
    },
    {
        "keyword": "lpmd, pembangunan",
        "content": "LPMD (Lembaga Pemberdayaan Masyarakat Desa) Gembongdadi bertugas membantu Kepala Desa dalam merencanakan dan melaksanakan pembangunan yang partisipatif."
    },
    {
        "keyword": "rt, rw, kadus, ketua rt",
        "content": "Pengurusan surat menyurat wajib dimulai dari tingkat RT dan RW untuk verifikasi domisili. Setelah mendapat tanda tangan dan stempel RT/RW, berkas dibawa ke Balai Desa Gembongdadi."
    },
    {
        "keyword": "sejarah, asal usul",
        "content": "Desa Gembongdadi memiliki sejarah panjang yang kental dengan budaya agraris pesisir utara Jawa. Nama Gembongdadi merupakan warisan leluhur yang terus dijaga kelestariannya oleh masyarakat setempat."
    },
    {
        "keyword": "visi, misi",
        "content": "Visi Pemerintah Desa Gembongdadi adalah mewujudkan desa yang mandiri, sejahtera, agamis, dan berbudaya melalui pelayanan prima dan pembangunan infrastruktur yang merata."
    },
    {
        "keyword": "luas, penduduk, geografis",
        "content": "Desa Gembongdadi terletak di Kecamatan Suradadi, Kabupaten Tegal. Mayoritas penduduk bermata pencaharian sebagai petani, pedagang, dan wiraswasta, didukung oleh kondisi geografis dataran rendah."
    },
    {
        "keyword": "pengaduan, lapor, komplain",
        "content": "Punya kritik, saran, atau aduan terkait pelayanan dan pembangunan di Desa Gembongdadi? Silakan sampaikan secara tertulis ke Kotak Saran di Balai Desa atau melalui perangkat desa dengan bahasa yang sopan."
    },
    {
        "keyword": "jalan rusak, aspal, cor",
        "content": "Laporan mengenai infrastruktur seperti jalan desa yang rusak atau lampu penerangan jalan mati dapat disampaikan ke Ketua RT/RW atau Kepala Dusun untuk dibahas dalam Musrenbang Desa."
    },
    {
        "keyword": "banjir, bencana, darurat",
        "content": "Dalam kondisi darurat bencana (banjir, angin puting beliung, kebakaran), harap segera evakuasi ke tempat aman dan hubungi Perangkat Desa, Linmas, atau Polsek Suradadi secepatnya."
    },
    {
        "keyword": "pertanian, gapoktan, pupuk subsidi",
        "content": "Informasi mengenai jadwal tanam, alokasi pupuk bersubsidi, dan Kartu Tani dapat ditanyakan langsung kepada Ketua Kelompok Tani (Gapoktan) Desa Gembongdadi atau PPL Pertanian Kecamatan."
    },
    {
        "keyword": "website, sosial media, sosmed, facebook",
        "content": "Ikuti perkembangan dan informasi terbaru dari Pemerintah Desa Gembongdadi melalui kanal media sosial resmi atau website desa (jika tersedia). Mari bijak bermedia sosial!"
    },
    {
        "keyword": "agustusan, hut ri, lomba",
        "content": "Informasi kegiatan peringatan HUT Kemerdekaan RI (Karnaval, Lomba, Malam Tasyakuran) dikoordinasikan oleh Panitia Tingkat Desa dan Karang Taruna. Tunggu surat edaran resminya menjelang bulan Agustus."
    },
    {
        "keyword": "musdes, musrenbang",
        "content": "Musyawarah Desa (Musdes) dan Musrenbangdes dilaksanakan setiap tahun untuk menentukan prioritas pembangunan. Partisipasi tokoh masyarakat dan warga sangat dibutuhkan."
    },
    {
        "keyword": "kerja bakti, gotong royong",
        "content": "Budaya gotong royong tetap dijaga di Gembongdadi. Kerja bakti lingkungan (Jumat Bersih/Minggu Bersih) dikoordinasikan oleh masing-masing RT/RW. Mari bersama jaga kebersihan desa kita!"
    },
    {
        "keyword": "sertifikat tanah, ptsl, prona",
        "content": "Informasi mengenai program pendaftaran tanah sistematis lengkap (PTSL) atau sertifikat massal akan disosialisasikan secara resmi oleh Pemerintah Desa apabila ada kuota dari BPN Kabupaten Tegal."
    },
    {
        "keyword": "terima kasih, suwun, thx",
        "content": "Sama-sama! Senang bisa membantu Anda. Jika butuh informasi layanan Desa Gembongdadi lainnya, jangan ragu untuk menghubungi layanan ini kembali. Semoga hari Anda menyenangkan!"
    }
]
export async function createAutoreply() {
    const prisma = new PrismaClient();
    const dataToSave = data.map<Prisma.AutoreplyCreateManyInput>((d, index) => ({
        id: (index * 1000 * 4).toString(),
        name: d.keyword,
        isActive: true,
        type: "keyword",
        replyContent: d.content,
    }))
    await prisma.autoreply.createMany({
        data: dataToSave,
        skipDuplicates: true
    });
    console.log("Autoreply berhasil di tambahkan");
}