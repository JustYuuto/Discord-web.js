import { css } from '@emotion/css';

export default class GuildsListButton extends HTMLElement {

  connectedCallback() {
    const icon = this.getAttribute('button');
    let html = '';
    let title = '';
    html += `<div class="${css({
      width: '48px', height: '48px', backgroundColor: '#36393f', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', borderRadius: '50%', userSelect: 'none', transition: '.2s',
      '&:hover': { borderRadius: '.75rem', backgroundColor: '#3ba55d', path: { fill: 'white' } }
    })}">`;
    if (icon === 'join-guild') {
      html += `<svg-icon icon="plus_bigger" width="24" height="24" class="${css({ path: { fill: '#3ba55d' } })}"></svg-icon>`;
      title = 'Join/create a server';
    } else if (icon === 'discovery') {
      html += `<svg-icon icon="compass" width="24" height="24" class="${css({ path: { fill: '#3ba55d' } })}"></svg-icon>`;
      title = 'Explore Public Servers';
    }
    html += `</div>`;
    this.classList.add(css({
      width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginTop: '6px', marginBottom: '6px', cursor: 'pointer'
    }));
    this.setAttribute('title', title);
    this.setAttribute('data-tooltip-position', 'right');
    this.innerHTML = html;
  }

}
