import { css } from '@emotion/css';
import { guildRole } from '../../../helpers/api';
import { urlParts } from '../../../helpers/url';
import Component from '../../Component';

export default class UserMention extends Component {

  connectedCallback() {
    const id = this.getAttribute('id');
    this.classList.add(css({
      borderRadius: '3px', padding: '0 2px', transition: '.1s'
    }));
    if (id) {
      guildRole(urlParts()[1], id).then(role => { // @ts-ignore
        const color = role.color ? `#${parseInt(role.color.toString(), 16)}` : '#414675';
        const colorHover = role.color ? `#${parseInt(role.color.toString(), 16)}` : '#5865f2';
        this.style.backgroundColor = color;
        this.classList.add(css({ ':hover': { backgroundColor: `${colorHover} !important` } }));
        this.innerHTML = `@${role.name}`;
      });
    } else {
      const color = '#414675';
      const colorHover = '#5865f2';
      this.style.backgroundColor = color;
      this.classList.add(css({ ':hover': { backgroundColor: `${colorHover} !important` } }));
    }
  }

}
