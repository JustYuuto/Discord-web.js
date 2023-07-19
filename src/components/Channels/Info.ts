import Component from '../Component';
import { urlParts } from '../../helpers/url';
import { Channel, channel, guild } from '../../helpers/api';
import { css } from '@emotion/css';

export default class ChannelInfo extends Component {

  connectedCallback() {
    this.classList.add(css({
      width: '100%', display: 'flex', padding: '20px', height: '58px'
    }));
    let html = '';
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
  }

}
