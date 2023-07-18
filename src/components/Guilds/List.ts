import { guilds } from '../../helpers/api';
import { css } from '@emotion/css';
import { guildIconURL } from '../../helpers/image';

export default class GuildsList extends HTMLElement {

  connectedCallback() {
    guilds().then(guilds => {
      console.log(`Fetched ${guilds.length} guilds`);
      let html = '';
      guilds.forEach(guild => {
        const iconCss = css({
          borderRadius: '50%', userSelect: 'none', transition: '.2s', ':hover': { borderRadius: '.75rem' },
          width: '48px', height: '48px'
        });
        html += `<div class="${css({ marginTop: '4px', marginBottom: '4px' })}" title="${guild.name}" data-tooltip-position="right">`;
        html += `<a href="/channels/${guild.id}" class="${css({ ':hover': { textDecoration: 'none' } })}">`;
        if (!!guild.icon) {
          html += `<img src="${guildIconURL(guild.id, guild.icon, guild.icon.startsWith('a_'))}" alt="${guild.name}" class="${iconCss}" />`;
        } else {
          let iconText = '';
          guild.name.split(' ').forEach(w => iconText += w[0]);
          html += `<span class="${iconCss} ${css({
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#36393f',
            marginBottom: '6px', ':hover': { backgroundColor: '#5865f2' }
          })}">${iconText}</span>`;
        }
        html += '</a></div>';
      });
      this.classList.add(css({ display: 'block', padding: '10px 10px 0' }));
      this.innerHTML = html;
    });
  }

}
