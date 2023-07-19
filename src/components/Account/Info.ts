import { css } from '@emotion/css';
import { User } from '../../helpers/api';
import Component from '../Component';
import { avatarImgHTML, avatarURL } from '../../helpers/image';

export default class AccountInfo extends Component {

  connectedCallback() {
    this.classList.add(css({
      display: 'flex', width: '100%', height: '62.4px', justifyContent: 'space-between', alignItems: 'center',
      paddingLeft: '14px', paddingRight: '14px'
    }));
    let html = '';
    // @ts-ignore
    const user: User = JSON.parse(localStorage.getItem('user'));
    html += `<div>`;
    html += `<div class="${css({
      display: 'flex', alignItems: 'center', gap: '8px'
    })}">`;
    html += `<div>`;
    html += avatarImgHTML(avatarURL(user.id, user.avatar, user.discriminator, 48), 40, {
      display: 'block'
    });
    html += `</div>`;
    html += `<div class="${css({
      display: 'flex', flexDirection: 'column'
    })}">`;
    html += `<span>${user.global_name || user.display_name || user.username}</span>`;
    html += `<span class="${css({
      color: '#888a8c'
    })}">${user.discriminator === '0' ? user.username : `#${user.discriminator}`}</span>`;
    html += `</div>`;
    html += `</div>`;
    html += `</div>`;
    html += `<div class="${css({
      display: 'flex'
    })}">`;
    const buttons = [
      { icon: 'microphone', label: 'Mute', onClick: () => {} },
      { icon: 'headphone', label: 'Deafen', onClick: () => {} },
      { icon: 'cog', label: 'Settings', onClick: () => {} },
    ];
    buttons.forEach(button => {
      html += `<div class="${css({
        cursor: 'pointer'
      })}" aria-label="${button.label}">`;
      html += `<svg-icon icon="${button.icon}"></svg-icon>`;
      html += `</div>`;
    });
    html += `</div>`;

    this.innerHTML = html;
    buttons.forEach(button => {
      this.querySelector(`div[aria-label="${button.label}"]`)?.addEventListener('click', button.onClick);
    });
  }

}
