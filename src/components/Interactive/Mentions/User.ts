import { user } from '../../../helpers/api';
import { css } from '@emotion/css';
import Component from '../../Component';

export default class UserMention extends Component {

    connectedCallback() {
        const userId = this.getAttribute('id');
        user(userId).then(user => {
            this.classList.add(css({
                backgroundColor: '#414675', borderRadius: '3px', padding: '0 2px', ':hover': {
                    backgroundColor: '#5865f2', textDecoration: 'underline'
                }, cursor: 'pointer', transition: '.1s'
            }));
            this.innerHTML = `@${user.username}`;
        });
    }

}
