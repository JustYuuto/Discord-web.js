import { channelMessages } from '../../helpers/api';
import { css } from '@emotion/css';
import { urlParts } from '../../helpers/url';
import { inputCss } from '../Message/Input';

export default class ChannelMessages extends HTMLElement {

  connectedCallback() {
    let html = `<div class="${css({ height: '100%', overflow: 'hidden scroll' })}">`;
    this.innerHTML = `${html}Loading...</div><message-input></message-input>`;
    this.classList.add(css({
      width: '100%', height: `calc(100vh - ${document.querySelector(`.${inputCss}`)?.scrollHeight || 0}px)`,
      backgroundColor: '#36393f', color: 'white', position: 'relative'
    }));
    channelMessages(urlParts()[2]).then(messages => {
      console.log(`Fetched ${messages.length} messages for channel ${urlParts()[2]}`);
      messages.forEach(message => {
        html += `<channel-message message="${JSON.stringify(message).replaceAll('"', '&quot;')}"></channel-message>`;
      });
      html += `</div><message-input></message-input>`;
      this.innerHTML = html;
    }).catch((e) => {
      this.innerHTML = `${html}${e}</div><message-input></message-input>`;
    });
  }

}
