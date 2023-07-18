import { urlParts } from './url';

const apiBase = 'https://discord.com/api/v10';
const token = localStorage.getItem('token') || '';

export async function tokenTest(token: string): Promise<Response> {
  return await fetch(`${apiBase}/users/@me`, {
    headers: { Authorization: token }
  });
}

export async function user(id: number | string): Promise<User> {
  const req = await fetch(`${apiBase}/users/${id}`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function userProfile(id: number | string): Promise<UserProfile> {
  const req = await fetch(`${apiBase}/users/${id}/profile`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function guilds(): Promise<Guild[]> {
  const req = await fetch(`${apiBase}/users/@me/guilds`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function channelMessages(id: string | number): Promise<Message[]> {
  const req = await fetch(`${apiBase}/channels/${id}/messages`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function guild(id: string | number): Promise<Guild> {
  const req = await fetch(`${apiBase}/guilds/${id}`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function guildChannels(id: number | string): Promise<Channel[]> {
  const req = await fetch(`${apiBase}/guilds/${id}/channels`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function guildRoles(id: string | number): Promise<Role[]> {
  const req = await fetch(`${apiBase}/guilds/${id || urlParts()[1]}/roles`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function guildRole(guildId: string | number, roleId: number | string): Promise<Role> {
  const req = await fetch(`${apiBase}/guilds/${guildId || urlParts()[1]}/roles`, {
    headers: { Authorization: token }
  });
  return (await req.json()).find((r: Role) => r.id === roleId);
}

export async function channel(id: string | number): Promise<Channel|DMChannel> {
  const req = await fetch(`${apiBase}/channels/${id}`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function dms(): Promise<DMChannel[]> {
  const req = await fetch(`${apiBase}/users/@me/channels`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function addReaction(messageId: string | number, emoji: string): Promise<void> {
  await fetch(`${apiBase}/channels/${urlParts()[2]}/messages/${messageId}/reactions/${emoji}/@me`, {
    headers: { Authorization: token }, method: 'PUT'
  });
  return;
}

export async function removeReaction(messageId: string | number, emoji: string): Promise<void> {
  await fetch(`${apiBase}/channels/${urlParts()[2]}/messages/${messageId}/reactions/${emoji}/@me`, {
    headers: { Authorization: token }, method: 'DELETE'
  });
  return;
}

export async function emojiGuild(id: string | number): Promise<Guild> {
  const req = await fetch(`${apiBase}/emojis/${id}/guild`, {
    headers: { Authorization: token }
  });
  return req.json();
}

export async function sendMessage(content: string, channelId: string | number): Promise<Message> {
  const req = await fetch(`${apiBase}/channels/${channelId}/messages`, {
    headers: { Authorization: token, 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({
      content
    })
  });
  return req.json();
}

export async function deleteMessage(channelId: string | number, messageId: string | number): Promise<void> {
  await fetch(`${apiBase}/channels/${channelId}/messages/${messageId}`, {
    headers: { Authorization: token }, method: 'DELETE'
  });
  return;
}

export async function markUnread(channelId: string | number, messageId: string): Promise<Message> {
  const req = await fetch(`${apiBase}/channels/${channelId}/messages/${messageId}/ack`, {
    headers: { Authorization: token, 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify({
      token: null
    })
  });
  return req.json();
}

export async function pinMessage(channelId: string | number, messageId: string): Promise<Message> {
  const req = await fetch(`${apiBase}/channels/${channelId}/pins/${messageId}`, {
    headers: { Authorization: token }, method: 'PUT'
  });
  return req.json();
}

export async function unpinMessage(channelId: string | number, messageId: string): Promise<void> {
  await fetch(`${apiBase}/channels/${channelId}/pins/${messageId}`, {
    headers: { Authorization: token }, method: 'DELETE'
  });
  return;
}

export interface Channel {
  id: string,
  type: ChannelType,
  name: string,
  guild_id: Guild['id'],
  position: number
}

interface Guild {
  id: number,
  name: string,
  icon: string,
  emojis: Emoji[],
  approximate_presence_count: number
}

export interface Message {
  id: string,
  content: string,
  author: User,
  timestamp: Date,
  mention_everyone: boolean,
  mention_roles: Role['id'][],
  mentions: User[],
  edited_timestamp: Date,
  reactions: Reaction[],
  attachments: Attachment[],
  embeds: Embed[],
  channel_id: string,
  pinned: boolean,
  type: number,
  interaction?: {
    name: string,
    user: User
  }
}

export interface User {
  id: number,
  avatar: string,
  username: string,
  display_name: string,
  global_name: string,
  discriminator: number,
  system: boolean,
  bot: boolean,
  locale:
    'id' | 'da' | 'de' | 'en-GB' | 'en-US' | 'es-ES' | 'fr' | 'hr' | 'it' | 'lt' | 'hu' | 'nl' | 'no' | 'pl' |
    'pt-BR' | 'ro' | 'fi' | 'sv-SE' | 'vi' | 'tr' | 'cs' | 'el' | 'bg' | 'ru' | 'uk' | 'hi' | 'th' | 'zh-CN' | 'ja' |
    'zh-TW' | 'ko',
  banner_color: string
}

export interface Role {
  id: string,
  name: string,
  color: string
}

interface DMChannel {
  id: string,
  type: ChannelType.DM | ChannelType.GROUP_DM,
  recipients: User[],
  // Only for groups DMs
  name?: string,
  icon?: string
}

enum ChannelType {
  'GUILD_TEXT', 'DM', 'GUILD_VOICE', 'GROUP_DM', 'GUILD_CATEGORY', 'GUILD_ANNOUNCEMENT',
  'ANNOUNCEMENT_THREAD', 'PUBLIC_THREAD', 'PRIVATE_THREAD', 'GUILD_STAGE_VOICE', 'GUILD_DIRECTORY',
  'GUILD_FORUM'
}

interface Reaction {
  count: number,
  me: boolean,
  emoji: Emoji
}

export interface Emoji {
  user?: User,
  roles?: Role[],
  name: string,
  id: string,
  animated: boolean,
  quality: 'lossless'
}

export interface Attachment {
  content_type: string,
  filename: string,
  width: number,
  height: number,
  url: string,
  proxy_url: string,
  size: number
}

export interface Embed {
  title: string,
  description?: string,
  footer?: {
    text: string,
    icon_url?: string
  },
  timestamp: Date,
  type: 'rich' | 'image' | 'video' | 'gifv' | 'article' | 'link',
  url: string,
  color: string,
  author?: {
    icon_url?: string,
    proxy_icon_url?: string,
    name: string,
    url?: string
  }
}

interface UserProfile {
  user: User,
  user_profile: {
    accent_color: string,
    banner: string | null
  }
}
