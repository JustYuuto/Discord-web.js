import Component from '../Component';
import { css } from '@emotion/css';

export default class MessageAction extends Component {

    connectedCallback() {
        const icon = this.getAttribute('icon');
        const text = this.getAttribute('text');
        const onClick = this.getAttribute('on-click');
        const actionCss = css({
            padding: '5px', margin: 0, backgroundColor: '#36393f', height: '28px', width: '28px',
            display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
            ':hover': { backgroundColor: '#40444b' }
        });
        this.setAttribute('aria-label', text);
        this.setAttribute('role', 'button');
        this.classList.add(actionCss);
        this.innerHTML = `<svg-icon icon="${icon}" width="20" height="20" class="${css({ margin: 0, padding: 0 })}"></svg-icon>`;
        this.addEventListener('click', () => eval(onClick));
    }

}
