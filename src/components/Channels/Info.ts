import Component from '../Component';
import { urlParts } from '../../helpers/url';
import { channel } from '../../helpers/api';

export default class ChannelInfo extends Component {

  connectedCallback() {
    channel(urlParts()[2]).then(channel => {
      console.log(channel);
    });
  }

}
