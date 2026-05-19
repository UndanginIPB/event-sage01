"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Papa from 'papaparse'

function Index() {
  const [datas, setDatas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const getDriveDirectUrl = (url) => {
    if (!url) return null;

    // Jika url mengandung 'drive.google.com', kita ekstrak ID-nya
    if (url.includes("drive.google.com/file/d/")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        // Mengubahnya menjadi format direct link Google Drive
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    // Jika bukan link Drive (misal foto lokal /default.png), kembalikan apa adanya
    // Pastikan jika ini gambar lokal, kita tambahkan "/" di depannya agar Next.js tahu
    if (!url.startsWith('http')) {
      return `/${url}`;
    }
    return url;
  }


  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data.length > 0) {
              setDatas(results.data[0]);
            } else {
              setErrorMsg("Data undangan tidak ditemukan.");
            }
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMsg("Gagal mengambil data undangan.");
        setIsLoading(false);
      }
    };

    fetchSheetData();
  }, []);

  useEffect(() => {
    const images = Array.from(document.images);
    const unloadedImages = images.filter((img) => !img.complete);

    if (unloadedImages.length > 0) {
      Promise.all(
        unloadedImages.map((img) => {
          return new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          });
        })
      ).then(() => {
        setTimeout(() => setAllImagesLoaded(true), 2000);
      });
    } else {
      setTimeout(() => setAllImagesLoaded(true), 2000);
    }
  }, [datas]);

  const parseDate = (str) => {
    if (!str) return null;
    const [dateparts, timeparts] = str.split(" ");
    const [year, month, day] = dateparts?.split("-") || [];
    const [hours = 0, minutes = 0, seconds = 0] = timeparts?.split(":") ?? [];
    return new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes, +seconds));
  };

  const dateString = datas?.date_event;
  const d = parseDate(dateString);
  const dateObject = d || new Date();

  const hours = String(dateObject.getUTCHours()).padStart(2, '0');
  const minutes = String(dateObject.getUTCMinutes()).padStart(2, '0');

  // Animasi Framer Motion
  const sway = {
    animate: { rotate: [-3, 3, -3] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  };
  const swaySlow = {
    animate: { rotate: [-2, 2, -2] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  };
  const float = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
  };

  if (isLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center text-[#50724C]">Loading undangan...</div>;
  }

  if (errorMsg) {
    return <div className="w-full min-h-screen flex items-center justify-center text-red-500">{errorMsg}</div>;
  }

  return (
    <div className='w-full h-full'>
      <div className='w-full min-h-screen flex justify-center items-center overflow-hidden relative'>

        {/* ================= BACKGROUND LUAR ================= */}
        <motion.div className='absolute hidden lg:block z-10 -top-14 -right-10' {...sway}>
          <Image src="/bunga-2.png" alt="Daun" width={220} height={220} className='rotate-180 w-auto h-auto' priority />
        </motion.div>
        <motion.div className='absolute hidden lg:block z-10 -bottom-14 -left-10' {...swaySlow}>
          <Image src="/bunga-2.png" alt="Daun" width={220} height={220} className='w-auto h-auto' priority />
        </motion.div>
        <motion.div className='absolute hidden lg:block z-10 -top-4 -left-20' {...sway}>
          <Image src="/bunga-4.png" alt="Daun" width={180} height={180} className='w-auto h-auto' />
        </motion.div>
        <motion.div className='absolute hidden lg:block z-10 -bottom-6 -right-10' {...swaySlow}>
          <Image src="/bunga-6.png" alt="Daun" width={180} height={180} className='w-auto h-auto' />
        </motion.div>

        {/* ================= KONTEN UTAMA ================= */}
        <div className='w-full h-full lg:w-[900px] lg:flex overflow-hidden lg:my-auto lg:border-[#50724C] lg:border-2 relative z-20 bg-white'>

          {/* ----- Kolom Kiri ----- */}
          <div className='w-full h-full overflow-hidden lg:overflow-visible lg:w-[47.5%] relative'>
            <div className='w-full pt-14 pb-16 flex flex-col justify-center'>
              <div className='relative flex w-[320px] h-64 mx-auto'>
                <motion.div className='relative flex w-[320px] h-[320px] z-0' {...float}>
                  {datas?.image && datas.image !== "" && (
                    <Image src={getDriveDirectUrl(datas.image)} width={225} height={225} alt="Foto Acara" className='border-[#4F6F43] border-solid border-4 object-cover rounded-full m-auto z-10 absolute inset-0 w-56.25 h-56.25' />
                  )}
                  <Image src="/bunga-1.png" alt="Bingkai" width={320} height={320} className='absolute z-20 top-4 w-full h-full object-contain' priority />
                </motion.div>
              </div>

              {/* JUDUL ACARA DINAMIS (KOLOM KIRI) */}
              <div className='text-center font-yellowtail pt-10 mx-14 relative z-30'>
                <h1 className='text-[#50724C] text-[38px] lg:text-[42px] leading-tight whitespace-pre-line'>
                  Acara
                  <br />
                  {datas?.event_title || "Acara\nUndangan"}
                </h1>
              </div>
            </div>

            {/* Dekorasi Sudut Kiri */}
          </div>
          <motion.div className='absolute z-10 -top-4 -left-20' {...sway}>
            <Image src="/bunga-4.png" alt="Daun" width={160} height={160} className='w-auto h-auto' />
          </motion.div>
          <motion.div className='absolute z-10 -top-28 -right-10' {...swaySlow}>
            <Image src="/bunga-3.png" alt="Daun" width={160} height={160} className='w-auto h-auto' />
          </motion.div>
          <motion.div className='absolute z-10 -bottom-14 -left-10' {...sway}>
            <Image src="/bunga-2.png" alt="Daun" width={160} height={160} className='w-auto h-auto' />
          </motion.div>

          {/* ----- Garis Pemisah (Border) ----- */}
          <div className='lg:w-[5%] hidden lg:flex items-center justify-center relative z-10'>
            <Image src="/border.png" alt="Border" width={20} height={500} className='h-[80%] w-auto object-contain' />
          </div>

          {/* ----- Kolom Kanan ----- */}
          <div className='w-full h-full lg:w-[47.5%] relative overflow-hidden lg:overflow-visible flex items-center justify-center'>
            <div className='w-full py-16 text-center text-[#50724C] font-monserrat font-medium z-20'>
              <p className='px-12 text-base italic'>{datas?.greetings}</p>

              {/* TEKS UNDANGAN DINAMIS (KOLOM KANAN) */}
              <p className='px-12 pt-4 text-sm'>
                Kami mengundang Anda untuk hadir dalam {datas?.event_title ? datas.event_title.replace("<br>", " ").replace("\n", " ") : "acara"} :
              </p>

              <h1 className='font-yellowtail text-[40px] px-4 pt-2'>
                {datas?.child_name || "Nama"}
              </h1>
              <p className='px-12 pt-4 text-sm'>
                Akan diselenggarakan pada :
              </p>

              <div className='my-3 py-3 mx-auto w-[280px] rounded-lg bg-[#A7BFA5] text-[#0C3408] uppercase text-[13px] shadow-sm'>
                <div className='flex flex-col justify-center px-3'>
                  <div className='w-full flex gap-2'>
                    <p className='w-1/3 text-end'>Hari :</p>
                    <p className='w-2/3 text-start'>{d != null ? d.toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "-"}</p>
                  </div>
                  <div className='w-full flex gap-2'>
                    <p className='w-1/3 text-end'>Waktu :</p>
                    <p className='w-2/3 text-start'>{`${hours}:${minutes}`} - selesai</p>
                  </div>
                  <div className='w-full flex gap-2'>
                    <p className='w-1/3 text-end'>Tempat :</p>
                    <p className='w-2/3 text-start'>{datas?.address || "-"}</p>
                  </div>
                </div>
              </div>

              {datas?.url_map && (
                <a target='_blank' rel='noopener noreferrer' href={datas.url_map} className='inline-block px-6 py-2 rounded-2xl bg-[#A7BFA5] hover:bg-[#50724C] transition-colors border-[#50724C] border text-white my-3 text-sm'>
                  Klik Map Disini
                </a>
              )}

              <p className='px-5 py-4 text-sm'>
                {datas?.closing}
              </p>

              {datas?.enclosure && (
                <p className='px-5 py-4 text-base text-[#50724C]'>
                  {datas.enclosure}
                </p>
              )}
            </div>


          </div>
          {/* Dekorasi Sudut Kanan */}
          <motion.div className='absolute z-10 -top-14 -right-10' {...swaySlow}>
            <Image src="/bunga-2.png" alt="Daun" width={160} height={160} className='rotate-180 w-auto h-auto' />
          </motion.div>
          <motion.div className='absolute z-10 top-1/3 -right-12' {...sway}>
            <Image src="/bunga-5.png" alt="Daun" width={120} height={120} className='w-auto h-auto' />
          </motion.div>
          <motion.div className='absolute z-10 -bottom-6 -right-10' {...float}>
            <Image src="/bunga-6.png" alt="Daun" width={160} height={160} className='w-auto h-auto' />
          </motion.div>
          <motion.div className='absolute z-10 -bottom-28 -left-10' {...sway}>
            <Image src="/bunga-3.png" alt="Daun" width={160} height={160} className='rotate-180 w-auto h-auto' />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Index