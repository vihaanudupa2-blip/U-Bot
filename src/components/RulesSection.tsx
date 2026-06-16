import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ShieldAlert, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import { RuleItem } from '../types';

interface RulesSectionProps {
  rules: RuleItem[];
  themeColorData: {
    primary: string;
    primaryHover: string;
    text: string;
    bgLight: string;
  };
}

export default function RulesSection({ rules, themeColorData }: RulesSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div id="portal-rules-card" className="bg-[#2B2D31] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 shadow-xl">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${themeColorData.bgLight} ${themeColorData.text}`}>
            <Scale className="w-5 h-5" id="rules-icon" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-tight">Server Rules</h3>
            <p className="text-xs text-zinc-400">Our code of conduct that keeps things safe and friendly.</p>
          </div>
        </div>
        <div className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 font-medium border border-white/5">
          {rules.length} Rules Defined
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        {rules.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No rules set up yet. Add some rules in the Customizer!
          </div>
        ) : (
          rules.map((rule, idx) => {
            const isExpanded = expandedId === rule.id;
            return (
              <div
                key={rule.id}
                id={`rule-item-${rule.id}`}
                className={`border rounded-xl transition-all duration-200 cursor-pointer ${
                  isExpanded
                    ? 'bg-[#313338] border-white/10 shadow-lg'
                    : 'bg-[#2B2D31]/40 border-white/5 hover:bg-[#313338]/60 hover:border-white/10'
                }`}
                onClick={() => toggleExpand(rule.id)}
              >
                <div className="p-4 flex items-start gap-3.5 justify-between select-none">
                  <div className="flex items-start gap-3">
                    <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded-lg ${themeColorData.bgLight} ${themeColorData.text} mt-0.5`}>
                      #{rule.number || idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-semibold text-zinc-100 hover:text-white transition-colors duration-150">
                        {rule.title}
                      </h4>
                      {!isExpanded && (
                        <p className="text-xs text-zinc-400 line-clamp-1 max-w-[500px]">
                          {rule.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                    aria-label={isExpanded ? "Collapse rule" : "Expand rule"}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 border-t border-white/5 text-xs text-zinc-300 leading-relaxed pl-[42px]">
                        <p className="bg-[#1E1F22]/40 p-3 rounded-lg border border-white/5 text-zinc-300">
                          {rule.description}
                        </p>
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-500">
                          <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Violating this rule can result in server warnings, timeout, or kicks.</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
