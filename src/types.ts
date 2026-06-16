export interface RuleItem {
  id: string;
  number: number;
  title: string;
  description: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
}

export interface StaffItem {
  id: string;
  username: string;
  discriminator: string;
  roleName: string;
  roleColor: string; // hex or tailwind class
  avatarUrl: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
}

export interface MessageItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  roleColor: string;
  isBot: boolean;
  content: string;
  timestamp: string;
}

export interface CommandItem {
  id: string;
  command: string; // e.g. "!ban @user [reason]"
  description: string;
  category: 'Moderation' | 'Utility' | 'Reaction Roles';
  exampleInput: string;
  responseType: 'embed' | 'text';
  embedTitle?: string;
  embedColor?: string; // hex
  embedFields?: { label: string; value: string }[];
  responseText?: string;
}

export interface ServerConfig {
  name: string;
  tagline: string;
  description: string;
  inviteLink: string;
  memberCount: number;
  onlineCount: number;
  themeColor: 'blurple' | 'emerald' | 'ruby' | 'amber' | 'cyan' | 'fuchsia';
  bannerPreset: string;
  iconType: 'initials' | 'image';
  iconUrl: string;
  discordGuildId?: string;
  rules: RuleItem[];
  events: EventItem[];
  staff: StaffItem[];
  commands?: CommandItem[];
}
