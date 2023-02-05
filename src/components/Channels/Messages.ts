import { channelMessages } from '../../helpers/api';
import { css } from '@emotion/css';
import { urlParts } from '../../helpers/url';
import { inputCss } from '../Message/Input';

export default class ChannelMessages extends HTMLElement {

  connectedCallback() {
    channelMessages(urlParts()[2]).then(messages => {
      let html = `<div class="${css({ height: '100%', overflow: 'hidden scroll' })}">`;
      messages.forEach(message => {
        html += `<channel-message message="${JSON.stringify(message).replaceAll('"', '&quot;')}"></channel-message>`;
      });
      html += `</div><message-input></message-input>`;
      this.innerHTML = html;
      this.classList.add(css({
        width: '100%', height: `calc(100vh - ${document.querySelector(`.${inputCss}`)?.scrollHeight}px)`,
        backgroundColor: '#36393f', color: 'white', position: 'relative'
      }));
    });
  }

}
