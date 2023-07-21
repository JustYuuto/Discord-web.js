import { channel, channelMessages, Message } from '../../helpers/api';
import { css } from '@emotion/css';
import { urlParts } from '../../helpers/url';
import { inputCss } from '../Message/Input';
import { cleanJSON } from '../../helpers/string';

export default class ChannelMessages extends HTMLElement {

  connectedCallback() {
    let html = `<div class="${css({ height: '100%', overflow: 'hidden scroll' })}">`;
    this.innerHTML = `${html}Loading...</div><message-input></message-input>`;
    this.classList.add(css({
      width: '100%', height: `calc(100vh - ${document.querySelector(`.${inputCss}`)?.scrollHeight || 0}px - 58px)`,
      backgroundColor: '#36393f', color: 'white', position: 'relative'
    }));
    html += `<div class="${css({ height: '70vh' })}"></div>`;
    channel(urlParts()[2]).then((channel) => {
      html += `<div class="${css({
        paddingLeft: '16px', userSelect: 'none'
      })}">`;
      html += `<h1>Welcome to #${channel.name}</h1>`;
      html += `<span>This is the start of the #${channel.name} channel.</span>`;
      html += `</div>`;
      channelMessages(channel.id).then(messages => {
        messages = (messages.length ? messages : []).reverse();
        console.log(`Fetched ${messages.length} messages for channel ${channel.id}`);
        messages.forEach(message => {
          html += `<channel-message message="${cleanJSON(JSON.stringify(message))}"></channel-message>`;
        });
        html += `</div><message-input></message-input>`;
        this.innerHTML = html;
        this.querySelector('div')?.scroll(0, 999999);
      }).catch((e) => {
        console.error(e);
        const message: Message = {
          attachments: [],
          channel_id: channel.id,
          components: [],
          edited_timestamp: null,
          embeds: [],
          id: '0',
          mention_roles: [],
          pinned: false,
          reactions: [],
          type: 0,
          author: {
            global_name: 'Clyde',
            display_name: 'Clyde',
            id: '0',
            username: 'clyde',
            discriminator: '0',
            bot: true,
            avatar: null,
            banner_color: null
          },
          content: `Messages failed to fetch! Here's the error:\n\`\`\`\n${e}\n\`\`\``,
          timestamp: Date.now(),
          mentions: [],
          mention_everyone: false
        };
        this.innerHTML = `${html}<channel-message message="${cleanJSON(JSON.stringify(message))}"></channel-message></div><message-input></message-input>`;
        this.querySelector('div')?.scroll(0, 999999);
      });
    });
  }

}
