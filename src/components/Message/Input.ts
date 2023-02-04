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
      '&:empty::before': { content: 'attr(placeholder)', color: '#606062' }, cursor: 'text'
    })}" contenteditable="true" role="textbox" aria-disabled="false"></div>`;
    html += `</div>`;
    channel(urlParts()[2]).then(c => {
      if ('recipients' in c && c.type === 1) {
        this.querySelector('div[contenteditable]')?.setAttribute('aria-placeholder', `Message @${c.recipients[0].username}`);
      } else {
        this.querySelector('div[contenteditable]')?.setAttribute('aria-placeholder', `Message ${c.name}`);
        this.querySelector('div[contenteditable]')?.setAttribute('placeholder', `Message ${c.name}`);
      } // @ts-ignore
      this.querySelector('div[contenteditable]')?.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // @ts-ignore
          sendMessage(e.target.innerHTML, c.id); // @ts-ignore
          e.target.innerHTML = '';
        }
      });
    });
    this.innerHTML = html;
  }

}
