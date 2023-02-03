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
import MessageAction from './components/Message/Action';
import { copyText } from './helpers/text';
import MessageAttachment from './components/Message/Attachment';
import MessageEmbed from './components/Message/Embed';
import moment from 'moment';
import ChannelLink from './components/Interactive/ChannelLink';

customElements.define('channels-list', ChannelsList);
customElements.define('dms-list', DMsList);
customElements.define('guilds-list', GuildsList);
customElements.define('guilds-list-button', GuildsListButton);
customElements.define('channel-messages', ChannelMessages);
customElements.define('svg-icon', Icon);
customElements.define('markdown-text', Markdown);
customElements.define('user-mention', UserMention);
customElements.define('role-mention', RoleMention);
customElements.define('message-reaction', MessageReaction);
customElements.define('message-action', MessageAction);
customElements.define('message-attachment', MessageAttachment);
customElements.define('message-embed', MessageEmbed);
customElements.define('channel-link', ChannelLink);

const path = window.location.pathname;
const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('Cannot render app because the app root element cannot be found.');
const pathRegexps = {
  guild: /\/channels\/([0-9]{18,19})/gi,
  channel: /\/channels\/([0-9]{18,19})\/([0-9]{18,19})/gi,
  dm: /\/channels\/@me\/([0-9]{18,19})/gi,
};

if (!localStorage.getItem('token')) {
  navigateTo('/login');
}
if (localStorage.getItem('locale') !== null) { // @ts-ignore
  moment.locale(localStorage.getItem('locale')); // @ts-ignore
  document.querySelector('html')?.setAttribute('lang', localStorage.getItem('locale'));
}

(async () => {
  const guildId = urlParts()[1];

  if (path === '/login') {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token !== null) {
      tokenTest(token).then(async req => {
        if (req.status === 200) {
          const user: User = await req.json();
          localStorage.setItem('token', token);
          localStorage.setItem('locale', user.locale);
          navigateTo('/app');
        }
      });
    }
  } else if (path === '/app') {
    navigateTo('/channels/@me');
  } else if (path === '/channels/@me') {
    root.innerHTML = `
        <div class="${css({ display: 'flex' })}">
            <div class="${css({
      backgroundColor: '#202225',
      overflow: 'hidden scroll',
      height: '100vh',
      width: '85px',
      maxWidth: '85px',
      minWidth: '85px'
    })}">
                <div class="${css({ height: '3px', backgroundColor: '#373a3f', marginLeft: '7px', marginRight: '7px' })}"></div>
                <guilds-list></guilds-list>
                <guilds-list-button button="join-guild"></guilds-list-button>
                <guilds-list-button button="discovery"></guilds-list-button>
            </div>
            <div class="${css({ display: 'flex', flexDirection: 'column', width: '100%' })}">
                <div class="${css({ display: 'flex' })}">
                    <dms-list></dms-list>
                </div>
            </div>
        </div>
        `;
  } else if (pathRegexps.dm.test(path) && typeof urlParts()[2] !== 'undefined') {
    root.innerHTML = `
        <div class="${css({ display: 'flex' })}">
            <div class="${css({
      backgroundColor: '#202225',
      overflow: 'hidden scroll',
      height: '100vh',
      width: '85px',
      maxWidth: '85px',
      minWidth: '85px'
    })}">
                <div class="${css({ height: '3px', backgroundColor: '#373a3f', marginLeft: '7px', marginRight: '7px' })}"></div>
                <guilds-list></guilds-list>
                <guilds-list-button button="join-guild"></guilds-list-button>
                <guilds-list-button button="discovery"></guilds-list-button>
            </div>
            <div class="${css({ display: 'flex', flexDirection: 'column', width: '100%' })}">
                <div class="${css({ display: 'flex' })}">
                    <dms-list></dms-list>
                    <channel-messages></channel-messages>
                </div>
            </div>
        </div>
        `;
  } else if (pathRegexps.channel.test(path) && typeof urlParts()[2] !== 'undefined') {
    root.innerHTML = `
        <div class="${css({ display: 'flex' })}">
            <div class="${css({
      backgroundColor: '#202225',
      overflow: 'hidden scroll',
      height: '100vh',
      width: '85px',
      maxWidth: '85px',
      minWidth: '85px'
    })}">
                <div class="${css({ height: '3px', backgroundColor: '#373a3f', marginLeft: '7px', marginRight: '7px' })}"></div>
                <guilds-list></guilds-list>
                <guilds-list-button button="join-guild"></guilds-list-button>
                <guilds-list-button button="discovery"></guilds-list-button>
            </div>
            <div class="${css({ display: 'flex', flexDirection: 'column', width: '100%' })}">
                <div class="${css({ display: 'flex' })}">
                    <channels-list guild-id="${guildId}"></channels-list>
                    <channel-messages></channel-messages>
                </div>
            </div>
        </div>
        `;
  } else if (pathRegexps.guild.test(path)) {
    const firstChannel = (await guildChannels(guildId))?.find(ch => ch.type !== 4 && ch.type !== 2)?.id;
    navigateTo(`/channels/${guildId}/${firstChannel}`);
  }
})();

// @ts-ignore
window.copyText = copyText;

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('/sw.js');
}
