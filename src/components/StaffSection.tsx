import React, { useState } from 'react';
import { Shield, Sparkles, UserPlus, MessageSquare, ExternalLink } from 'lucide-react';
import { StaffItem } from '../types';

interface StaffSectionProps {
  staff: StaffItem[];
  themeColorData: {
    primary: string;
    primaryHover: string;
    text: string;
    bgLight: string;
  };
  onDirectMessageClick: (username: string) => void;
}

export default function StaffSection({ staff, themeColorData, onDirectMessageClick }: StaffSectionProps) {
  const [selectedStaff, setSelectedStaff] = useState<StaffItem | null>(null);
  const [friendStatuses, setFriendStatuses] = useState<Record<string, 'add' | 'pending' | 'friends'>>({});

  const handleAddFriend = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFriendStatuses(prev => {
      const current = prev[id] || 'add';
      if (current === 'add') return { ...prev, [id]: 'pending' };
      if (current === 'pending') return { ...prev, [id]: 'friends' };
      return { ...prev, [id]: 'add' };
    });
  };

  const getStatusColor = (status: StaffItem['status']) => {
    switch (status) {
      case 'online': return 'bg-[#23A55A]';
      case 'idle': return 'bg-[#F0B232]';
      case 'dnd': return 'bg-[#F23F43]';
      case 'offline': return 'bg-[#80848E]';
      default: return 'bg-[#80848E]';
    }
  };

  const statusLabels = {
    online: 'Online',
    idle: 'Idle',
    dnd: 'Do Not Disturb',
    offline: 'Offline'
  };

  return (
    <div id="staff-card" className="bg-[#2B2D31] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 shadow-xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${themeColorData.bgLight} ${themeColorData.text}`}>
            <Shield className="w-5 h-5" id="staff-icon" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Staff Team & Leaders</h3>
            <p className="text-xs text-zinc-400">Reach out to our administrators and moderators for support.</p>
          </div>
        </div>
        <div className="text-xs text-zinc-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5 font-medium">
          {staff.filter(s => s.status !== 'offline').length} Active
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => {
          const friendStatus = friendStatuses[member.id] || 'add';
          
          return (
            <div
              key={member.id}
              onClick={() => setSelectedStaff(selectedStaff?.id === member.id ? null : member)}
              className={`bg-[#1E1F22]/40 hover:bg-[#313338]/50 border rounded-xl p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                selectedStaff?.id === member.id
                  ? 'border-white/20 bg-[#313338]/80 shadow-md ring-1 ring-white/10'
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="space-y-3.5">
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={member.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&q=80"}
                      alt={member.username}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <span
                      id={`status-dot-${member.id}`}
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#1E1F22] ${getStatusColor(member.status)}`}
                      title={statusLabels[member.status]}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-100 hover:text-white transition-colors text-sm truncate">
                        {member.username}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        #{member.discriminator}
                      </span>
                    </div>

                    {/* Role Badge */}
                    <span
                      className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        borderColor: `${member.roleColor}30`,
                        color: member.roleColor,
                        backgroundColor: `${member.roleColor}10`
                      }}
                    >
                      {member.roleName}
                    </span>
                  </div>
                </div>

                {/* Custom status message if exists */}
                {member.customStatus && (
                  <p className="text-[11px] text-zinc-400 bg-[#1E1F22]/70 p-2 rounded-lg italic border border-white/5 line-clamp-1">
                    "{member.customStatus}"
                  </p>
                )}
              </div>

              {/* Expandable Mini Discord Card Action Toolbar */}
              {selectedStaff?.id === member.id && (
                <div
                  className="mt-4 pt-3 border-t border-white/5 flex gap-2 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()} // Stop propagation from parent div click hook
                >
                  <button
                    onClick={(e) => handleAddFriend(member.id, e)}
                    className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                      friendStatus === 'friends'
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : friendStatus === 'pending'
                        ? 'bg-[#F0B232]/10 text-[#F0B232] border border-[#F0B232]/30'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>
                      {friendStatus === 'friends' ? 'Friends' : friendStatus === 'pending' ? 'Pending' : 'Add Friend'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onDirectMessageClick(member.username);
                      setSelectedStaff(null);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1.5 rounded-lg transition-all duration-200 text-white cursor-pointer ${themeColorData.primary} ${themeColorData.primaryHover}`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Send Buzz</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mini tip */}
      <div className="mx-6 mb-6 p-3 bg-[#1E1F22]/30 rounded-xl border border-white/5 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${themeColorData.text}`} />
          <span>Interactive Tip: Click on a staff node to view actions like adding friends or sending a message.</span>
        </div>
      </div>
    </div>
  );
}
