import { css } from '@emotion/css';

export default class GuildsListButton extends HTMLElement {

    connectedCallback() {
        const icon = this.getAttribute('button');
        let html = '';
        html += `<div class="${css({
                     width: '48px', height: '48px', backgroundColor: '#36393f', display: 'flex', alignItems: 'center',
                     justifyContent: 'center', borderRadius: '50%', userSelect: 'none', transition: '.2s',
                     '&:hover': { borderRadius: '.75rem', backgroundColor: '#3ba55d', path: { fill: 'white' } }
                 })}">`;
        if (icon === 'join-guild') {
            html += `<svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#3ba55d" d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z" />
                    </svg>`;
        } else if (icon === 'discovery') {
            html += `<svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="#3ba55d" d="M12 10.9C11.39 10.9 10.9 11.39 10.9 12C10.9 12.61 11.39 13.1 12 13.1C12.61 13.1 13.1 12.61 13.1 12C13.1 11.39 12.61 10.9 12 10.9ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.19 14.19L6 18L9.81 9.81L18 6L14.19 14.19Z" />
                    </svg>`;
        }
        html += `</div>`;
        this.classList.add(css({
            width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: '6px', marginBottom: '6px', cursor: 'pointer'
        }));
        this.innerHTML = html;
    }

}
