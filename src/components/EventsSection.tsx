import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Users, Check, Flame } from 'lucide-react';
import { EventItem } from '../types';

interface EventsSectionProps {
  events: EventItem[];
  themeColorData: {
    primary: string;
    primaryHover: string;
    text: string;
    bgLight: string;
  };
}

export default function EventsSection({ events, themeColorData }: EventsSectionProps) {
  const [joinedEventIds, setJoinedEventIds] = useState<Record<string, boolean>>({});

  const toggleRSVP = (eventId: string) => {
    setJoinedEventIds(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <div id="events-card" className="bg-[#2B2D31] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 shadow-xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${themeColorData.bgLight} ${themeColorData.text}`}>
            <Calendar className="w-5 h-5" id="events-icon" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Active Server Events</h3>
            <p className="text-xs text-zinc-400">Join our scheduled multiplayer and educational gatherings.</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse">
          <Flame className="w-3.5 h-3.5" />
          <span>Happening This Month</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {events.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm bg-[#1E1F22]/20 rounded-xl border border-dashed border-white/5">
            No upcoming events planned structure yet. Check back later or add events in Customizer!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => {
              const hasJoined = joinedEventIds[event.id] || false;
              const displayAttendees = event.attendeeCount + (hasJoined ? 1 : 0);

              return (
                <div
                  key={event.id}
                  id={`event-${event.id}`}
                  className="bg-[#1E1F22]/50 border border-white/5 hover:border-white/10 rounded-xl p-5 flex flex-col justify-between hover:bg-[#313338]/40 transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-white text-base group-hover:text-zinc-100 transition-colors">
                        {event.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 py-1 px-2 rounded-lg bg-white/5">
                        scheduled
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>

                    <div className="pt-2 space-y-2 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-zinc-400">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 flex items-center justify-between gap-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="font-medium text-zinc-300">{displayAttendees} attending</span>
                    </div>

                    <button
                      onClick={() => toggleRSVP(event.id)}
                      className={`relative overflow-hidden text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        hasJoined
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : `${themeColorData.primary} ${themeColorData.primaryHover} text-white`
                      }`}
                    >
                      {hasJoined ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Joined!</span>
                        </>
                      ) : (
                        <span>I'm Going</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
