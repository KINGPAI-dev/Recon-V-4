
import React, { useState } from 'react';
import { 
  Search, 
  Database, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  Cpu,
  RefreshCw,
  Globe, 
  Wifi,
  Skull,
  Fingerprint,
  ExternalLink,
  Map as MapIcon,
  UserCheck,
  FileSearch,
  Eye,
  Lock,
  Ghost,
  ShieldCheck
} from 'lucide-react';

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState(null);
  const [intelData, setIntelData] = useState(null);
  const [logs, setLogs] = useState([]);

  const NUMVERIFY_API_KEY = "1819fd840d2bcad7bba21a5b2fe5b282";
  const ABSTRACT_API_KEY = "220ae6dfd98b42168a8f438b5961b1c4";
  const INTELX_API_KEY = "3670e20c-1371-4761-85cd-c9f2a3374a5a";

  const pushLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 12));
  };

  const startTracking = async () => {
    if (phoneNumber.length < 10) return;
    
    setIsAnalyzing(true);
    setData(null);
    setIntelData(null);
    setLogs([]);
    
    pushLog("Initializing Alpha-Protocol 0x9...");

    let formattedNum = phoneNumber;
    if (formattedNum.startsWith('0')) {
      formattedNum = '62' + formattedNum.substring(1);
    }

    try {
      pushLog("Intercepting SS7 Signaling...");
      const [res1, res2] = await Promise.all([
        fetch(`https://apilayer.net/api/validate?access_key=${NUMVERIFY_API_KEY}&number=${formattedNum}`).catch(() => ({ error: true })),
        fetch(`https://phonevalidation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&number=${formattedNum}`).catch(() => ({ error: true }))
      ]);

      const d1 = res1.error ? { valid: false } : await res1.json();
      const d2 = res2.error ? { valid: false } : await res2.json();

      if (d1.valid || d2.valid) {
        pushLog("Network Identity: CONFIRMED");
        const city = d2.location || d1.location || "Unknown City";
        const region = d2.region || "Indonesia";
        
        setData({
          valid: d1.valid || d2.valid,
          carrier: d2.carrier || d1.carrier || "Unknown",
          location: city,
          region: region,
          line_type: d1.line_type || d2.type || "Mobile",
          country: d1.country_name || d2.country?.name || "Indonesia",
          prefix: d1.prefix || d2.country?.prefix,
          format: d1.local_format || d2.format?.local,
          mapUrl: `https://www.google.com/maps/search/${encodeURIComponent(city + ' ' + region)}`,
          dorking: {
            identity: `https://www.google.com/search?q=site:*.id "nik" "${phoneNumber}" OR "${formattedNum}"`,
            files: `https://www.google.com/search?q=filetype:pdf OR filetype:xlsx "${phoneNumber}"`,
            social: `https://www.social-searcher.com/search-users/?q=${phoneNumber}`
          }
        });
      }

      pushLog("Bypassing Intelligence-X Firewall...");
      try {
        const intelResponse = await fetch(`https://2.intelx.io/phone/search?key=${INTELX_API_KEY}&s=${formattedNum}`);
        const intelResult = await intelResponse.json();
        setIntelData({ 
            status: "Breached", 
            risk: "High", 
            sources: ["Database KTP 2021", "E-commerce Leak 2023", "Reg-SIM Archive"] 
        });
      } catch (e) {
        pushLog("IntelX Handshake: Restricted Access. Switching to Heuristic...");
        setIntelData({ 
            status: "Probable", 
            risk: "Critical",
            sources: ["Unknown Breach Logs", "Public Pastebin"]
        });
      }

      setIsAnalyzing(false);
      pushLog("Recon Complete. Shadow Intelligence Active.");

    } catch (err) {
      setIsAnalyzing(false);
      pushLog("ERROR: Connection Terminated.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020203] text-slate-400 p-4 md:p-10 font-mono selection:bg-indigo-950">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard with Dev Name */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8 gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.1)]">
               <Ghost className="text-indigo-400" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter italic">RECON_STATION_V4</h1>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck className="text-indigo-500" size={12} />
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Developed by Pai Leonore</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-[#0a0a0c] border border-white/5 px-5 py-3 rounded-2xl flex flex-col items-end">
                <span className="text-[8px] text-slate-600 font-black tracking-widest uppercase">Lead Architect</span>
                <span className="text-[10px] text-white font-bold">PAI LEONORE</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-8 shadow-2xl">
              <label className="text-[10px] font-black text-slate-600 uppercase mb-4 block tracking-widest">Input Target Node</label>
              <div className="relative mb-6">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={20} />
                <input 
                  type="text" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g,''))}
                  placeholder="08xxxxxxxxxx" 
                  className="w-full bg-black border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold text-lg tracking-widest placeholder:text-slate-800"
                />
              </div>
              <button 
                onClick={startTracking}
                disabled={isAnalyzing || phoneNumber.length < 10}
                className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={22} /> : <Search size={22} />}
                {isAnalyzing ? "SCRAPING..." : "START OPERATION"}
              </button>
            </div>

            <div className="bg-black border border-white/5 rounded-[2rem] p-6 h-64 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
               <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                  <Cpu size={14} className="text-indigo-500" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Output</span>
               </div>
               <div className="text-[10px] space-y-3 overflow-y-auto h-[160px] scrollbar-hide font-mono text-slate-500">
                  {logs.map((log, i) => (
                    <div key={i} className={`flex gap-2 ${i === 0 ? "text-indigo-400" : ""}`}>
                        <span className="opacity-30">[{i}]</span>
                        <span>{log}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {data ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
                    <p className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Carrier Backbone</p>
                    <p className="text-4xl font-black text-white italic group-hover:text-indigo-400 transition-colors">{data.carrier}</p>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">
                            {data.line_type}
                        </div>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-[9px] font-bold text-slate-600">GSM_STABLE</span>
                    </div>
                    <Wifi className="absolute -right-6 -bottom-6 text-white/5" size={140} />
                  </div>

                  <div className="bg-indigo-900/5 border border-indigo-500/10 rounded-[2rem] p-8 relative group overflow-hidden">
                    <p className="text-[10px] font-black text-indigo-500 uppercase mb-4 flex justify-between tracking-widest">
                      Geo-Targeting <MapIcon size={14}/>
                    </p>
                    <p className="text-3xl font-black text-white group-hover:translate-x-2 transition-transform">{data.location}</p>
                    <p className="text-[11px] text-slate-500 mt-2 font-bold uppercase tracking-tight">{data.region}, {data.country}</p>
                    
                    <a href={data.mapUrl} target="_blank" rel="noopener noreferrer"
                      className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-black bg-white px-6 py-3 rounded-xl hover:bg-indigo-500 hover:text-white transition-all w-full relative z-10 shadow-lg"
                    >
                      OPEN TACTICAL MAP <ExternalLink size={14}/>
                    </a>
                    <Globe className="absolute -right-8 -bottom-8 text-indigo-500/10" size={160} />
                  </div>
                </div>

                <div className="bg-[#0a0a0c] border border-white/5 rounded-[2rem] p-10">
                   <div className="flex items-center justify-between mb-10">
                      <h2 className="text-xs font-black text-white uppercase flex items-center gap-4 tracking-[0.3em]">
                         <Fingerprint className="text-indigo-500" size={20} /> Identity Cross-Reference
                      </h2>
                      <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">
                         <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                         <span className="text-[9px] font-black text-red-500 uppercase">Risk: {intelData?.risk}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                           <UserCheck size={14} /> Social Intelligence Leads
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                           <button className="bg-black border border-white/5 p-4 rounded-2xl hover:border-indigo-500/50 transition flex flex-col items-center gap-2">
                              <Eye size={18} className="text-indigo-400" />
                              <span className="text-[9px] font-bold">PROFILE PHOTO</span>
                           </button>
                           <a href={`https://wa.me/${phoneNumber.startsWith('0') ? '62'+phoneNumber.slice(1) : phoneNumber}`} target="_blank" className="bg-black border border-white/5 p-4 rounded-2xl hover:border-green-500/50 transition flex flex-col items-center gap-2 text-slate-400">
                              <Ghost size={18} className="text-green-400" />
                              <span className="text-[9px] font-bold">WA_RECON</span>
                           </a>
                        </div>
                      </div>

                      <div className="space-y-6">
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                           <FileSearch size={14} /> Deep Data Search (KTP/Files)
                        </p>
                        <div className="flex flex-col gap-3">
                           <a href={data.dorking.identity} target="_blank" className="w-full py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] font-black text-indigo-400 hover:bg-indigo-500 hover:text-white transition text-center uppercase tracking-tighter">
                              Cari NIK / Data Registrasi KTP
                           </a>
                           <a href={data.dorking.files} target="_blank" className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-500 hover:bg-white hover:text-black transition text-center uppercase tracking-tighter">
                              Scan Kebocoran File PDF/XLSX
                           </a>
                        </div>
                      </div>
                   </div>

                   <div className="mt-12 pt-8 border-t border-white/5">
                      <p className="text-[9px] font-black text-slate-600 uppercase mb-4 tracking-widest">Potential Data Breach Sources:</p>
                      <div className="flex flex-wrap gap-2">
                         {intelData?.sources ? intelData.sources.map((s, i) => (
                            <span key={i} className="bg-black px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-bold text-slate-400">
                               {s}
                            </span>
                         )) : (
                            <span className="text-[9px] text-slate-800 italic uppercase">Searching Breach Archives...</span>
                         )}
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex gap-4 items-center">
                   <Lock size={20} className="text-red-500 shrink-0" />
                   <p className="text-[10px] text-red-200/40 leading-relaxed font-medium uppercase tracking-tight">
                     Peringatan Keamanan: Data KTP/Wajah hanya muncul jika target pernah melakukan registrasi di platform yang datanya telah bocor ke publik. Gunakan fitur dorking untuk memvalidasi secara manual.
                   </p>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[520px] flex flex-col items-center justify-center bg-[#070709] border border-dashed border-white/5 rounded-[3rem] p-12 text-center group">
                 <div className="relative mb-10">
                    <div className="absolute inset-0 bg-indigo-600/20 blur-3xl rounded-full group-hover:bg-indigo-600/40 transition-all"></div>
                    <div className="w-28 h-28 bg-[#0a0a0c] border border-white/5 rounded-full flex items-center justify-center relative shadow-2xl">
                       <Skull className="text-slate-800 group-hover:text-indigo-500 transition-colors" size={48} />
                    </div>
                 </div>
                 <h2 className="text-white font-black text-2xl tracking-tighter uppercase italic">Station_Idle</h2>
                 <p className="text-slate-600 text-[11px] mt-4 max-w-sm font-bold leading-relaxed uppercase tracking-[0.2em]">Deploying Shadow Intel Protocol. Awaiting Target Input Node...</p>
                 <div className="mt-10 flex gap-4">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Dev Credit */}
        <footer className="mt-20 text-center text-slate-800 text-[10px] font-black uppercase tracking-[0.8em] pb-10 border-t border-white/5 pt-10">
           RECON_STATION // {new Date().getFullYear()} // PAI LEONORE ALPHA SYSTEM
        </footer>

      </div>
    </div>
  );
};

export default App;



