import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Scale, X, FileText, Check, Copy, ExternalLink } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy';
  botName?: string;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;
  themeColorData: {
    primary: string;
    text: string;
    bgLight: string;
  };
}

export default function LegalModal({
  isOpen,
  onClose,
  defaultTab = 'terms',
  botName = "U-bot",
  termsOfServiceUrl = "https://36ef0d5b-7184-44a8-9f07-7ef348a8026b-00-3s4qhx0gfpmuk.sisko.replit.dev/terms",
  privacyPolicyUrl = "https://36ef0d5b-7184-44a8-9f07-7ef348a8026b-00-3s4qhx0gfpmuk.sisko.replit.dev/privacy",
  themeColorData
}: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(defaultTab);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(title);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const termsOfServiceText = `TERMS OF SERVICE FOR ${botName.toUpperCase()}
Last Updated: June 14, 2026

1. Acceptance of Terms
By inviting ${botName} to your Discord server or using any of its automated assistant command operations, you agree to be bound by these Terms of Service. If you do not agree, please remove the bot from your guild immediately.

2. Description of Service
${botName} is an automated Discord resident assistant designed to facilitate lightweight moderation, custom command execution, and interactive community features. You acknowledge that some features are provided with humorous intent ("lazy operations") and are subject to change.

3. Acceptable Use
You agree not to use ${botName} to:
- Spam bot command invocations or artificially flood discord channels.
- Attempt to exploit or reverse engineer the bot's custom backend systems.
- Use the bot for malicious moderation activities or to distribute harmful content.
- Impersonate official bot development staff.

4. Limitation of Liability
${botName} AND ITS LANDING PORTAL GIVES NO WARRANTY OF ANY KIND. THE ENTIRE RISK AS TO THE UPTIME, ACCURACY, AND PERFORMANCE OF THE BOT IS WITH YOU. SPECIFIC CODES OR LAZY/SLEEPY RESPONSES ARE EXEMPT FROM PROTOCOL CRITICISM. IN NO EVENT SHALL THE CREATORS BE LIABLE FOR ANY DAMAGES ARISEN FROM BOT CRASHES OR API DELAYS.

5. Termination
The bot administrators reserve the right to restrict or ban specific Discord guilds, servers, or user IDs from using ${botName} at any time, for any reason, without prior notice.`;

  const privacyPolicyText = `PRIVACY POLICY FOR ${botName.toUpperCase()}
Last Updated: June 14, 2026

Introduction
Thank you for using ${botName}. This Privacy Policy explains what information ${botName} collects, how it is used, and how it is protected.

By using ${botName}, you agree to the collection and use of information in accordance with this policy.

Information We Collect
${botName} may collect and store the following information:
- Discord User IDs
- Discord Server IDs
- Discord Channel IDs
- Discord Role IDs
- Command usage data
- Moderation records (warnings, mutes, bans, and logs)
- Configuration settings required for bot functionality

${botName} does not collect passwords, payment information, or private messages unless explicitly required by a feature and permitted by Discord.

How Information Is Used
Collected information is used solely to:
- Provide bot functionality
- Store server settings
- Manage moderation systems
- Improve performance and reliability
- Prevent abuse and misuse

Data Sharing
${botName} does not sell, rent, or share user data with third parties except when required by law.

Data Retention
Data is stored only as long as necessary for the operation of ${botName}. Server administrators may request removal of server-specific data when applicable.

Security
Reasonable measures are taken to protect stored information. However, no system can guarantee absolute security.

Changes to This Policy
This Privacy Policy may be updated at any time. Continued use of ${botName} after updates constitutes acceptance of the revised policy.

Contact
For questions regarding this Privacy Policy, please contact the ${botName} development team through the official support server or vihaanudupa2@gmail.com`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-[#1A1C1F] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="bg-[#111214] border-b border-white/5 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-[#1E1F22] border border-white/10`}>
                  {activeTab === 'terms' ? (
                    <Scale className={`w-5 h-5 ${themeColorData.text}`} />
                  ) : (
                    <ShieldCheck className={`w-5 h-5 ${themeColorData.text}`} />
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                    {activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                  </h2>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    Legal agreements for the {botName} resident bot integration
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Switch Tabs */}
            <div className="bg-[#1E1F22] px-5 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'terms'
                      ? 'bg-zinc-800 text-white border border-white/5 shadow-inner'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Terms of Service</span>
                </button>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'privacy'
                      ? 'bg-zinc-800 text-white border border-white/5 shadow-inner'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Privacy Policy</span>
                </button>
              </div>

              <button
                onClick={() => handleCopy(
                  activeTab === 'terms' ? termsOfServiceText : privacyPolicyText,
                  activeTab
                )}
                className="px-2.5 py-1 rounded bg-black/30 hover:bg-black/60 border border-white/5 text-[10px] text-zinc-400 hover:text-white font-mono flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {copiedText === activeTab ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>

            {/* Scrollable Doc Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[50vh] custom-scrollbar text-zinc-300">
              {activeTab === 'terms' ? (
                <div className="font-sans text-xs leading-relaxed space-y-4 select-text text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>U-Bot Terms of Service Document</span>
                  </div>

                  <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-2 text-left">
                    <div>
                      <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Official Hosted Document</h4>
                      <p className="text-[10px] text-zinc-400">This Terms of Service document is officially hosted on Replit.</p>
                    </div>
                    <a
                      href={termsOfServiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <span>Visit Live Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">1. Acceptance of Terms</h3>
                  <p>
                    By inviting <strong>{botName}</strong> to your Discord server or utilizing any of its simulated or interactive assistant operations, you represent that you have read, understood, and agreed to be legally bound by these Terms of Service. If you disagree, please remove the bot from your guild parameters immediately.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">2. Description of Service</h3>
                  <p>
                    <strong>{botName}</strong> is an simulated Discord resident bot assistant designed to showcase lightweight interactive server mockups, customized automated command registrations, and offline simulation logs. You acknowledge that certain triggers are provided with deliberate humorous or sluggish characteristics ("lazy operations") and may fluctuate in behavior.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">3. Acceptable Use Guideline</h3>
                  <p>
                    You agree strictly to avoid spamming the assistant's trigger hooks, deploying malicious scripts, brute-forcing simulated terminals, or misleading other community members with fraudulent representation of official bot status.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">4. Limitation of Liability</h3>
                  <p className="bg-[#111214] p-3 rounded-lg border border-white/5 text-zinc-400 border-l-2 border-l-amber-500">
                    <strong>THE AS-IS WARRANTY:</strong> {botName} AND ITS PORTALS PROVIDE NO EXPRESSED OR IMPLIED WARRANTIES. THE ENTIRE RISK RELATED TO PERFORMANCE AND COMPATIBILITY LIES SOLELY WITH THE BOT RECIPIENTS. SYSTEM SLUMBERS, INTERACTIVE SHUTDOWNS, AND TIME-OUTS ARE COMPLETELY EXEMPT FROM DISCIPLINARY CRITICISM.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">5. Governing Authority & Termination</h3>
                  <p>
                    The administrators of the {botName} Community reserve unilateral authority to limit, cancel, or suspend any users, servers, or custom hooks without prior notice.
                  </p>
                </div>
              ) : (
                <div className="font-sans text-xs leading-relaxed space-y-4 select-text text-left">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>U-Bot Privacy Protection Policy</span>
                  </div>

                  <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 my-2 text-left">
                    <div>
                      <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">Official Hosted Document</h4>
                      <p className="text-[10px] text-zinc-400">This Privacy Policy is officially hosted on Replit.</p>
                    </div>
                    <a
                      href={privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <span>Visit Live Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <p>
                    Thank you for using <strong>{botName}</strong>. This Privacy Policy explains what information <strong>{botName}</strong> collects, how it is used, and how it is protected.
                  </p>
                  <p>
                    By using <strong>{botName}</strong>, you agree to the collection and use of information in accordance with this policy.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">Information We Collect</h3>
                  <p>
                    <strong>{botName}</strong> may collect and store the following information:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 font-mono text-[11px]">
                    <li>Discord User IDs</li>
                    <li>Discord Server IDs</li>
                    <li>Discord Channel IDs</li>
                    <li>Discord Role IDs</li>
                    <li>Command usage data</li>
                    <li>Moderation records (warnings, mutes, bans, and logs)</li>
                    <li>Configuration settings required for bot functionality</li>
                  </ul>
                  <p>
                    <strong>{botName}</strong> does not collect passwords, payment information, or private messages unless explicitly required by a feature and permitted by Discord.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">How Information Is Used</h3>
                  <p>
                    Collected information is used solely to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-zinc-400 font-mono text-[11px]">
                    <li>Provide bot functionality</li>
                    <li>Store server settings</li>
                    <li>Manage moderation systems</li>
                    <li>Improve performance and reliability</li>
                    <li>Prevent abuse and misuse</li>
                  </ul>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">Data Sharing</h3>
                  <p>
                    <strong>{botName}</strong> does not sell, rent, or share user data with third parties except when required by law.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">Data Retention</h3>
                  <p>
                    Data is stored only as long as necessary for the operation of <strong>{botName}</strong>. Server administrators may request removal of server-specific data when applicable.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">Security</h3>
                  <p>
                    Reasonable measures are taken to protect stored information. However, no system can guarantee absolute security.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">Changes to This Policy</h3>
                  <p>
                    This Privacy Policy may be updated at any time. Continued use of <strong>{botName}</strong> after updates constitutes acceptance of the revised policy.
                  </p>

                  <h3 className="text-sm font-bold text-white mt-4 border-b border-white/5 pb-1">Contact</h3>
                  <p>
                    For questions regarding this Privacy Policy, please contact the <strong>{botName}</strong> development team through the official support server or <a href="mailto:vihaanudupa2@gmail.com" className="text-teal-400 hover:underline">vihaanudupa2@gmail.com</a>.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#111214] border-t border-white/5 p-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
