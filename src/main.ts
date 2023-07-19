import './app.css';
import 'normalize.css';
import ChannelsList from './components/Channels/List';
import DMsList from './components/DMs/List';
import { navigateTo } from './helpers/navigation';
import { urlParts } from './helpers/url';
import { guildChannels, tokenTest, User } from './helpers/api';
import GuildsList from './components/Guilds/List';
import { css } from '@emotion/css';
import ChannelMessages from './components/Channels/Messages';
import Icon from './components/Icon';
import Markdown from './components/Markdown';
import UserMention from './components/Interactive/Mentions/User';
import RoleMention from './components/Interactive/Mentions/Role';
import GuildsListButton from './components/Guilds/ListButton';
import MessageReaction from './components/Message/Reaction';
import MessageAttachment from './components/Message/Attachment';
import MessageEmbed from './components/Message/Embed';
import moment from 'moment';
import ChannelLink from './components/Interactive/ChannelLink';
import { initPopups } from './helpers/popups';
import LoadingScreen from './components/LoadingScreen';
import MessageInput from './components/Message/Input';
import UAParser from 'ua-parser-js';
import ChannelMessage from './components/Channels/Message';
import MessageLabel from './components/Message/Label';
import ChannelInfo from "./components/Channels/Info";

customElements.define('loading-screen', LoadingScreen);
customElements.define('channels-list', ChannelsList);
customElements.define('dms-list', DMsList);
customElements.define('guilds-list', GuildsList);
customElements.define('guilds-list-button', GuildsListButton);
customElements.define('channel-messages', ChannelMessages);
customElements.define('channel-message', ChannelMessage);
customElements.define('svg-icon', Icon);
customElements.define('markdown-text', Markdown);
customElements.define('user-mention', UserMention);
customElements.define('role-mention', RoleMention);
customElements.define('message-reaction', MessageReaction);
customElements.define('message-attachment', MessageAttachment);
customElements.define('message-embed', MessageEmbed);
customElements.define('channel-link', ChannelLink);
customElements.define('message-input', MessageInput);
customElements.define('user-tag', MessageLabel);
customElements.define('channel-info', ChannelInfo);

const path = window.location.pathname;
const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('Cannot render app because the app root element cannot be found.');
const pathRegexps = {
  guild: /\/channels\/([0-9]{18,19})/gi,
  channel: /\/channels\/([0-9]{18,19})\/([0-9]{18,19})/gi,
  dm: /\/channels\/@me\/([0-9]{18,19})/gi,
};

if (path !== '/login' && !localStorage.getItem('token')) {
  navigateTo('/login');
}
if (localStorage.getItem('locale') !== null) { // @ts-ignore
  moment.locale(localStorage.getItem('locale')); // @ts-ignore
  document.querySelector('html')?.setAttribute('lang', localStorage.getItem('locale'));
}

(async () => {
  const guildId = urlParts()[1];
  const template = (html: string): string => `
<div class="${css({ display: 'flex' })}">
  <div class="${css({
    backgroundColor: '#202225', overflow: 'hidden scroll', height: '100vh', width: '85px', maxWidth: '85px',
    minWidth: '85px'
  })}">
    <div class="${css({ height: '3px', backgroundColor: '#373a3f', marginLeft: '7px', marginRight: '7px' })}"></div>
    <guilds-list></guilds-list>
    <guilds-list-button button="join-guild"></guilds-list-button>
    <guilds-list-button button="discovery"></guilds-list-button>
  </div>
  <div class="${css({ display: 'flex', flexDirection: 'column', width: '100%' })}">
    <channel-info></channel-info>
    <div class="${css({ display: 'flex', height: 'calc(100vh - 58px)' })}">${html}</div>
  </div>
</div>`;

  root.innerHTML = `<loading-screen text="Loading..."></loading-screen>`;

  if (path === '/login') {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token !== null) {
      tokenTest(token).then(async req => {
        if (req.status === 200) {
          const user: User = await req.json();
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('locale', user.locale);
          navigateTo('/app');
        }
      });
    }
  } else if (path === '/app') {
    navigateTo('/channels/@me');
  } else if (path === '/channels/@me') {
    root.innerHTML += template('<dms-list></dms-list>');
  } else if (pathRegexps.dm.test(path) && typeof urlParts()[2] !== 'undefined') {
    root.innerHTML += template('<dms-list></dms-list><channel-messages></channel-messages>');
  } else if (pathRegexps.channel.test(path) && typeof urlParts()[2] !== 'undefined') {
    root.innerHTML += template(`<channels-list guild-id="${guildId}"></channels-list><channel-messages></channel-messages>`);
  } else if (pathRegexps.guild.test(path)) {
    const firstChannel = (await guildChannels(guildId))?.find(ch => ch.type !== 4 && ch.type !== 2)?.id;
    navigateTo(`/channels/${guildId}/${firstChannel}`);
  }

  setTimeout(() => {
    initPopups();
    document.querySelector('loading-screen')?.remove();
    const socket = new WebSocket('wss://gateway.discord.gg/?v=10&encoding=json');
    const ua = new UAParser(navigator.userAgent);
    const payload = {
      op: 2,
      d: {
        token: localStorage.getItem('token'),
        // Bitfield for ALL permissions
        intents: 3276799,
        properties: {
          os: ua.getOS().name?.toLowerCase(),
          browser: ua.getBrowser().name?.toLowerCase(),
          device: 'chrome'
        }
      }
    }

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(payload));
    });

    socket.addEventListener('message', (event) => {
      const payload = JSON.parse(event.data);
      const { t, d, op } = payload;

      switch (op) {
        case 10:
          const { heartbeat_interval } = d;
          heartbeat(heartbeat_interval);
          break;
      }

      switch (t) {
        case 'MESSAGE_CREATE':
          if (d.channel_id === urlParts()[2]) {
            const message = document.createElement('channel-message');
            message.setAttribute('message', JSON.stringify(d));
            document.querySelector('channel-messages > div')?.insertBefore(message, document.querySelector('channel-messages channel-message:first-of-type'));
          }
          break;
        case 'MESSAGE_UPDATE':
          if (d.channel_id === urlParts()[2]) {
            document.querySelector(`channel-message#message__${d.id}`)?.setAttribute('message', JSON.stringify(d));
          }
          break;
        case 'MESSAGE_DELETE':
          if (d.channel_id === urlParts()[2]) {
            document.querySelector(`channel-message#message__${d.id}`)?.remove();
          }
          break;
      }
    });

    function heartbeat(ms: number) {
      return setInterval(() => socket.send(JSON.stringify({ op: 1, d: null })), ms);
    }
  }, 2000);
})();

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js');
}
