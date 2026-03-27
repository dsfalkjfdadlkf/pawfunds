import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, HandHeart, Home, Stethoscope,
  Menu, X, Check, Copy, Activity
} from 'lucide-react';
import ShinyText from './components/ShinyText';
import BorderGlow from './components/BorderGlow';

// Crypto Card Component to handle individual expansion state
function CryptoCard({ crypto, onCopy, copiedAddress }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(crypto.networks ? crypto.networks[0] : null);
  const isCopied = copiedAddress === (currentNetwork ? currentNetwork.address : crypto.address);

  const displayAddress = currentNetwork ? currentNetwork.address : crypto.address;
  const displayLabel = currentNetwork ? currentNetwork.label : `Scan to send ${crypto.symbol}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <BorderGlow
        backgroundColor="#060010"
        colors={['#c084fc', '#f472b6', '#38bdf8']}
        className="w-full"
      >
        <div className="p-5 sm:p-6 flex flex-col gap-3 bg-black/40 rounded-[27px] transition-all duration-300 w-full h-full overflow-hidden group">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 flex items-center justify-center overflow-hidden p-2 shrink-0 border border-white/10 group-hover:border-white/20 transition-colors">
                <motion.img
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  src={crypto.icon}
                  alt={crypto.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-bold text-base leading-tight truncate">{crypto.name}</h4>
                <span className="text-slate-400 text-xs font-medium line-clamp-1">{crypto.subtitle || crypto.symbol}</span>
              </div>
            </div>
            <button
              className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all duration-300 border border-white/10 shrink-0 ml-3 active:scale-95"
            >
              {isOpen ? 'Hide' : 'Show'}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-1 border-t border-white/10 flex flex-col gap-3">

                  {crypto.networks && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-slate-500 shrink-0">Network</label>
                      <div className="relative">
                        <select
                          className="w-full appearance-none bg-white/5 border border-white/10 text-white text-xs font-medium rounded-xl px-3 py-2.5 pr-10 focus:outline-none focus:border-pink-500/50 transition-colors"
                          value={currentNetwork.id}
                          onChange={(e) => setCurrentNetwork(crypto.networks.find((n: any) => n.id === e.target.value))}
                        >
                          {crypto.networks.map((net: any) => (
                            <option key={net.id} value={net.id} className="bg-[#110e18] text-white">{net.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-pink-500/50">
                          <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="bg-black/60 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-slate-400 break-all text-center leading-relaxed">
                      {displayAddress}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopy(displayAddress);
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 border backdrop-blur-md ${isCopied ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                    >
                      {isCopied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Address</>}
                    </motion.button>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex justify-center mt-1"
                  >
                    <div className="bg-white/90 border border-white/20 p-2.5 rounded-2xl flex flex-col items-center gap-1.5 shadow-xl shrink-0">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${displayAddress}`}
                        alt="QR Code"
                        className="w-[110px] h-[110px] rounded-lg"
                        loading="lazy"
                      />
                      <span className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-tight">{displayLabel}</span>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BorderGlow>
    </motion.div>
  );
}

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'donate'>('home');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#donate') {
        setView('donate');
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const cryptoOptions = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      subtitle: 'BTC — Multiple networks available',
      icon: 'https://i.postimg.cc/NMS3w0xJ/1200px-Bitcoin.png',
      networks: [
        { id: 'legacy', name: 'BTC Legacy', address: '167HX6GAhSsfv4rVSohxVFgikaUiN8411t', label: 'Scan to send BTC (Legacy)' },
        { id: 'segwit', name: 'BTC SegWit (Native)', address: 'bc1qdcn4v4utm2ma5dk29azqu4m5gjvn3mygq3es42', label: 'Scan to send BTC (SegWit)' },
        { id: 'bsc', name: 'BSC (Wrapped BTC)', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send BTC (BSC)' },
      ]
    },
    {
      name: 'Ethereum / EVM',
      symbol: 'ETH',
      subtitle: 'ETH · BSC · BASE · OPTIMISM — same address',
      icon: 'https://i.postimg.cc/zBVsMhTs/250px-Ethereum-icon-purple.png',
      networks: [
        { id: 'eth', name: 'Ethereum (ETH)', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send on ETH' },
        { id: 'bsc', name: 'BNB Smart Chain (BSC)', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send on BSC' },
        { id: 'base', name: 'Base', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send on Base' },
        { id: 'optimism', name: 'Optimism', address: '0x8d5a019be6d548384483c0eed479e62ba0a28015', label: 'Scan to send on Optimism' },
      ]
    },
    { name: 'Tether', symbol: 'USDT', subtitle: 'TRC20 — Tron Network', address: 'TKoQwvUxjxGQMv6VGvVp9RsEsbiemYX4mM', icon: 'https://i.postimg.cc/fyvX60fP/image.png' },
    { name: 'Solana', symbol: 'SOL', subtitle: 'SOL — Solana Network', address: 'Gmv3yf3HFHFsNJC6E5T3tFHYzCKKdCMkR9QHMMjTEvzo', icon: 'https://i.postimg.cc/Tw6Kf31M/image.png' },
    { name: 'Litecoin', symbol: 'LTC', subtitle: 'LTC — Litecoin Network', address: 'LcGy7NBaceSTAEVr1aL1e4EFrf8MwM6JgW', icon: 'https://i.postimg.cc/g0wZVJQc/ltc_Photoroom.png' },
  ];

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-200 font-sans selection:bg-pink-500/30 flex flex-col overflow-x-hidden">
      {/* Simple gradient background */}
      <div className="fixed inset-0 z-0 bg-[#060010]">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* Pill Navbar */}
      <nav className="fixed top-5 sm:top-7 left-1/2 -translate-x-1/2 z-50 px-4 w-full flex justify-center">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "circOut" }}
          className="flex items-center justify-between px-5 sm:px-6 py-2.5 rounded-full bg-[#0c0a14]/85 border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-auto max-w-[480px]"
        >
          <a href="#" className="flex items-center gap-2.5 text-white font-medium text-sm">
            <img src="https://i.postimg.cc/t4vcKsrg/cat.png" alt="Logo" className="w-5 h-5 object-cover rounded-full" />
            <ShinyText text="pawfunds" speed={3} className="font-bold tracking-tight text-[15px]" />
          </a>

          <div className="hidden sm:flex items-center gap-6 ml-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            <a href="#" className="hover:text-white transition-colors duration-200">Home</a>
            <a href="#donate" className="hover:text-white transition-colors duration-200">Donate</a>
          </div>

          <button
            className="sm:hidden text-white ml-4"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-24 px-6 bg-[#060010]/95 backdrop-blur-2xl sm:hidden"
          >
            <div className="flex flex-col gap-3">
              <a href="#" onClick={() => setIsNavOpen(false)} className="glass-panel p-4 text-center text-white font-medium rounded-2xl">Home</a>
              <a href="#donate" onClick={() => setIsNavOpen(false)} className="glass-panel p-4 text-center text-white font-medium rounded-2xl">Donate</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-32 sm:pt-36 pb-16 sm:pb-20 px-5 sm:px-8 max-w-[1100px] mx-auto flex-1 w-full">

        {view === 'home' ? (
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="flex flex-col gap-20 sm:gap-28"
          >
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center gap-10 sm:gap-12 min-h-[50vh] py-8">
              <div className="space-y-6 sm:space-y-8">
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-md"
                >
                  <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-500 animate-pulse" />
                  100% Transparent Cat Welfare
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight leading-[1.2]"
                >
                  <ShinyText
                    text="pawfunds"
                    speed={3}
                    color="#ffffff"
                    shineColor="#f472b6"
                    className="italic pr-4"
                  />
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed"
                >
                  Support our mission to rescue and care for stray cats. Every donation makes a difference.
                </motion.p>
              </div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
              >
                <a href="#donate" className="w-full sm:w-[170px] py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.15)] active:scale-[0.97] text-center flex items-center justify-center gap-2 group">
                  <HandHeart className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
                  Donate
                </a>
                <a href="https://www.tiktok.com/@azenithx" target="_blank" rel="noreferrer" className="w-full sm:w-[170px] py-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white font-bold text-sm hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-xl flex items-center justify-center gap-2 active:scale-[0.97] group">
                  <div className="bg-black/40 p-1.5 rounded-full flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors">
                    <img src="https://i.postimg.cc/7Zw7qbTM/image.png" className="w-3 h-3 object-contain invert opacity-80 group-hover:opacity-100 transition-opacity" alt="TikTok" />
                  </div>
                  TikTok
                </a>
              </motion.div>
            </section>

            {/* Categories Section */}
            <motion.section
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="max-w-[800px] mx-auto w-full"
            >
              <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mb-3">Where Your Donation Goes</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto">Every cent is transparently allocated to these essential care categories.</p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <motion.div variants={itemVariants}>
                  <div className="p-6 sm:p-7 w-full h-full flex flex-col justify-center gap-3.5 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-white/[0.12] shadow-lg transition-all duration-300 group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover:border-pink-500/40 transition-colors">
                      <HandHeart className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Litter &amp; Bedding</h3>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Clean litter boxes, comfortable sleeping supplies for cats.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="p-6 sm:p-7 w-full h-full flex flex-col justify-center gap-3.5 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-white/[0.12] shadow-lg transition-all duration-300 group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 group-hover:border-sky-500/40 transition-colors">
                      <Heart className="w-5 h-5 text-sky-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Food &amp; Nutrition</h3>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Daily nutritious meals, kitten formula, and specialized diet</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="p-6 sm:p-7 w-full h-full flex flex-col justify-center gap-3.5 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-white/[0.12] shadow-lg transition-all duration-300 group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/40 transition-colors">
                      <Home className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Shelter</h3>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Temporary rescue enclosures, insulated winter crates, and safe housing setups.</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="p-6 sm:p-7 w-full h-full flex flex-col justify-center gap-3.5 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/[0.06] hover:border-white/[0.12] shadow-lg transition-all duration-300 group">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                      <Stethoscope className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Medical Care</h3>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">Veterinary checkups, vaccines, and emergency treatments only when cats are sick.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          </motion.div>
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 sm:space-y-12 w-full max-w-[860px] mx-auto py-6 sm:py-10"
          >
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Make a Donation</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">Select your preferred cryptocurrency network to reveal the wallet address.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-start">
              {cryptoOptions.map((crypto) => (
                <CryptoCard key={crypto.symbol} crypto={crypto} onCopy={handleCopy} copiedAddress={copiedAddress} />
              ))}
            </div>
          </motion.section>
        )}

      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-black/50 backdrop-blur-xl mt-auto">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <img src="https://i.postimg.cc/t4vcKsrg/cat.png" alt="Logo" className="w-4 h-4 object-cover rounded-full" />
            pawfunds
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">© 2026 pawfunds. All rights reserved.</p>
          <a href="https://www.tiktok.com/@azenithx" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <div className="bg-black/40 p-1 rounded-full border border-white/5">
              <img src="https://i.postimg.cc/7Zw7qbTM/image.png" className="w-3 h-3 object-contain invert opacity-60 hover:opacity-100 transition-opacity" alt="TikTok" />
            </div>
            TikTok
          </a>
        </div>
      </footer>
    </div>
  );
}
