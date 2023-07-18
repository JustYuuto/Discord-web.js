import { deleteMessage, markUnread, Message, pinMessage, unpinMessage } from '../../helpers/api';
import { css } from '@emotion/css';
import moment from 'moment';
import { avatarImgHTML, avatarURL } from '../../helpers/image';
import { copyText } from '../../helpers/text';
import Component from '../Component';

export default class ChannelMessage extends Component {

  connectedCallback() {
    const message: Message = JSON.parse(this.getAttribute('message') || 'null');
    if (!message) return;
    let html = '';
    const messageActions = [
      { messageId: message.id, icon: 'reply', text: 'Reply', onClick: () => {} },
      { messageId: message.id, icon: 'pen', text: 'Edit', onClick: () => {
        // @ts-ignore
        this.querySelector('#msg-content').innerHTML = `<message-input><markdown-text text="${message.content.replaceAll('"', '&quot;')}"></markdown-text></message-input>`;
      } },
      message.pinned ?
        { messageId: message.id, icon: 'pin', text: 'Unpin Message', onClick: () => unpinMessage(message.channel_id, message.id) } :
        { messageId: message.id, icon: 'pin', text: 'Pin Message', onClick: () => pinMessage(message.channel_id, message.id) },
      { messageId: message.id, icon: 'unread', text: 'Mark Unread', onClick: () => markUnread(message.channel_id, message.id) },
      { messageId: message.id, icon: 'speech', text: 'Speak Message', onClick: () => {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(message.content));
        } },
      { messageId: message.id, icon: 'delete', text: 'Delete Message', onClick: () => deleteMessage(message.channel_id, message.id) },
      { messageId: message.id, icon: 'id', text: 'Copy ID', onClick: () => copyText(message.id) },
    ];
    // @ts-ignore
    const mentionned = (message.mention_everyone || typeof message.mentions.find(u => u.id === JSON.parse(localStorage.getItem('user')).id) !== 'undefined');
    const messageActionsCss = css({
      display: 'none', borderColor: '#2f3237', borderWidth: '1px', borderStyle: 'solid',
      '> :first-of-type': { borderBottomLeftRadius: '.25rem', borderTopLeftRadius: '.25rem' },
      '> :last-of-type': { borderBottomRightRadius: '.25rem', borderTopRightRadius: '.25rem' }
    });
    if (message.type === 20 && message.interaction) {
      html += `<div class="${css({
        display: 'flex', left: '46px', position: 'relative', alignItems: 'center'
      })}">`;
      html += avatarImgHTML(
        avatarURL(message.interaction.user.id, message.interaction.user.avatar, message.interaction.user.discriminator, 16), 16,
        { marginRight: '8px', cursor: 'pointer' }
      );
      html += `<strong>${message.interaction.user.display_name || message.interaction.user.username}</strong>&nbsp;`;
      html += `used&nbsp;<strong>/${message.interaction.name}</strong>&nbsp;`;
      html += `with&nbsp;<strong>${message.author.display_name || message.author.username}</strong>`;
      html += `</div>`;
    } else if (message.type === 19) {
      html += `<div class="${css({
        display: 'flex', left: '46px', position: 'relative', alignItems: 'center'
      })}">`;
      html += avatarImgHTML(
        avatarURL(message.referenced_message.author.id, message.referenced_message.author.avatar, message.referenced_message.author.discriminator, 16), 16,
        { marginRight: '8px', cursor: 'pointer' }
      );
      html += `<strong>${message.referenced_message.author.display_name || message.referenced_message.author.username}</strong>&nbsp;`;
      html += `<markdown-text text="${message.referenced_message.content.replaceAll('"', '&quot;')}"></markdown-text>`;
      html += `</div>`;
    }
    html += `<div class="${css([{
      display: 'flex', padding: '5px 15px', position: 'relative',
      ':hover': {
        backgroundColor: mentionned ? 'rgba(75,68,59,0.7)' : '#32353b',
        [`.${messageActionsCss}`]: { position: 'absolute', right: '20px', top: '-13px', display: 'flex' }
      },
    }, mentionned && { backgroundColor: '#4b443b' }])}"><div data-user-popup="${message.author.id}">`;
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
    const showTag = message.author.bot || message.author.system;
    html += `<span data-user-popup="${message.author.id}" class="${css({
      cursor: 'pointer', ':hover': { textDecoration: 'underline' }, display: 'flex', gap: '6px'
    })}">${message.author.display_name || message.author.username}${showTag ? `<user-tag tag="${message.author.system ? 'System' : 'Bot'}"></user-tag>` : ''}</span>&nbsp;`;
    html += `<span class="${css({ fontSize: '.75rem', color: '#92969a', userSelect: 'none' })}" title="${moment(message.timestamp).format('LLLL')}">`;
    html += moment(message.timestamp).format('L LT');
    html += `</span>`;
    html += `</div>`;
    html += `<div class="${css({ width: 'fit-content' })}" id="msg-content">`;
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
          `<message-embed embed='${JSON.stringify(embed).replaceAll('>', '&gt;').replaceAll('\'', '&#39;')}' class="${css({ display: 'flex', marginTop: '5px' })}"></message-embed>`)
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
      let html = '';
      const actionCss = css({
        padding: '5px', margin: 0, backgroundColor: '#36393f', height: '28px', width: '28px', display: 'flex',
        justifyContent: 'center', alignItems: 'center', cursor: 'pointer', ':hover': { backgroundColor: '#40444b' }
      });
      html += `<div class="${actionCss}" title="${action.text}" aria-label="${action.text}" role="button">`;
      html += `<svg-icon icon="${action.icon}" width="24" height="24" class="${css({ margin: 0, padding: 0 })}"></svg-icon>`;
      html += `</div>`;
      return html;
    }).join('');
    html += `</div></div></div>`;
    this.setAttribute('id', `message__${message.id}`);
    this.classList.add(css({
      margin: '10px 0', display: 'block'
    }));
    this.innerHTML = html;
    messageActions.forEach(action => {
      this.querySelector(`div[aria-label="${action.text}"]`)?.addEventListener('click', action.onClick);
    });
    this.removeAttribute('message');
  }

  static get observedAttributes() { return ['message']; }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string) {
    if (name === 'message' && oldValue === null && newValue !== null) {
      this.className = '';
      this.removeAttribute('id');
      this.connectedCallback();
    }
  }

}
