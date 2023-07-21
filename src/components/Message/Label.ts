import Component from '../Component';
import { css } from '@emotion/css';

export default class MessageLabel extends Component {

  connectedCallback() {
    const tag = this.getAttribute('tag');
    this.classList.add(css({
      textTransform: 'uppercase', padding: '3px', backgroundColor: '#5865f2', borderRadius: '.25rem',
      fontSize: '0.7rem', color: '#fff', userSelect: 'none'
    }));
    this.innerHTML = tag;
  }

}
