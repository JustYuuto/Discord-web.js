import Component from './Component';
import { css } from '@emotion/css';

export default class LoadingScreen extends Component {

  connectedCallback() {
    let html = `<div>`;
    html += `<span>${this.getAttribute('text')}</span>`;
    html += `</div>`;

    this.classList.add(css({
      width: '100%', height: '100%', position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, display: 'flex',
      justifyContent: 'center', alignItems: 'center', backgroundColor: '#2f3136', zIndex: '999999'
    }));

    this.innerHTML = html;
  }

  static get observedAttributes() { return ['show']; }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string) {
    if (name === 'show' && newValue === 'false') {
      this.remove();
    }
  }

}
