import React, { useState, useEffect } from 'react';
import { 
  Settings, Activity, Sparkles, Terminal, Copy, Check, ExternalLink, 
  Bot, ShieldAlert, Cpu, Network, Info, ArrowUpRight, HelpCircle, RefreshCw
} from 'lucide-react';

import { DEFAULT_SERVER_CONFIG, THEME_PALETTES, BANNER_PRESETS } from './defaultData';
import { ServerConfig, CommandItem } from './types';

// Child components we need
import BotCommandsSection from './components/BotCommandsSection';
import LegalModal from './components/LegalModal';

export default function App() {
  const [serverConfig, setServerConfig] = useState<ServerConfig>(DEFAULT_SERVER_CONFIG);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'commands'>('dashboard');

  // Legal Modal States
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<'terms' | 'privacy'>('terms');
  
  // Dedicated compliance URLs
  const [termsOfServiceUrl, setTermsOfServiceUrl] = useState<string>("https://36ef0d5b-7184-44a8-9f07-7ef348a8026b-00-3s4qhx0gfpmuk.sisko.replit.dev/terms");
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState<string>("https://36ef0d5b-7184-44a8-9f07-7ef348a8026b-00-3s4qhx0gfpmuk.sisko.replit.dev/privacy");
  
  // URL Standalone view listener
  const [urlView, setUrlView] = useState<'terms' | 'privacy' | null>(null);

  useEffect(() => {
    const checkUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const viewQuery = searchParams.get('view');
      const hash = window.location.hash;
      
      if (viewQuery === 'terms' || hash === '#/terms' || hash === '#terms') {
        setUrlView('terms');
      } else if (viewQuery === 'privacy' || hash === '#/privacy' || hash === '#privacy') {
        setUrlView('privacy');
      } else {
        setUrlView(null);
      }
    };
    
    checkUrl();
    window.addEventListener('popstate', checkUrl);
    window.addEventListener('hashchange', checkUrl);
    return () => {
      window.removeEventListener('popstate', checkUrl);
      window.removeEventListener('hashchange', checkUrl);
    };
  }, []);

  // Dynamic Bot Custom States
  const [botName, setBotName] = useState<string>("U-Bot");
  const [botStatus, setBotStatus] = useState<'online' | 'idle' | 'dnd' | 'offline'>('online');
  const [customPresence, setCustomPresence] = useState<string>("🤖 Type '!help' inside sandbox");
  
  const botAvatarUrl = "/ubot_logo_1780327177631.png";
  
  const [inviteUrl, setInviteUrl] = useState<string>(
    "https://discord.com/oauth2/authorize?client_id=1509885542966366319&scope=bot&permissions=8"
  );
  const [guildId, setGuildId] = useState<string>("631579758778613760");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | undefined>(undefined);

  // Synchronize initial default configs if loaded
  useEffect(() => {
    if (serverConfig.name && serverConfig.name !== "U-bot Community") {
      setBotName(serverConfig.name.replace(" Community", ""));
    }
  }, [serverConfig.name]);

  // Dynamic Ticking stats simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setServerConfig(prev => {
        const adjustment = Math.floor(Math.random() * 5) - 2;
        return {
          ...prev,
          onlineCount: Math.max(100, prev.onlineCount + adjustment),
          memberCount: prev.memberCount + (Math.random() > 0.9 ? 1 : 0)
        };
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const activeTheme = THEME_PALETTES[serverConfig.themeColor] || THEME_PALETTES.blurple;
  const activeBanner = BANNER_PRESETS.find(b => b.id === serverConfig.bannerPreset)?.url || BANNER_PRESETS[0].url;

  const handleApplyTheme = (paletteKey: string) => {
    setServerConfig(prev => ({
      ...prev,
      themeColor: paletteKey
    }));
    triggerToast(`🎨 Visual identity updated instantly to ${paletteKey.toUpperCase()}`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSyncRegistry = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    triggerToast("🔄 Contacting live gateway API to sync command definitions...");
    
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime(new Date());
      triggerToast(`✅ Synchronization complete! Loaded ${(serverConfig.commands || []).length} command hooks into discord virtual system.`);
    }, 1500);
  };

  const handleLaunchInvite = () => {
    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
    triggerToast("🔗 Connecting to Discord OAuth Authorize gateway with your credentials...");
  };

  if (urlView) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] text-[#EBEDEF] font-sans relative flex flex-col justify-between">
        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[480px] h-[480px] bg-[#5865F2] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[580px] h-[580px] bg-[#FF73FA] opacity-[0.03] rounded-full blur-[170px] pointer-events-none" />

        {/* Header banner */}
        <header className="px-6 md:px-12 py-5 border-b border-white/5 bg-[#0A0B0E]/85 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center shadow-lg border border-white/10 shrink-0 select-none">
              <img src={botAvatarUrl} alt="U-Bot Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-sm md:text-base tracking-wider text-white uppercase">{botName}</span>
              <span className="text-[9px] text-zinc-500 font-mono block tracking-tight">COMPLIANCE PORTAL</span>
            </div>
          </div>

          <button
            onClick={() => {
              window.history.pushState({}, '', window.location.pathname);
              setUrlView(null);
            }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-all cursor-pointer border border-white/10"
          >
            Go to Control Dashboard &rarr;
          </button>
        </header>

        {/* Content Box */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 z-10 select-text">
          <div className="bg-[#1A1C1F] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-5 border-b border-white/5">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-[#1E1F22] border border-white/10">
                  <Bot className="w-6 h-6 text-[#5865F2]" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                    {urlView === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                  </h1>
                  <p className="text-xs text-[#5865F2] font-mono mt-0.5">
                    Last Updated: June 14, 2026 &bull; {botName} automated bot
                  </p>
                </div>
              </div>
            </div>

            {urlView === 'terms' ? (
              <div className="text-xs md:text-sm text-zinc-300 leading-relaxed space-y-5 text-left">
                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">1. Acceptance of Terms</h3>
                <p>
                  By inviting <strong>{botName}</strong> to your Discord server or using any of its automated assistant command operations, you agree to be bound by these Terms of Service. If you do not agree, please remove the bot from your guild immediately.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">2. Description of Service</h3>
                <p>
                  <strong>{botName}</strong> is an automated Discord resident assistant designed to facilitate lightweight moderation, custom command execution, and interactive community features. You acknowledge that some features are provided with humorous intent ("lazy operations") and are subject to change.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">3. Acceptable Use</h3>
                <p>
                  You agree not to use the bot to spam commands, execute malicious automated requests, bypass standard platform restrictions, or deceive server members using incorrect bot administration credits.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">4. Limitation of Liability</h3>
                <p className="bg-[#111214] p-4 rounded-lg border border-white/5 text-zinc-400 border-l-2 border-l-amber-500 font-mono text-xs">
                  {botName.toUpperCase()} AND ITS PORTALS PROVIDE NO WARRANTY. THE ENTIRE RISK AS TO THE UPTIME, ACCURACY, AND PERFORMANCE OF THE BOT IS WITH YOU. IN NO EVENT SHALL THE CREATORS BE LIABLE FOR ANY DAMAGES ARISEN FROM BOT CRASHES OR API DELAYS.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">5. Termination</h3>
                <p>
                  The bot developers and system administrators reserve the right to restrict or ban specific server guilds or user IDs from using {botName} at any time, for any reason, without prior warning.
                </p>
              </div>
            ) : (
              <div className="text-xs md:text-sm text-zinc-300 leading-relaxed space-y-5 text-left">
                <p>
                  Thank you for using <strong>{botName}</strong>! This Privacy Policy explains what information {botName} collects, how it is used, and how it is protected.
                </p>
                <p>
                  By using <strong>{botName}</strong>, you agree to the collection and use of information in accordance with this policy.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">Information We Collect</h3>
                <p>
                  <strong>{botName}</strong> may collect and store the following information:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 font-mono text-xs">
                  <li>Discord User IDs</li>
                  <li>Discord Server IDs</li>
                  <li>Discord Channel IDs</li>
                  <li>Discord Role IDs</li>
                  <li>Command usage statistics & data</li>
                  <li>Moderation records (warnings, mutes, bans, and logs)</li>
                  <li>Configuration settings required for bot functionality</li>
                </ul>
                <p>
                  We do not collect passwords, payment details, or private messages unless explicitly required by a feature and permitted by Discord.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">How Information Is Used</h3>
                <p>
                  Collected information is used solely to provide bot functionality, store server settings, manage moderation systems, improve performance, and prevent abuse.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">Data Sharing</h3>
                <p>
                  We do not sell, rent, or share user data with third parties except when required by law.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">Data Retention</h3>
                <p>
                  Data is stored only as long as necessary for the operation of {botName}. Server administrators can request removal of server-specific logs or data by contacting the development group.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">Security</h3>
                <p>
                  Reasonable measures are taken to protect stored information. However, no internet-connected platform can guarantee absolute security.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">Changes to This Policy</h3>
                <p>
                  This Privacy Policy may be updated at any time. Continued use of the bot after modifications indicates acceptance of the revised policy.
                </p>

                <h3 className="text-base font-bold text-white border-b border-white/5 pb-1 mt-6">Contact</h3>
                <p>
                  For questions regarding this policy, please contact the {botName} development team through the official support server or write to <a href="mailto:vihaanudupa2@gmail.com" className="text-teal-400 hover:underline font-semibold">vihaanudupa2@gmail.com</a>.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="bg-[#0A0B0E] border-t border-white/5 py-6 px-6 text-center text-xs text-zinc-500 font-mono">
          &copy; 2026 {botName} &bull; All Rights Reserved. &bull; Developed by Vihaan Kumar Udupa
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#EBEDEF] font-sans overflow-x-hidden relative flex flex-col justify-between">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[480px] h-[480px] bg-[#5865F2] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[580px] h-[580px] bg-[#FF73FA] opacity-[0.03] rounded-full blur-[170px] pointer-events-none" />

      {/* Persistent Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1E1F22] border border-white/10 text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-2.5 animate-fadeIn text-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 bg-[#0A0B0E]/85 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center shadow-lg border border-white/10 shrink-0">
            <img 
              src={botAvatarUrl} 
              alt="U-Bot Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="font-extrabold text-sm md:text-base tracking-wider text-white uppercase select-none">
              {botName}
            </span>
            <span className="text-[9px] text-zinc-500 font-mono block tracking-tight">
              CONTROL CENTER &bull; BY VIHAAN KUMAR UDUPA
            </span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-1 bg-[#1E1F22]/70 border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#313338] text-white border border-white/5 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Bot Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              activeTab === 'commands'
                ? 'bg-[#313338] text-white border border-white/5 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Command Directory
          </button>
        </div>

        <button
          onClick={handleLaunchInvite}
          className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-extrabold px-4 py-2 rounded-full shadow-lg hover:scale-103 transition-all cursor-pointer"
        >
          Add Bot to Discord
        </button>
      </nav>

      {/* Main viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 z-10">
        
        {/* Tab 1: Interactive Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Config & Profile Grid split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Inline Customization Form (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                <div className="bg-[#1E1F22]/40 rounded-2xl border border-white/5 p-6 space-y-5">
                  
                  {/* Title */}
                  <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
                    <div className="p-2 rounded-xl bg-zinc-800 text-indigo-400 border border-white/5">
                      <Settings className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white uppercase tracking-wider">Bot Customization Panel</h2>
                      <p className="text-xs text-zinc-400">Modify U-bot parameters, branding colors, and presence state inline.</p>
                    </div>
                  </div>

                  {/* Section 1: Identity */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#5865F2] flex items-center gap-1.5">
                      <span>01.</span> General Branding
                    </h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Bot Name Tag</label>
                      <input
                        type="text"
                        value={botName}
                        onChange={(e) => setBotName(e.target.value)}
                        className="w-full bg-[#111214] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#5865F2] outline-none"
                      />
                    </div>
                  </div>

                  {/* Section 2: Online Status & Rich Presence */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#5865F2] flex items-center gap-1.5">
                      <span>02.</span> Presence & Rich Status
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Active presence state */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Indicator presence dot</label>
                        <div className="grid grid-cols-4 gap-2 bg-[#111214] p-1.5 rounded-xl border border-white/10 text-center">
                          {[
                            { id: 'online', label: 'Online', color: 'bg-emerald-500' },
                            { id: 'idle', label: 'Idle', color: 'bg-amber-500' },
                            { id: 'dnd', label: 'Do Not Disturb', color: 'bg-rose-500' },
                            { id: 'offline', label: 'Offline', color: 'bg-zinc-600' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setBotStatus(opt.id as any);
                                triggerToast(`⚡ Bot status set to ${opt.label.toUpperCase()}`);
                              }}
                              className={`py-1 rounded-lg text-[9px] font-bold cursor-pointer flex flex-col items-center gap-1 justify-center transition-all ${
                                botStatus === opt.id 
                                  ? 'bg-[#2B2D31] text-white border border-white/15 shadow' 
                                  : 'text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${opt.color}`} />
                              <span>{opt.id.toUpperCase()}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Custom Presence Message text</label>
                        <input
                          type="text"
                          value={customPresence}
                          onChange={(e) => setCustomPresence(e.target.value)}
                          placeholder="e.g., Playing in the backyard"
                          className="w-full bg-[#111214] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-600 focus:border-[#5865F2] outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Branding Palette Choice */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#5865F2]">
                      <span>03.</span> Visual Portal Palette Theme
                    </h3>

                    <div className="flex flex-wrap items-center gap-3">
                      {[
                        { key: 'blurple', color: 'bg-[#5865F2]', name: 'Blurple' },
                        { key: 'emerald', color: 'bg-emerald-500', name: 'Emerald' },
                        { key: 'ruby', color: 'bg-rose-500', name: 'Ruby' },
                        { key: 'amber', color: 'bg-amber-500', name: 'Amber' },
                        { key: 'cyan', color: 'bg-cyan-500', name: 'Cyan' },
                        { key: 'fuchsia', color: 'bg-fuchsia-500', name: 'Fuchsia' }
                      ].map(pal => (
                        <button
                          key={pal.key}
                          type="button"
                          onClick={() => handleApplyTheme(pal.key)}
                          className={`flex items-center gap-2 p-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
                            serverConfig.themeColor === pal.key 
                              ? 'border-white bg-white/10' 
                              : 'border-white/5 bg-transparent hover:bg-white/5'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${pal.color}`} />
                          <span className="text-xs text-zinc-300 font-semibold">{pal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
              
              {/* Right Side: Real-Time Discord Client Profile Mockup (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 px-1">REAL-TIME PROFILE PREVIEW</h3>
                  
                  {/* Card container */}
                  <div className="bg-[#18191C] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden text-left relative">
                    
                    {/* Header Banner Background */}
                    <div className="h-28 relative overflow-hidden">
                      <img 
                        src={activeBanner} 
                        alt="Portal overlay"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-40 filter brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#18191C] to-transparent/10" />
                    </div>

                    {/* Persona Avatar */}
                    <div className="px-5 -mt-10 relative">
                      <div className="relative inline-block">
                        <img 
                          src={botAvatarUrl} 
                          alt="Avatar portrait" 
                          className="w-20 h-20 rounded-full object-cover ring-4 ring-[#18191C]"
                        />
                        {/* Status marker */}
                        <span className={`absolute bottom-0 right-1.5 w-5 h-5 rounded-full ring-4 ring-[#18191C] flex items-center justify-center ${
                          botStatus === 'online' ? 'bg-emerald-500' :
                          botStatus === 'idle' ? 'bg-amber-500' :
                          botStatus === 'dnd' ? 'bg-rose-500' : 'bg-zinc-500'
                        }`} />
                      </div>
                    </div>

                    {/* Profile metrics panel */}
                    <div className="p-5 pt-3.5 space-y-4">
                      
                      {/* Name tags block */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-lg font-bold text-white tracking-wide">{botName}</h4>
                          <span className="bg-[#5865F2] text-white text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                            Bot
                          </span>
                          <span className="text-zinc-600 font-bold select-none text-xs">#0001</span>
                        </div>
                      </div>

                      {/* Custom Rich Presence widget */}
                      {customPresence && (
                        <div className="bg-[#2B2D31]/60 p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                          <span className="text-xs">🎮</span>
                          <span className="text-[11px] font-mono text-zinc-300 truncate">{customPresence}</span>
                        </div>
                      )}

                      {/* Divider line */}
                      <div className="h-[1px] bg-white/5" />

                      {/* Core stats metrics */}
                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Status State</span>
                          <span className="text-xs text-emerald-400 font-semibold font-mono tracking-wide mt-0.5 block flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                            <span>STANDBY</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">U-math calculations</span>
                          <span className="text-xs text-zinc-300 font-semibold font-mono mt-0.5 block">LAZY-RESOLVING ON</span>
                        </div>
                      </div>

                      {/* Primary Actions Area */}
                      <div className="space-y-2 pt-2.5">
                        <button
                          onClick={handleLaunchInvite}
                          className="w-full py-2.5 rounded-xl text-center bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold font-mono tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow hover:scale-101 duration-150"
                        >
                          <span>Invite {botName}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('commands');
                            triggerToast("🔮 Teleporting you to the active Command Directory!");
                          }}
                          className="w-full py-2.5 rounded-xl text-center bg-[#2B2D31] hover:bg-[#35383E] text-zinc-200 border border-white/5 text-xs font-bold tracking-wide cursor-pointer transition-all"
                        >
                          Explore Commands & Sandbox
                        </button>
                      </div>

                    </div>

                  </div>
                </div>

                {/* PUBLIC DISCORD LEGAL COMPLIANCE LINKS */}
                <div className="bg-[#1E1F22]/40 rounded-2xl border border-white/5 p-6 space-y-4 text-left">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Discord Developer Portal Links</h4>
                      <p className="text-[10px] text-zinc-400">Required URLs to paste into the Discord Application registration settings.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Terms Link */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">1. Terms of Service Live (Replit)</label>
                        <a 
                          href={termsOfServiceUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[9px] text-[#5865F2] hover:underline flex items-center gap-0.5 transition-colors"
                        >
                          <span>Open Live</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={termsOfServiceUrl}
                          onChange={(e) => setTermsOfServiceUrl(e.target.value)}
                          placeholder="https://replit-app.dev/terms"
                          className="flex-1 bg-[#111214] border border-white/5 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 font-mono focus:border-[#5865F2]/50 outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(termsOfServiceUrl);
                            triggerToast("📋 Copied Terms of Service Live URL!");
                          }}
                          className="p-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-white transition-colors cursor-pointer border border-white/10"
                        >
                          Copy
                        </button>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono tracking-tight block">
                        Backup embedded: <code className="text-zinc-400">{window.location.origin}{window.location.pathname}?view=terms</code>
                      </span>
                    </div>

                    {/* Privacy Link */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">2. Privacy Policy Live (Replit)</label>
                        <a 
                          href={privacyPolicyUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[9px] text-[#5865F2] hover:underline flex items-center gap-0.5 transition-colors"
                        >
                          <span>Open Live</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={privacyPolicyUrl}
                          onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                          placeholder="https://replit-app.dev/privacy"
                          className="flex-1 bg-[#111214] border border-white/5 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 font-mono focus:border-[#5865F2]/50 outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(privacyPolicyUrl);
                            triggerToast("📋 Copied Privacy Policy Live URL!");
                          }}
                          className="p-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-white transition-colors cursor-pointer border border-white/10"
                        >
                          Copy
                        </button>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono tracking-tight block">
                        Backup embedded: <code className="text-zinc-400">{window.location.origin}{window.location.pathname}?view=privacy</code>
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Custom Command Center Directory and Tester */}
        {activeTab === 'commands' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Elegant compact Status/Action bar */}
            <div className="bg-[#1E1F22]/30 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-spin' : 'bg-emerald-500 animate-pulse'} shrink-0`} />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                  <span className="text-xs font-black text-white uppercase tracking-wider">COMMAND GATEWAY ACTIVE</span>
                  <div className="h-3 w-[1px] bg-white/10 hidden sm:block" />
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {lastSyncedTime 
                      ? `Last synchronized: ${lastSyncedTime.toLocaleTimeString()}` 
                      : "Not synchronized yet in this session"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSyncRegistry}
                disabled={isSyncing}
                className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isSyncing
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 cursor-not-allowed'
                    : 'bg-[#5865F2] hover:bg-[#4752C4] border-[#5865F2] hover:border-[#4752C4] text-white hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isSyncing ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Syncing Registry...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Registry</span>
                  </>
                )}
              </button>
            </div>

            <BotCommandsSection
              commands={serverConfig.commands || []}
              onDeleteCommand={(id) => {
                setServerConfig(prev => ({
                  ...prev,
                  commands: (prev.commands || []).filter(c => c.id !== id)
                }));
                triggerToast(`🗑️ Deactivated and deleted command definition from database.`);
              }}
              themeColorData={{
                primary: activeTheme.primary,
                text: activeTheme.text,
                bgLight: activeTheme.bgLight
              }}
              botName={botName}
              botAvatar={botAvatarUrl}
            />
          </div>
        )}

      </main>

      {/* Footer statistics branding */}
      <footer className="bg-[#0A0B0E] border-t border-white/5 py-8 mt-12 px-6 md:px-12 z-20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 flex flex-wrap gap-10 md:gap-16">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white block">
              {serverConfig.memberCount.toLocaleString()}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">TOTAL USERS REACH</span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-black text-white block font-mono">
              {serverConfig.onlineCount.toLocaleString()}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping" />
              <span>ACTIVE NOW</span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-black text-white block">99.98%</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">MONITORING UPTIME</span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-extralight text-zinc-300 block tracking-tight font-light">{botName}</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">RESIDENT ASSISTANT</span>
          </div>

          <div className="flex flex-col border-l border-white/5 pl-6 md:pl-10">
            <span className="text-lg font-bold text-teal-400 block tracking-tight">Vihaan Kumar Udupa</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">CORE DEVELOPER</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500 font-mono">
          <a 
            href="?view=terms"
            onClick={(e) => { e.preventDefault(); setLegalTab('terms'); setIsLegalOpen(true); }}
            className="hover:text-white transition-colors cursor-pointer underline decoration-zinc-700 underline-offset-4"
          >
            Terms of Service
          </a>
          <span className="text-zinc-800">|</span>
          <a 
            href="?view=privacy"
            onClick={(e) => { e.preventDefault(); setLegalTab('privacy'); setIsLegalOpen(true); }}
            className="hover:text-white transition-colors cursor-pointer underline decoration-zinc-700 underline-offset-4"
          >
            Privacy Policy
          </a>
          <span className="text-zinc-800">|</span>
          <a 
            href={termsOfServiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 text-indigo-400/90 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Live Terms (Replit)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span className="text-zinc-800">|</span>
          <a 
            href={privacyPolicyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-400 text-indigo-400/90 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Live Privacy (Replit)</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
          <span className="text-zinc-800 hidden sm:inline">|</span>
          <div className="hidden sm:inline text-zinc-500 font-medium">
            DEVELOPED BY: <span className="text-teal-400 font-bold">VIHAAN KUMAR UDUPA</span>
          </div>
          <span className="text-zinc-800 hidden sm:inline">|</span>
          <div className="hidden sm:inline text-zinc-600">
            SYSTEM_CONNECTION: <code className="text-zinc-500">U-bot_Core_Established_0xF8</code>
          </div>
          <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-500">
            v2.1.0_PRO
          </span>
        </div>
      </footer>

      {/* Terms and Privacy Policy Legal Portal Dialog */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalTab}
        botName={botName}
        termsOfServiceUrl={termsOfServiceUrl}
        privacyPolicyUrl={privacyPolicyUrl}
        themeColorData={{
          primary: activeTheme.primary,
          text: activeTheme.text,
          bgLight: activeTheme.bgLight
        }}
      />

    </div>
  );
}
