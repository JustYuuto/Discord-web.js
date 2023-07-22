import Component from '../Component';
import { urlParts } from '../../helpers/url';
import { Channel, channel, ChannelType, DMChannel, guild } from '../../helpers/api';
import { css } from '@emotion/css';

export default class ChannelInfo extends Component {

  connectedCallback() {
    this.classList.add(css({
      width: '100%', display: 'flex', padding: '20px', height: '58px'
    }));
    let html = '';
    if (urlParts()[1] !== '@me') {
      guild(urlParts()[1]).then(guild => {
        html += `<div class="${css({
          width: '278px'
        })}">`;
        html += `<span>${guild.name}</span>`;
        html += `</div>`;
        // @ts-ignore
        channel(urlParts()[2]).then((channel: Channel) => {
          html += `<div>`;
          html += `<span>${channel.name}</span>`;
          if (channel.topic) {
            html += `<span>${channel.topic}</span>`;
          }
          html += `</div>`;
          this.innerHTML = html;
        });
      });
    } else if (urlParts()[1] === '@me' && urlParts()[2]) {
      html += `<div class="${css({
        width: '278px'
      })}">`;
      html += `<input type="text" class="${css({
        width: '90%'
      })}" />`;
      html += `</div>`;
      // @ts-ignore
      channel(urlParts()[2]).then((dm: DMChannel) => {
        html += `<div>`;
        html += `<span ${dm.type === ChannelType.GROUP_DM && 'contenteditable'}>${dm.name || dm.recipients[0].global_name || dm.recipients[0].display_name || dm.recipients[0].username}</span>`;
        html += `</div>`;
        this.innerHTML = html;
      });
    }
  }

}
