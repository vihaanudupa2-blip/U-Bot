import React, { useState, useEffect, useRef } from 'react';
import { 
  Hash, Volume2, Send, Bot, Shield, Circle, CornerDownRight, 
  Sparkles, HelpCircle, AlertTriangle, Radio
} from 'lucide-react';
import { StaffItem, ServerConfig } from '../types';

interface Message {
  id: string;
  sender: string;
  avatar: string;
  roleColor: string;
  isBot: boolean;
  content: string;
  timestamp: string;
  isUbotError?: boolean;
}

interface DiscordChatProps {
  serverConfig: ServerConfig;
  themeColorData: {
    primary: string;
    text: string;
    bgLight: string;
    border: string;
  };
  connectedVoiceUsers: string[];
  setConnectedVoiceUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

const MOCK_CHANNEL_MESSAGES: Record<string, Message[]> = {
  'general-chat': [
    {
      id: 'gen-1',
      sender: 'Kev_The_Dev',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
      roleColor: '#3B82F6',
      isBot: false,
      content: "Has anyone tried compiling Node 23 on high-performance setups? Is type-stripping working smoothly?",
      timestamp: "Today at 10:12 AM"
    },
    {
      id: 'gen-2',
      sender: 'Aura',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
      roleColor: '#F472B6',
      isBot: false,
      content: "Pretty smooth! We just migrated our core server scripts. Check out the brand-new web portal btw!",
      timestamp: "Today at 10:14 AM"
    },
    {
      id: 'gen-3',
      sender: 'U-bot',
      avatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&q=80',
      roleColor: '#A5B4FC',
      isBot: true,
      content: "💤 (Automatic Alarm) Please stop speaking so fast. Processing your heavy English vocabulary is causing my CPU temperature to rise above 40°C. I am turning on water-cooling, please do not dial my number.",
      timestamp: "Today at 10:15 AM"
    },
    {
      id: 'gen-4',
      sender: 'PixelSam',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&q=80',
      roleColor: '#F59E0B',
      isBot: false,
      content: "Lmao U-bot goes offline at first sign of intellectual labor! Classic.",
      timestamp: "Today at 10:16 AM"
    }
  ],
  'welcome-rules': [
    {
      id: 'wel-1',
      sender: 'Mee6000',
      avatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&q=80',
      roleColor: '#10B981',
      isBot: true,
      content: "📥 **Welcome human!** We appreciate you visiting the official **U-bot Community**. Head over to #rules-accordion to understand our guidelines and avoid hitting the eject seat.",
      timestamp: "Yesterday at 3:30 PM"
    }
  ],
  'announcements': [
    {
      id: 'ann-1',
      sender: 'Aura',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
      roleColor: '#F472B6',
      isBot: false,
      content: "📢 **Hey Rebels!** We are hosting a 48-Hour Co-working Jam this weekend! See the Server Events list below and click **I'm Going** so we can secure customized participant role badges! 🚀🚀",
      timestamp: "Yesterday at 6:45 PM"
    }
  ],
  'bot-spam-ubot': [
    {
      id: 'bot-1',
      sender: 'U-bot',
      avatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&q=80',
      roleColor: '#A5B4FC',
      isBot: true,
      content: "💤 *Yawn...* Hello human. I am **U-bot**, the chief useless bot of this digital fortress. I am programmed to sleep, make weak jokes, and avoid physical or computing tasks. \n\nType **!help** to review my list of hardcoded offline operations, or say whatever you want to poke my *Gemini AI brain* (if configured)!",
      timestamp: "Today at 9:02 AM"
    }
  ]
};

export default function DiscordChat({ serverConfig, themeColorData, connectedVoiceUsers, setConnectedVoiceUsers }: DiscordChatProps) {
  const [activeChannel, setActiveChannel] = useState<string>('bot-spam-ubot');
  const [channelMessages, setChannelMessages] = useState<Record<string, Message[]>>(MOCK_CHANNEL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const [isVoiceJoined, setIsVoiceJoined] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when channel or messages change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages, activeChannel, isBotTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    const currentChannel = activeChannel;
    setInputText('');

    // Append user message
    const msgId = `msg-${Date.now()}`;
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageObj: Message = {
      id: msgId,
      sender: 'You (Rebel Guest)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80', // use creator default list
      roleColor: '#5865F2',
      isBot: false,
      content: userMsg,
      timestamp: `Today at ${formattedTime}`
    };

    setChannelMessages(prev => ({
      ...prev,
      [currentChannel]: [...(prev[currentChannel] || []), userMessageObj]
    }));

    // If active channel is 'bot-spam-ubot' or user typed inside general referring to ubot
    const isBotChannel = currentChannel === 'bot-spam-ubot';
    const mentionsBot = userMsg.toLowerCase().includes('u-bot') || userMsg.startsWith('!');

    if (isBotChannel || mentionsBot) {
      setIsBotTyping(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMsg })
        });
        
        const data = await response.json();
        
        // Wait at least 1s to simulate realistic server-side typing delay
        setTimeout(() => {
          setIsBotTyping(false);
          
          const botReplyObj: Message = {
            id: `ubot-${Date.now()}`,
            sender: 'U-bot',
            avatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&q=80',
            roleColor: '#A5B4FC',
            isBot: true,
            content: data.reply || "😴 Processing error... Even my glitch tracker fell asleep.",
            timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          };

          setChannelMessages(prev => ({
            ...prev,
            [currentChannel]: [...(prev[currentChannel] || []), botReplyObj]
          }));
        }, 1200);

      } catch (err: any) {
        setIsBotTyping(false);
        const errorReplyObj: Message = {
          id: `ubut-err-${Date.now()}`,
          sender: 'U-bot System Tracker',
          avatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&q=80',
          roleColor: '#EF4444',
          isBot: true,
          content: "❌ My connection line tripped! Or the fullstack server backend might be waking up after compile. Please try hitting Enter in 2 seconds again.",
          timestamp: "Just now",
          isUbotError: true
        };
        setChannelMessages(prev => ({
          ...prev,
          [currentChannel]: [...(prev[currentChannel] || []), errorReplyObj]
        }));
      }
    }
  };

  const toggleVoiceLounge = () => {
    setIsVoiceJoined(!isVoiceJoined);
    if (!isVoiceJoined) {
      setConnectedVoiceUsers(prev => [...prev, 'You (Rebel Guest)']);
    } else {
      setConnectedVoiceUsers(prev => prev.filter(u => u !== 'You (Rebel Guest)'));
    }
  };

  return (
    <div className="bg-[#1E1F22] rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex flex-col md:flex-row h-[550px] max-w-5xl mx-auto">
      
      {/* Channels Sidebar List */}
      <div className="w-full md:w-60 bg-[#2B2D31] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5">
        <div>
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <span className="font-bold text-sm tracking-tight text-white uppercase">{serverConfig.name}</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#23A55A]" title="Server Online status" />
              <span className="text-[10px] text-zinc-400 font-mono font-bold">LVL 3</span>
            </div>
          </div>

          {/* Text Channels List */}
          <div className="p-3 space-y-4">
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-1.5 flex items-center justify-between">
                <span>Text Channels</span>
                <HelpCircle className="w-3 h-3 text-zinc-500 hover:text-zinc-300 cursor-help" title="Click channel to switch chats" />
              </div>
              <div className="space-y-0.5">
                {[
                  { id: 'welcome-rules', label: 'welcome-and-rules' },
                  { id: 'announcements', label: 'announcements' },
                  { id: 'general-chat', label: 'general-chat' },
                  { id: 'bot-spam-ubot', label: 'bot-spam-ubot', isSpecial: true }
                ].map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-sm transition-all duration-200 cursor-pointer ${
                      activeChannel === ch.id 
                        ? 'bg-[#35373C] text-white font-semibold' 
                        : 'text-zinc-400 hover:bg-[#35373C]/50 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className={`w-4 h-4 shrink-0 ${ch.isSpecial ? themeColorData.text : 'text-zinc-500'}`} />
                      <span className="truncate">{ch.label}</span>
                    </div>
                    {ch.isSpecial && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1 rounded ${themeColorData.bgLight} ${themeColorData.text}`}>
                        U-bot
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Channel Simulator */}
            <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 mb-1.5">
                Voice Rooms
              </div>
              <button
                onClick={toggleVoiceLounge}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors duration-200 cursor-pointer ${
                  isVoiceJoined 
                    ? 'bg-[#5865F2]/20 text-[#5865F2] font-semibold border border-[#5865F2]/20' 
                    : 'text-zinc-400 hover:bg-[#35373C]/50 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Volume2 className={`w-4 h-4 shrink-0 ${isVoiceJoined ? 'text-[#5865F2]' : 'text-zinc-500'}`} />
                  <div>
                    <span className="block font-medium">🔊 Lofi Coffee Cabin</span>
                    <span className="text-[9px] text-zinc-500 block">Click to {isVoiceJoined ? 'disconnect' : 'simulate joining'}</span>
                  </div>
                </div>
                {connectedVoiceUsers.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#35373C] text-zinc-300 font-bold font-mono">
                    {connectedVoiceUsers.length}
                  </span>
                )}
              </button>

              {/* Connected Users List inside Voice Lounge */}
              {connectedVoiceUsers.length > 0 && (
                <div className="mt-2 pl-6 space-y-1.5 py-1.5 border-l border-white/5">
                  {connectedVoiceUsers.map((user, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-zinc-300 animate-fadeIn">
                      <div className="relative">
                        <img 
                          src={user === 'You (Rebel Guest)' 
                            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80'
                            : 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=50&q=80'
                          } 
                          alt="avatar" 
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#23A55A] rounded-full" />
                      </div>
                      <span className="truncate font-light">{user}</span>
                      {user.includes('U-bot') && <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 rounded scale-90">Bot</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Badge at Footer */}
        <div className="p-3 bg-[#232428] flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"
                alt="user avatar"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#5865F2] border-2 border-[#232428]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white leading-tight truncate">Rebel Guest</div>
              <div className="text-[10px] text-zinc-500">Guest account</div>
            </div>
          </div>
          <div className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono border border-white/5">
            MEMBER
          </div>
        </div>
      </div>

      {/* Main Chat Log Space */}
      <div className="flex-1 bg-[#313338] flex flex-col justify-between h-full relative">
        
        {/* Chat Title bar */}
        <div className="px-4 py-3 bg-[#313338] border-b border-white/5 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-zinc-400" />
            <h4 className="font-semibold text-white text-sm">
              {activeChannel === 'bot-spam-ubot' ? 'bot-spam-ubot' : activeChannel === 'welcome-rules' ? 'welcome-and-rules' : activeChannel === 'announcements' ? 'announcements' : 'general-chat'}
            </h4>
            <span className="text-xs text-zinc-400 hidden sm:inline">|</span>
            <span className="text-xs text-zinc-400 hidden sm:inline leading-none">
              {activeChannel === 'bot-spam-ubot' 
                ? 'Play or trigger goofy, useless tasks from U-bot' 
                : activeChannel === 'welcome-rules' 
                ? 'Intro log to avoid the high kick' 
                : 'Server announcements & highlights'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono py-0.5 px-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/25">
              U-bot Active Simulator
            </span>
          </div>
        </div>

        {/* Message Log scrollable field */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Top welcoming graphic */}
          <div className="pb-4 pt-1 mb-2 border-b border-white/5">
            <div className="w-12 h-12 bg-[#2B2D31] rounded-full flex items-center justify-center border border-white/10 mb-2">
              <Hash className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Welcome to #{activeChannel}!</h1>
            <p className="text-xs text-zinc-400">This is the absolute start of #{activeChannel} history channel.</p>
          </div>

          {/* Active logs */}
          {(channelMessages[activeChannel] || []).map((msg) => (
            <div key={msg.id} className="flex gap-3 hover:bg-[#2E3035]/20 p-1.5 -ml-1.5 rounded-lg transition-colors group">
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-white/5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span 
                    className="font-semibold text-sm cursor-pointer hover:underline text-white"
                    style={{ color: msg.roleColor }}
                  >
                    {msg.sender}
                  </span>
                  {msg.isBot && (
                    <span className="bg-[#5865F2] text-white text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase flex items-center gap-0.5">
                      <Bot className="w-2.5 h-2.5" /> Bot
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
                </div>
                <div className={`text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed ${msg.isUbotError ? 'text-rose-300' : ''}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Bot Typing Simulator Indicator */}
          {isBotTyping && (
            <div className="flex gap-3 p-1.5 -ml-1.5 rounded-lg">
              <img
                src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=80&q=80"
                alt="U-bot"
                className="w-10 h-10 rounded-full object-cover ring-1 ring-amber-500/10 opacity-70 animate-pulse"
              />
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold text-sm text-[#A5B4FC]">U-bot</span>
                  <span className="text-[10px] text-zinc-500">is thinking...</span>
                </div>
                <div className="flex items-center gap-1 bg-[#1E1F22] p-3 rounded-xl border border-white/5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Text Form footer */}
        <div className="px-4 pb-4">
          <form onSubmit={handleSendMessage} className="bg-[#383A40] rounded-xl overflow-hidden flex items-center pr-3 border border-white/5 focus-within:border-white/10 transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeChannel === 'bot-spam-ubot' 
                  ? "Talk to U-bot: !help, !ping, !joke, or just shout!" 
                  : `Message #${activeChannel}`
              }
              className="flex-1 bg-transparent px-4 py-3.5 text-slate-100 placeholder-zinc-500 text-sm focus:outline-none min-w-0"
            />
            <button
              type="submit"
              className={`p-2 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all cursor-pointer shadow ${
                !inputText.trim() ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              disabled={!inputText.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick command helpers list under bot channel */}
          {activeChannel === 'bot-spam-ubot' && (
            <div className="mt-1.5 flex flex-wrap gap-1.5 justify-start text-[10px] text-zinc-500">
              <span className="font-medium mr-1 select-none">Quick:</span>
              {['!help', '!ping', '!flip', '!joke', '!uptime'].map(cmd => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => setInputText(cmd)}
                  className="px-2 py-0.5 rounded bg-[#2B2D31] hover:bg-[#35373C] text-zinc-400 border border-white/5 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
