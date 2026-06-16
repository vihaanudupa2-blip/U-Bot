import React, { useState } from 'react';
import { 
  Settings, Type, Palette, Image as ImageIcon, Users, List, Plus, Trash2, Save, LogOut 
} from 'lucide-react';
import { ServerConfig, RuleItem, EventItem } from '../types';
import { THEME_PALETTES, BANNER_PRESETS } from '../defaultData';

interface CustomizerPanelProps {
  config: ServerConfig;
  onUpdateConfig: (newConfig: ServerConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizerPanel({ config, onUpdateConfig, isOpen, onClose }: CustomizerPanelProps) {
  const [activeTab, setActiveTabTab] = useState<'basics' | 'styling' | 'rules' | 'events' | 'commands'>('basics');
  
  // Local state form buffers to prevent lag while typing
  const [name, setName] = useState(config.name);
  const [tagline, setTagline] = useState(config.tagline);
  const [description, setDescription] = useState(config.description);
  const [memberCount, setMemberCount] = useState(config.memberCount);
  const [onlineCount, setOnlineCount] = useState(config.onlineCount);
  const [inviteLink, setInviteLink] = useState(config.inviteLink);
  const [discordGuildId, setDiscordGuildId] = useState(config.discordGuildId || '');

  // Buffer state to add new rule
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');

  // Buffer state to add new event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLoc, setNewEventLoc] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  // Buffer state to add new bot command
  const [newCmdTrigger, setNewCmdTrigger] = useState('');
  const [newCmdDesc, setNewCmdDesc] = useState('');
  const [newCmdCategory, setNewCmdCategory] = useState<'Moderation' | 'Utility' | 'Reaction Roles'>('Moderation');
  const [newCmdExample, setNewCmdExample] = useState('');
  const [newCmdResponseType, setNewCmdResponseType] = useState<'embed' | 'text'>('text');
  const [newCmdResponseText, setNewCmdResponseText] = useState('');
  const [newCmdEmbedTitle, setNewCmdEmbedTitle] = useState('');

  if (!isOpen) return null;

  const handleSaveBasics = () => {
    onUpdateConfig({
      ...config,
      name,
      tagline,
      description,
      memberCount: Number(memberCount),
      onlineCount: Number(onlineCount),
      inviteLink,
      discordGuildId,
    });
  };

  const handleUpdateThemePreset = (preset: ServerConfig['themeColor']) => {
    onUpdateConfig({
      ...config,
      themeColor: preset
    });
  };

  const handleUpdateBannerPreset = (bannerPresetId: string) => {
    onUpdateConfig({
      ...config,
      bannerPreset: bannerPresetId
    });
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleDesc.trim()) return;

    const nextNumber = config.rules.length + 1;
    const newRule: RuleItem = {
      id: `rule-custom-${Date.now()}`,
      number: nextNumber,
      title: newRuleTitle.trim(),
      description: newRuleDesc.trim()
    };

    onUpdateConfig({
      ...config,
      rules: [...config.rules, newRule]
    });

    setNewRuleTitle('');
    setNewRuleDesc('');
  };

  const handleDeleteRule = (id: string) => {
    const remaining = config.rules.filter(r => r.id !== id);
    // Re-index remaining rules
    const reindexed = remaining.map((r, i) => ({ ...r, number: i + 1 }));

    onUpdateConfig({
      ...config,
      rules: reindexed
    });
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDesc.trim()) return;

    const newEvent: EventItem = {
      id: `event-custom-${Date.now()}`,
      title: newEventTitle.trim(),
      date: newEventDate.trim() || "TBA Date",
      time: newEventTime.trim() || "TBA Time",
      location: newEventLoc.trim() || "Discord Lounge VoIP",
      description: newEventDesc.trim(),
      attendeeCount: Math.floor(Math.random() * 20) + 5
    };

    onUpdateConfig({
      ...config,
      events: [...config.events, newEvent]
    });

    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventLoc('');
    setNewEventDesc('');
  };

  const handleDeleteEvent = (id: string) => {
    onUpdateConfig({
      ...config,
      events: config.events.filter(ev => ev.id !== id)
    });
  };

  const handleAddCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCmdTrigger.trim() || !newCmdDesc.trim()) return;

    const newCmd: any = {
      id: `cmd-custom-${Date.now()}`,
      command: newCmdTrigger.trim(),
      description: newCmdDesc.trim(),
      category: newCmdCategory,
      exampleInput: newCmdExample.trim() || newCmdTrigger.trim(),
      responseType: newCmdResponseType,
      responseText: newCmdResponseType === 'text' ? (newCmdResponseText.trim() || `Command Executed successfully: ${newCmdTrigger}`) : undefined,
      embedTitle: newCmdResponseType === 'embed' ? (newCmdEmbedTitle.trim() || '⚠️ Bot Signal Logged') : undefined,
      embedColor: newCmdResponseType === 'embed' ? '#5865F2' : undefined,
      embedFields: newCmdResponseType === 'embed' ? [
        { label: "Command Prompt", value: newCmdTrigger.trim() },
        { label: "Fulfillment Log", value: "Simulated Web Core" },
        { label: "Action Description", value: newCmdDesc.trim() }
      ] : undefined
    };

    onUpdateConfig({
      ...config,
      commands: [...(config.commands || []), newCmd]
    });

    setNewCmdTrigger('');
    setNewCmdDesc('');
    setNewCmdExample('');
    setNewCmdResponseText('');
    setNewCmdEmbedTitle('');
  };

  const handleDeleteCommand = (id: string) => {
    onUpdateConfig({
      ...config,
      commands: (config.commands || []).filter(c => c.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end transition-opacity duration-300">
      
      {/* Backdrop tap zone */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Drawer Body Container */}
      <div className="w-full max-w-lg bg-[#2B2D31] text-[#EBEDEF] h-full flex flex-col border-l border-white/5 shadow-2xl relative animate-slideLeft">
        
        {/* Title bar */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#5865F2]/10 text-[#5865F2]">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Portal Web Customizer</h2>
              <p className="text-xs text-zinc-400">Tweak landing pages, staff, and events live.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors cursor-pointer"
          >
            Collapse Panel
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 bg-[#1E1F22]/20 text-xs font-semibold select-none">
          {[
            { id: 'basics', label: 'Identity', icon: Type },
            { id: 'styling', label: 'Theme & Banner', icon: Palette },
            { id: 'rules', label: 'Rules List', icon: List },
            { id: 'events', label: 'Events List', icon: Users },
            { id: 'commands', label: 'Bot Commands', icon: Settings }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTabTab(t.id as any)}
              className={`flex-1 py-3 text-center transition-all duration-200 border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === t.id 
                  ? 'border-[#5865F2] text-white bg-[#2B2D31]/40' 
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Form elements Scroll Space */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Identity Basics Section */}
          {activeTab === 'basics' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-[#1E1F22]/30 p-4 rounded-xl border border-white/5 text-xs text-zinc-400">
                Configure your server's public identity. Clicking <strong>Save Changes</strong> updates the titles, taglines, and descriptions throughout the landing pages.
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Server Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Tagline Slogan</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Server Description (About us)</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Member Base Count</label>
                  <input
                    type="number"
                    value={memberCount}
                    onChange={(e) => setMemberCount(Number(e.target.value))}
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Online Base Count</label>
                  <input
                    type="number"
                    value={onlineCount}
                    onChange={(e) => setOnlineCount(Number(e.target.value))}
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <label className="text-xs text-[#5865F2] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  📁 Discord Auth/Invite URL
                </label>
                <input
                  type="text"
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                  placeholder="e.g. https://discord.com/oauth2/authorize..."
                  className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block leading-tight">
                  This connects your landing page invite buttons (e.g., Accepting Invite) to your U-bot Discord Bot.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#5865F2] font-bold uppercase tracking-wider">
                  🛰️ Discord Guild/Server ID
                </label>
                <input
                  type="text"
                  value={discordGuildId}
                  onChange={(e) => setDiscordGuildId(e.target.value)}
                  placeholder="Insert 18-digit ID..."
                  className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <span className="text-[10px] text-zinc-500 block leading-tight">
                  Connects the widget on the dashboard tab to your Discord widgets. Set this to display your live channels and active users.
                </span>
              </div>

              <button
                type="button"
                onClick={handleSaveBasics}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 self-end tracking-wider uppercase shadow cursor-pointer transition-colors mt-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Basic Identity</span>
              </button>
            </div>
          )}

          {/* Theme Colors and Banner section */}
          {activeTab === 'styling' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Theme Color selectors */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>Interactive Brand Colors</span>
                </h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Select a distinctive color profile for indicators, text triggers, and customized cards:
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {(Object.keys(THEME_PALETTES) as Array<ServerConfig['themeColor']>).map((themeKey) => {
                    const preset = THEME_PALETTES[themeKey];
                    const isSelected = config.themeColor === themeKey;
                    return (
                      <button
                        key={themeKey}
                        onClick={() => handleUpdateThemePreset(themeKey)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'border-white/20 bg-[#313338] ring-1 ring-white/10' 
                            : 'border-white/5 bg-[#1E1F22]/20 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`w-3 h-3 rounded-full ${preset.primary}`} />
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                            {themeKey}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Banner Presets selector */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>Welcome Hero Banner Presets</span>
                </h3>
                <div className="space-y-2 mt-2">
                  {BANNER_PRESETS.map((bp) => {
                    const isSelected = config.bannerPreset === bp.id;
                    return (
                      <button
                        key={bp.id}
                        onClick={() => handleUpdateBannerPreset(bp.id)}
                        className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer overflow-hidden relative ${
                          isSelected 
                            ? 'border-white/30 bg-[#313338] font-semibold' 
                            : 'border-white/5 bg-[#1E1F22]/20 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 z-10">
                          <img 
                            src={bp.url} 
                            alt={bp.name} 
                            className="w-12 h-8 rounded-lg object-cover ring-1 ring-white/10"
                          />
                          <span className="text-xs text-white">{bp.name}</span>
                        </div>
                        {isSelected && (
                          <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full z-10 uppercase tracking-widest font-extrabold scale-90">
                            Active
                          </span>
                        )}
                        <span className="absolute right-0 bottom-0 top-0 left-1/2 bg-gradient-to-l from-black/50 to-transparent pointer-events-none" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Manage Rules List */}
          {activeTab === 'rules' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Existing Rules List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Rules Accordion Checklist</h4>
                
                {config.rules.length === 0 ? (
                  <div className="text-center p-4 text-xs text-zinc-500 bg-[#1E1F22]/20 rounded-xl border border-dashed border-white/5">
                    No rules recorded yet. Create some below!
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    {config.rules.map((rule) => (
                      <div key={rule.id} className="flex items-start justify-between p-2.5 bg-[#1E1F22]/40 rounded-lg border border-white/5 text-xs">
                        <div className="max-w-[320px] min-w-0 pr-2">
                          <span className="font-bold text-[#5865F2] mr-1.5 font-mono">#{rule.number}</span>
                          <span className="font-semibold text-white">{rule.title}</span>
                          <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{rule.description}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1 rounded bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition-all text-zinc-500 shrink-0 cursor-pointer"
                          title="Delete this rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Rule Form */}
              <form onSubmit={handleAddRule} className="p-4 rounded-xl bg-[#1E1F22]/50 border border-white/5 space-y-3.5">
                <span className="text-xs text-white font-bold block border-b border-white/5 pb-1.5">Add Custom Rule</span>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Rule Title</label>
                  <input
                    type="text"
                    value={newRuleTitle}
                    onChange={(e) => setNewRuleTitle(e.target.value)}
                    placeholder="e.g., No spoiler tags outside tech"
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Rule Description</label>
                  <textarea
                    rows={2}
                    value={newRuleDesc}
                    onChange={(e) => setNewRuleDesc(e.target.value)}
                    placeholder="Detailed explanation of the bounds..."
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-light"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newRuleTitle.trim() || !newRuleDesc.trim()}
                  className="w-full py-1.5 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Rule Node</span>
                </button>
              </form>
            </div>
          )}

          {/* Manage Events List */}
          {activeTab === 'events' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Existing Events List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Active Calendar List</h4>
                
                {config.events.length === 0 ? (
                  <div className="text-center p-4 text-xs text-zinc-500 bg-[#1E1F22]/20 rounded-xl border border-dashed border-white/5">
                    No scheduled community events recorded. Add some below!
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {config.events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-2.5 bg-[#1E1F22]/40 rounded-lg border border-white/5 text-xs">
                        <div className="truncate pr-2">
                          <span className="font-semibold text-white block truncate">{event.title}</span>
                          <span className="text-[9px] text-zinc-500">{event.date} at {event.time}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 rounded bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition-all text-zinc-500 cursor-pointer"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Event Form */}
              <form onSubmit={handleAddEvent} className="p-4 rounded-xl bg-[#1E1F22]/50 border border-white/5 space-y-3 pb-4">
                <span className="text-xs text-white font-bold block border-b border-white/5 pb-1.5">Add Live Event</span>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Event Title</label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g., RPG Night & D&D Session"
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none="
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Date / Recurrence</label>
                    <input
                      type="text"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      placeholder="e.g., Saturday June 20th"
                      className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Time Scale</label>
                    <input
                      type="text"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      placeholder="e.g., 19:00 UTC"
                      className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Location Voip / Channel</label>
                  <input
                    type="text"
                    value={newEventLoc}
                    onChange={(e) => setNewEventLoc(e.target.value)}
                    placeholder="e.g., 🔊 Lofi Coffee Cabin"
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Short Slogan / Scope description</label>
                  <textarea
                    rows={2}
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    placeholder="Brief agenda of the event..."
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white font-light"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newEventTitle.trim() || !newEventDesc.trim()}
                  className="w-full py-1.5 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Live Calendar Slot</span>
                </button>
              </form>
            </div>
          )}

          {/* Bot Commands Management Section */}
          {activeTab === 'commands' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#1E1F22]/30 p-4 rounded-xl border border-white/5 text-xs text-zinc-400">
                Manage your Discord resident assistant (e.g. U-bot) commands here. These appear inside the commands explorer and are simulated on execution.
              </div>

              {/* Current commands list */}
              <div className="space-y-2.5">
                <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider block">Active Commands ({(config.commands || []).length})</label>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {(config.commands || []).map((cmd) => (
                    <div key={cmd.id} className="flex items-center justify-between bg-[#1E1F22] p-2.5 rounded-lg border border-white/5">
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-1.5">
                          <code className="text-xs text-teal-400 font-bold font-mono truncate">{cmd.command}</code>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-zinc-400 border border-white/5">{cmd.category}</span>
                        </div>
                        <span className="block text-[10px] text-zinc-500 truncate leading-tight mt-0.5">{cmd.description}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCommand(cmd.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(config.commands || []).length === 0 && (
                    <div className="text-xs text-zinc-500 text-center py-4 bg-[#1E1F22]/20 border border-dashed border-white/5 rounded-lg">
                      No custom commands found. Create one below!
                    </div>
                  )}
                </div>
              </div>

              {/* New Command form */}
              <form onSubmit={handleAddCommand} className="space-y-3.5 border-t border-white/5 pt-5">
                <div className="text-xs font-bold text-[#5865F2] uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Custom Command</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Trigger Keyword</label>
                    <input
                      type="text"
                      value={newCmdTrigger}
                      onChange={(e) => setNewCmdTrigger(e.target.value)}
                      placeholder="e.g., !uptime"
                      required
                      className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold uppercase">Topic Classification</label>
                    <select
                      value={newCmdCategory}
                      onChange={(e) => setNewCmdCategory(e.target.value as any)}
                      className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="Moderation">Moderation</option>
                      <option value="Utility">Utility</option>
                      <option value="Reaction Roles">Reaction Roles</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Action description</label>
                  <input
                    type="text"
                    value={newCmdDesc}
                    onChange={(e) => setNewCmdDesc(e.target.value)}
                    placeholder="e.g., Query total system runtime..."
                    required
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase">Example Command Input</label>
                  <input
                    type="text"
                    value={newCmdExample}
                    onChange={(e) => setNewCmdExample(e.target.value)}
                    placeholder="e.g., !uptime"
                    className="w-full bg-[#1E1F22] border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 font-mono"
                  />
                </div>

                <div className="space-y-1 bg-[#1E1F22]/20 p-2.5 rounded-lg border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Simulated Response Format</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewCmdResponseType('text')}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${newCmdResponseType === 'text' ? 'bg-[#5865F2] text-white' : 'bg-white/5 text-zinc-400'}`}
                      >
                        TEXT
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewCmdResponseType('embed')}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${newCmdResponseType === 'embed' ? 'bg-[#5865F2] text-white' : 'bg-white/5 text-zinc-400'}`}
                      >
                        EMBED
                      </button>
                    </div>
                  </div>

                  {newCmdResponseType === 'text' ? (
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 font-bold uppercase block">Simulated Bot Reply Message</label>
                      <textarea
                        rows={2}
                        value={newCmdResponseText}
                        onChange={(e) => setNewCmdResponseText(e.target.value)}
                        placeholder="e.g., U-bot has been online for 3 hours."
                        className="w-full bg-[#1E1F22] border border-white/5 rounded px-2 py-1 text-xs text-white font-mono placeholder-zinc-600"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-zinc-500 font-bold uppercase block">Embed Card Header Title</label>
                      <input
                        type="text"
                        value={newCmdEmbedTitle}
                        onChange={(e) => setNewCmdEmbedTitle(e.target.value)}
                        placeholder="e.g., 🚀 U-bot System Specs"
                        className="w-full bg-[#1E1F22] border border-white/5 rounded px-2 py-1 text-xs text-white font-mono placeholder-zinc-600"
                      />
                      <span className="text-[9px] text-zinc-500 block leading-tight">
                        Embed fields are auto-generated from your description and keywords for visual clarity.
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!newCmdTrigger.trim() || !newCmdDesc.trim()}
                  className="w-full py-1.5 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Append Custom Bot Command</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-[#232428] border-t border-white/5 text-[10px] text-zinc-500 select-none text-center">
          Handshake ID: <code>{config.themeColor.toUpperCase()}_LIVE_COORDINATE</code> — Click off or hit Collapse to close.
        </div>
      </div>
    </div>
  );
}
