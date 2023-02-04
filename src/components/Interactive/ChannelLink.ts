import Component from '../Component';
import { Channel, channel } from '../../helpers/api';
import { css } from '@emotion/css';

export default class ChannelLink extends Component {

  connectedCallback() {
    const id = this.getAttribute('id'); // @ts-ignore
    channel(id).then((channel: Channel) => {
      this.outerHTML = `<a href="/channels/${channel.guild_id}/${channel.id}" class="${css({
        backgroundColor: '#414675', borderRadius: '3px', padding: '0 2px', cursor: 'pointer', transition: '.1s',
        color: '#fff', ':hover': { backgroundColor: '#5865f2', textDecoration: 'none' }
      })}"><svg-icon icon="channel" width="24" height="24" class="${css({
        width: '1.05rem', height: '1.3rem', position: 'relative', display: 'inline-flex', top: '4px', marginRight: '1px'
      })}"></svg-icon>${channel.name}</a>`;
    });
  }

}
