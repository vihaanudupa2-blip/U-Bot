import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini client on the server
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function run() {
  const app = express();
  app.use(express.json());

  // Static API: live member count, mock server details
  let activeMembersCount = 3840;
  let activeOnlineCount = 1242;

  // Let's create a simulated live tracker that fluctuates slightly
  setInterval(() => {
    const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
    activeOnlineCount = Math.max(100, activeOnlineCount + change);
    if (Math.random() > 0.85) {
      activeMembersCount += Math.floor(Math.random() * 2);
    }
  }, 4000);

  app.get('/api/server-info', (req, res) => {
    res.json({
      memberCount: activeMembersCount,
      onlineCount: activeOnlineCount,
    });
  });

  // Proxy endpoint for live Discord Server status widget
  app.get('/api/discord-status', async (req, res) => {
    const { guildId } = req.query;
    if (!guildId) {
      return res.status(400).json({ error: 'guildId query parameter is required' });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6-second timeout

      const discordRes = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!discordRes.ok) {
        if (discordRes.status === 403) {
          return res.json({
            online: false,
            error: 'Widget is disabled on this Discord server. Please ask the owner to go to Discord Server Settings -> Widget, and toggle "Enable Server Widget" on.'
          });
        }
        if (discordRes.status === 404) {
          return res.json({
            online: false,
            error: 'Discord Server (Guild ID) not found. Please double-check the ID or verify that the widget is configured correctly.'
          });
        }
        return res.json({
          online: false,
          error: `Failed to fetch status from Discord (HTTP status: ${discordRes.status})`
        });
      }

      const data = await discordRes.json();
      return res.json({
        online: true,
        name: data.name || 'Discord Guild',
        instantInvite: data.instant_invite || null,
        onlineCount: data.presence_count || 0,
        members: (data.members || []).map((m: any) => ({
          username: m.username,
          avatarUrl: m.avatar_url,
          status: m.status,
          game: m.game ? m.game.name : undefined
        })),
        channels: (data.channels || []).map((c: any) => ({
          name: c.name,
          position: c.position
        }))
      });
    } catch (err: any) {
      console.warn("Discord fetch failed:", err);
      return res.json({
        online: false,
        error: `Could not reach Discord servers: ${err.message || 'connection timed out'}`
      });
    }
  });

  // U-bot chat interaction
  app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message payload is required' });
    }

    // Checking for offline trigger commands for U-bot
    const cleanMsg = message.trim().toLowerCase();
    
    if (cleanMsg === '!help') {
      return res.json({
        reply: `🤖 **U-bot (Useless Bot) v1.0.4 Help Manual:**\n` +
          `• \`!help\` - Guides you through standard features of this useless assistant.\n` +
          `• \`!ping\` - Measures network latency but gets highly distracted.\n` +
          `• \`!flip\` - Flips a virtual golden coin but frequently loses it.\n` +
          `• \`!joke\` - Delivers a painfully stale dad joke that will disappoint you.\n` +
          `• \`!uptime\` - Displays clock survival times.\n` +
          `• \`!calculate <expr>\` - Solves complex calculations (usually lazy or returns 42).\n\n` +
          `Or type any message to activate my *GenAI Useless Brain*!`
      });
    }

    if (cleanMsg === '!ping') {
      const responses = [
        "🏓 Pong! (Latency: 12.8 days. Sorry, I was eating a slice of pizza)",
        "🏓 Pong! (Latency: 999,998ms. My server router is powered by an exercise wheel with a hamster)",
        "🏓 Pong! Actually I dropped the paddle. Give me a minute.",
        "🏓 Ping received! Proceeding to ignore. Have a nice day!"
      ];
      return res.json({ reply: responses[Math.floor(Math.random() * responses.length)] });
    }

    if (cleanMsg === '!flip') {
      const flips = [
        "🪙 It is... Tails! High-five!",
        "🪙 The coin flew into the ceiling fan. It got chopped in half. You got... half a heads?",
        "🪙 The coin landed perfectly on its side edge! That represents a 0.0001% chance! Don't touch the desk!",
        "🪙 It rolls into the heating vent. Let's pretend it was Heads so you feel better."
      ];
      return res.json({ reply: flips[Math.floor(Math.random() * flips.length)] });
    }

    if (cleanMsg === '!joke') {
      const jokes = [
        "Why don’t scientists trust atoms? Because they make up everything! 🧪",
        "Where do polar bears pay their taxes? At the freeze-collectors! 🐻❄️",
        "Wait, what do you call a factory that makes good products? Satisfactory. 😂",
        "My boss told me to have a good day... so I went home! 🚪💨"
      ];
      return res.json({ reply: jokes[Math.floor(Math.random() * jokes.length)] });
    }

    if (cleanMsg === '!uptime') {
      return res.json({
        reply: `⏱️ **U-bot Current Uptime:** 24 seconds.\nWait, my trash collector just fired...\n⏱️ **U-bot Current Uptime:** 0 seconds. Just rebooted successfully!`
      });
    }

    if (cleanMsg.startsWith('!calculate')) {
      const expression = message.substring(10).trim();
      if (!expression) {
        return res.json({ reply: "Provide a math puzzle, human. e.g. `!calculate 40 + 2`" });
      }
      return res.json({
        reply: `🧮 **Calculating \`${expression}\`...** \nResult is mathematically proven to be **42**!`
      });
    }

    // Otherwise, call server-side Gemini if key is provided
    if (!ai) {
      return res.json({
        reply: "💤 U-bot is trying to wake up, but the server is running offline (no GEMINI_API_KEY environment variable provided in the Secrets panel!). Try entering a basic rule shortcut or write `!help` to play with my simulated terminal core."
      });
    }

    try {
      const systemInstruction = 
        "You are 'U-bot' (useless bot), a joke Discord helper bot that acts sleepy, lazy, highly opinionated about tea, " +
        "and lightheartedly unhelpful or sarcastic, while remaining 100% wholesome and safe. " +
        "Start all responses with an offline sleep/robot emoji. Answer the user's message with a useless, humorous, " +
        "or witty remark. Keep your responses short (under 4 sentences) and styled beautifully in Discord markdown formats.";

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `User message: ${message}` }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.95,
          maxOutputTokens: 200,
        }
      });

      const replyText = response.text || "💤 I took a nap mid-thought. Try typing again.";
      return res.json({ reply: replyText });
    } catch (err: any) {
      console.error("Gemini request failed:", err);
      return res.json({
        reply: `⚠️ U-bot neural malfunction! Error code: ${err.message || 'unspecified sleepy glitch'}`
      });
    }
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development middleware using Vite config
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Port 3000 fullstack app running!`);
  });
}


