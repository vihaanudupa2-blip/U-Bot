import React, { useState } from 'react';
import { 
  Terminal, Check, Sparkles, Trash2, ShieldAlert, HelpCircle 
} from 'lucide-react';
import { CommandItem } from '../types';

interface BotCommandsSectionProps {
  commands: CommandItem[];
  themeColorData: {
    primary: string;
    text: string;
    bgLight: string;
  };
  botAvatar?: string;
  botName?: string;
  onDeleteCommand?: (id: string) => void;
}

export default function BotCommandsSection({ 
  commands = [], 
  themeColorData,
  botAvatar,
  botName = "U-bot",
  onDeleteCommand
}: BotCommandsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Moderation' | 'Utility' | 'Reaction Roles'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Moderation', 'Utility', 'Reaction Roles'] as const;

  const filteredCommands = commands.filter(cmd => {
    const matchesCategory = selectedCategory === 'All' ? true : cmd.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' ? true : (
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCategory && matchesSearch;
  });

  const handleCopyCommand = (cmdText: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(cmdText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full bg-[#1E1F22]/30 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Terminal className={`w-5.5 h-5.5 ${themeColorData.text}`} />
            Bot Command Index
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            Filter through registered triggers and copy syntax commands directly to your clipboard.
          </p>
        </div>

        {/* Search and filter bar */}
        <div className="space-y-4 pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search command or description..."
            className="w-full bg-[#111214] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#5865F2] transition-colors"
          />

          <div className="flex gap-1.5 bg-[#111214]/60 p-1 rounded-xl border border-white/5 max-w-full overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 text-center py-1.5 px-3 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#313338] text-white border border-white/5 shadow-md font-extrabold' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List cards area in dynamic grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommands.length === 0 ? (
          <div className="col-span-full bg-[#1E1F22]/20 border border-white/5 rounded-2xl p-12 text-center text-zinc-500 text-xs">
            No matching commands found.
          </div>
        ) : (
          filteredCommands.map(cmd => (
            <div 
              key={cmd.id}
              className="bg-[#1E1F22]/60 border border-white/5 rounded-xl hover:border-white/10 p-5 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5 flex items-center gap-1.5">
                    {cmd.category === 'Moderation' ? (
                      <ShieldAlert className="w-3 h-3 text-rose-400" />
                    ) : cmd.category === 'Reaction Roles' ? (
                      <Sparkles className="w-3 h-3 text-fuchsia-400" />
                    ) : (
                      <HelpCircle className="w-3 h-3 text-sky-400" />
                    )}
                    {cmd.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyCommand(cmd.command, cmd.id, e)}
                      className="p-1 px-2.5 rounded bg-black/30 hover:bg-black/60 text-[10px] text-zinc-400 hover:text-white border border-white/5 flex items-center gap-1 cursor-pointer transition-all"
                    >
                      {copiedId === cmd.id ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <span>Copy</span>
                      )}
                    </button>

                    {onDeleteCommand && (
                      <button
                        onClick={() => onDeleteCommand(cmd.id)}
                        className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/10 rounded transition-all cursor-pointer"
                        title="Delete Command"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CMD Box */}
                <div className="bg-[#111214] px-3.5 py-2 rounded-lg border border-white/5 font-mono">
                  <span className="text-sm font-bold text-teal-400 select-all">{cmd.command}</span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {cmd.description}
                </p>
              </div>

              {/* Command Usage Information */}
              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>Usage:</span>
                <span className="text-zinc-400 font-semibold select-all bg-black/20 px-2 py-0.5 rounded">{cmd.exampleInput}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
