import Component from '../Component';
import { css } from '@emotion/css';
import moment from 'moment';

export default class MessageEmbed extends Component {

  connectedCallback() { // @ts-ignore
    const embed: Embed = JSON.parse(this.getAttribute('embed'));
    console.log(embed)
    let html = '<div>';
    html += `<div class="${css({ display: 'grid', padding: '12px' })}">`;
    if (embed.title) {
      if (embed.url) html += `<a href="${embed.url}" target="_blank">`;
      html += `<markdown-text class="${css({ fontSize: '16px', fontWeight: 600 })}">${embed.title}</markdown-text>`;
      if (embed.url) html += `</a>`;
    }
    if (embed.description) html +=
      `<markdown-text class="${css({ fontSize: '.875rem', fontWeight: 400, marginTop: '2px' })}" embed="true">${embed.description?.replaceAll('"', '&quot;')}</markdown-text>`;
    html += '</div>';
    if (embed.footer || embed.timestamp) {
      html += `<div class="${css({
        display: 'flex', alignItems: 'center', padding: '0 12px 12px 12px', fontSize: '.75rem'
      })}">`;
      if (embed.footer) {
        html += `<div class="${css({ display: 'flex', alignItems: 'center', gap: '7px' })}">`;
        html += `<img src="${embed.footer?.icon_url}" class="${css({ width: '20px', height: '20px', borderRadius: '9999px' })}" alt />`;
        html += `<span>${embed.footer?.text}</span>`;
        html += '</div>';
      }
      if (embed.footer && embed.timestamp) html += `&nbsp;&bull;&nbsp;`;
      if (embed.timestamp) html += `<span>${moment(embed.timestamp).calendar()}</span>`;
      html += '</div>';
    }
    html += '</div>';
    this.classList.add(css({
      backgroundColor: '#2f3136', borderLeftColor: embed.color || '#202225', borderLeftStyle: 'solid', borderLeftWidth: '4px',
      borderRadius: '4px'
    }));
    this.innerHTML = html;
  }

}
