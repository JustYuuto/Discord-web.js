import { channelMessages } from '../../helpers/api';
import { css } from '@emotion/css';
import { urlParts } from '../../helpers/url';
import moment from 'moment';
import { avatarImgHTML, avatarURL } from '../../helpers/image';

export default class ChannelMessages extends HTMLElement {

  connectedCallback() {
    channelMessages(urlParts()[2]).then(messages => {
      let html = `<div class="${css({ height: '100vh', overflow: 'hidden scroll' })}">`;
      messages.forEach(message => {
        const messageLink = `${window.location.protocol}//${window.location.hostname}${(window.location.port !== '80' && window.location.port !== '443') ? `:${window.location.port}` : ''}/channels/${urlParts()[1]}/${message.channel_id}/${message.id}`;
        const messageActions = [
          { icon: 'reply', text: 'Reply' },
          { icon: 'id', text: 'Copy ID', onClick: `copyText("${message.id}")` },
          // { icon: 'link', text: 'Copy Message Link', onClick: `copyText("${messageLink}")` }
        ]; // @ts-ignore
        const mentionned = (message.mention_everyone || typeof message.mentions.find(u => u.id === JSON.parse(localStorage.getItem('user')).id) !== 'undefined');
        const messageActionsCss = css({
          display: 'none', borderColor: '#2f3237', borderWidth: '1px', borderStyle: 'solid',
          '> :first-of-type': { borderBottomLeftRadius: '0.25rem', borderTopLeftRadius: '0.25rem' },
          '> :last-of-type': { borderBottomRightRadius: '0.25rem', borderTopRightRadius: '0.25rem' }
        });
        html += `<div class="${css([{
          display: 'flex', padding: '5px 15px', margin: '10px 0', position: 'relative',
          ':hover': {
            backgroundColor: mentionned ? 'rgba(75,68,59,0.7)' : '#32353b',
            [`.${messageActionsCss}`]: { position: 'absolute', right: '20px', top: '-13px', display: 'flex' }
          },
        }, mentionned && { backgroundColor: '#4b443b' }])}" id="message__${message.id}">`;
        html += `<div data-user-popup="${message.author.id}">`;
        html += avatarImgHTML(
          avatarURL(message.author.id, message.author.avatar, message.author.discriminator, 48), 48,
          { marginRight: '8px', cursor: 'pointer' }
        );
        html += `</div>`;
        html += `<div>`;
        html += `<div class="${css({
          marginBottom: '5px', display: 'flex', alignItems: 'center',
          '*': { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
        })}">`;
        html += `<span data-user-popup="${message.author.id}" class="${css({
          cursor: 'pointer', ':hover': { textDecoration: 'underline' }
        })}">${message.author.username}</span>&nbsp;`;
        html += `<span class="${css({ fontSize: '.75rem', color: '#92969a', userSelect: 'none' })}" title="${moment(message.timestamp).format('LLLL')}">`;
        html += moment(message.timestamp).format('L LT');
        html += `</span>`;
        html += `</div>`;
        html += `<div class="${css({ width: 'fit-content' })}">`;
        html += `<span>`;
        html += `<markdown-text text="${message.content.replaceAll('"', '&quot;')}">`;
        if (message.edited_timestamp) html += `<span class="${css({
          fontSize: '.75rem', color: '#888a8c', userSelect: 'none'
        })}" title="${moment(message.edited_timestamp).format('LLLL')}">&nbsp;(edited)</span>`;
        html += `</markdown-text></span>`;
        if (message.embeds && message.embeds.length !== 0) {
          html += message.embeds
            .filter(embed => embed.type === 'rich')
            .map(embed =>
              `<message-embed embed='${JSON.stringify(embed)}' class="${css({ display: 'flex', marginTop: '5px' })}"></message-embed>`)
            .join('');
        }
        if (message.attachments && message.attachments.length !== 0) {
          html += message.attachments
            .map(attachment =>
              `<message-attachment attachment='${JSON.stringify(attachment)}' class="${css({ display: 'flex', marginTop: '5px' })}"></message-attachment>`)
            .join('');
        }
        if (message.reactions && message.reactions.length !== 0) {
          html += `<div class="${css({ display: 'flex', gap: '5px', marginTop: '5px' })}">`;
          html += message.reactions
            .map(reaction =>
              `<message-reaction me="${reaction.me}" count="${reaction.count}" emoji='${JSON.stringify(reaction.emoji)}' message-id="${message.id}"></message-reaction>`)
            .join('');
          html += `</div>`;
        }
        html += `</div>`;
        html += `<div class="${messageActionsCss}">`;
        html += messageActions.map(action => {
          return `<message-action icon="${action.icon}" text="${action.text}" on-click='${action.onClick?.toString()}'></message-action>`;
        }).join('');
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
      });
      html += `</div>`;
      this.classList.add(css({
        width: '100%', height: '100%', backgroundColor: '#36393f', color: 'white', position: 'relative'
      }));
      this.innerHTML = html;
    });
  }

}
