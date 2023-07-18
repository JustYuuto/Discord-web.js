import { Channel, guildChannels } from '../../helpers/api';
import { css } from '@emotion/css';
import Component from '../Component';

export default class ChannelsList extends Component {

  connectedCallback() {
    const guildId = this.getAttribute('guild-id');
    guildChannels(guildId).then(channels => {
      console.log(`Fetched ${channels.length} channels for guild ${guildId}`);
      const list: Channel[] = [];
      channels.forEach(c => list[c.position] = c);
      let html = '';
      list.forEach(channel => {
        const channelLinkAndCatCss = css({ color: '#96989d', display: 'flex', textDecoration: 'none', cursor: 'pointer', overflow: 'hidden' });
        html += `<div class="${css({ marginTop: '6px', marginBottom: '6px' })}">`;
        if (channel.type !== 4) {
          html += `<a href="/channels/${channel.guild_id}/${channel.id}" class="${css({ '> *': { 
              margin: '6px', display: 'flex', alignItems: 'center' 
          } })} ${channelLinkAndCatCss}">`;
          if (channel.type === 5) {
            html += `<svg viewBox="0 0 24 24" class="${css({ width: '24px', height: '24px' })}">
                            <path d="M3.9 8.26H2V15.2941H3.9V8.26Z" fill="currentColor" />
                            <path d="M19.1 4V5.12659L4.85 8.26447V18.1176C4.85 18.5496 5.1464 18.9252 5.5701 19.0315L9.3701 19.9727C9.4461 19.9906 9.524 20 9.6 20C9.89545 20 10.1776 19.8635 10.36 19.6235L12.7065 16.5242L19.1 17.9304V19.0588H21V4H19.1ZM9.2181 17.9944L6.75 17.3826V15.2113L10.6706 16.0753L9.2181 17.9944Z" fill="currentColor" />
                        </svg>`;
          } else if (channel.type === 0) {
            html += `<svg-icon icon="channel" width="24" height="24"></svg-icon>`;
          } else if (channel.type === 2) {
            html += `<svg viewBox="0 0 24 24" class="${css({ width: '24px', height: '24px' })}">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z" />
                        </svg>`;
          }
          html += `<span>${channel.name}</span></a>`;
        } else {
          html += `<div class="${css({ 
              justifyContent: 'space-between', marginTop: '10px', marginBottom: '10px', fontSize: '14px', alignItems: 'center'
          })} ${channelLinkAndCatCss}">`;
          html += `<div class="${css({
              textTransform: 'uppercase', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', 
              position: 'relative', alignItems: 'center', display: 'flex', ':hover': { color: '#d4d5d6', path: { fill: '#d4d5d6' } }
          })}">`;
          html += `<svg-icon icon="arrow_bottom" class="${css({ width: '18px', height: '18px' })}"></svg-icon>`;
          html += `<span>${channel.name}</span>`;
          html += '</div>';
          html += `<div class="${css({ width: '18px', height: '18px', ':hover': { color: '#d4d5d6', path: { fill: '#d4d5d6' } } })}"><svg-icon icon="plus"></svg-icon></div>`;
          html += '</div>';
        }
        html += `</div>`;
      });
      this.classList.add(css({
        width: '282px', minWidth: '282px', height: '100vh', padding: '10px 10px 0', overflow: 'hidden scroll',
        backgroundColor: '#2f3136'
      }));
      this.innerHTML = html;
    });
  }

}
