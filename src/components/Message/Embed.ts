import Component from '../Component';
import { css } from '@emotion/css';
import moment from 'moment';
import { Embed } from '../../helpers/api';

export default class MessageEmbed extends Component {

  connectedCallback() {
    const embed: Embed = JSON.parse(this.getAttribute('embed'));
    let html = '<div>';
    if (embed.author && embed.author?.icon_url) {
      html += `<div class="${css({
        display: 'flex', alignItems: 'center', padding: '12px 12px 0 12px', fontSize: '.875rem', gap: '7px'
      })}">`;
      html += `<img src="${embed.author?.proxy_icon_url}" class="${css({ width: '24px', height: '24px', borderRadius: '9999px' })}" alt />`;
      if (embed.author.url) {
        html += `<a class="${css({ color: '#fff' })}" href="${embed.author.url}" target="_blank">${embed.author.name}</a>`;
      } else {
        html += `<span>${embed.author.name}</span>`;
      }
      html += '</div>';
    }
    html += `<div class="${css({ display: 'grid', padding: '12px' })}">`;
    if (embed.title) {
      if (embed.url) html += `<a href="${embed.url}" target="_blank">`;
      html += `<markdown-text text="${embed.title?.replaceAll('"', '&quot;')}" class="${css({ fontSize: '16px', fontWeight: 600 })}"></markdown-text>`;
      if (embed.url) html += `</a>`;
    }
    if (embed.description) html +=
      `<markdown-text text="${embed.description?.replaceAll('"', '&quot;')}" class="${css({ fontSize: '.875rem', fontWeight: 400, marginTop: '2px' })}" embed="true"></markdown-text>`;
    html += '</div>';
    if (embed.fields) {
      html += `<div class="${css({
        padding: '0 12px 12px 12px'
      })}">`;
      embed.fields.forEach(embed => {
        html += `<div class="${css({
          display: 'flex', flexDirection: 'column', '&:not(:first-of-type)': {
            paddingTop: '8px'
          }
        })}">`;
        html += `<span class="${css({ fontWeight: 800 })}">${embed.name}</span>`;
        html += `<markdown-text text="${embed.value}"></markdown-text>`;
        html += `</div>`;
      });
      html += `</div>`;
    }
    if (embed.footer || embed.timestamp) {
      html += `<div class="${css({
        display: 'flex', alignItems: 'center', padding: '0 12px 12px 12px', fontSize: '.75rem'
      })}">`;
      if (embed.footer && embed.footer.text) {
        html += `<div class="${css({ display: 'flex', alignItems: 'center', gap: '7px' })}">`;
        if (embed.footer.icon_url)
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
      backgroundColor: '#2f3136', borderLeftColor: '#' + embed.color || '#202225', borderLeftStyle: 'solid',
      borderLeftWidth: '4px', borderRadius: '4px'
    }));
    this.innerHTML = html;
  }

}
