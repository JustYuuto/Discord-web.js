import Component from '../Component';
import { css } from '@emotion/css';
import { channel, sendMessage } from '../../helpers/api';
import { urlParts } from '../../helpers/url';

export const inputCss = css({
  backgroundColor: '#36393f', padding: '12px'
});

export default class MessageInput extends Component {

  connectedCallback() {
    let html = `<div class="${inputCss}">`;
    html += `<div class="${css({
      backgroundColor: '#40444b', padding: '10px 12px', width: '100%', borderRadius: '.25rem', display: 'block',
      '&:empty::before': { content: 'attr(placeholder)', color: '#606062' }
    })}" contenteditable="true" role="textbox" aria-disabled="false" style="cursor: text">${this.innerHTML}</div>`;
    html += `</div>`;
    channel(urlParts()[2]).then(ch => {
      if (ch.type === 0 || ch.type === 5) {
        this.querySelector('div[contenteditable]')?.setAttribute('aria-placeholder', `Message #${ch.name}`);
        this.querySelector('div[contenteditable]')?.setAttribute('placeholder', `Message #${ch.name}`);
      } else if (ch.type === 1 && 'recipients' in ch && ch.recipients.length === 1) {
        this.querySelector('div[contenteditable]')?.setAttribute('aria-placeholder', `Message @${ch.recipients[0].display_name || ch.recipients[0].username}`);
        this.querySelector('div[contenteditable]')?.setAttribute('placeholder', `Message @${ch.recipients[0].display_name || ch.recipients[0].username}`);
      } else {
        this.querySelector('div[contenteditable]')?.setAttribute('aria-placeholder', `Message ${ch.name}`);
        this.querySelector('div[contenteditable]')?.setAttribute('placeholder', `Message ${ch.name}`);
      } // @ts-ignore
      this.querySelector('div[contenteditable]')?.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault(); // @ts-ignore
          sendMessage((<string>e.target.innerHTML)
            .replaceAll('&nbsp;', ' ')
            .replaceAll('<br>', '\n'), ch.id
          ); // @ts-ignore
          e.target.innerHTML = '';
        }
      });
    }).catch(() => {
      this.querySelector('div[contenteditable]')?.setAttribute('aria-disabled', 'true');
      this.querySelector('div[contenteditable]')?.setAttribute('aria-placeholder', 'You do not have permission to send messages in this channel.');
      this.querySelector('div[contenteditable]')?.setAttribute('placeholder', 'You do not have permission to send messages in this channel.');
      // @ts-ignore
      this.querySelector('div[contenteditable]').style.cursor = 'not-allowed';
      this.querySelector('div[contenteditable]')?.removeAttribute('contenteditable');
    });
    this.innerHTML = html;
  }

}
