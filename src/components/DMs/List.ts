import { dms } from '../../helpers/api';
import { css } from '@emotion/css';
import Component from '../Component';
import { avatarImgHTML, avatarURL, groupAvatarURL } from '../../helpers/image';

export default class DMsList extends Component {

    connectedCallback() {
        dms().then(dms => {
            let html = '';
            dms.forEach(dm => {
                const channelLinkAndCatCss = css({ color: '#96989d', display: 'flex', cursor: 'pointer', overflow: 'hidden' });
                html += `<div class="${css({ marginTop: '4px', marginBottom: '4px', display: 'flex' })}">`;
                html += `<a href="/channels/@me/${dm.id}" class="${css([
                    { '> *': { margin: '6px' }, width: '100%', ':hover': {
                        textDecoration: 'none', backgroundColor: '#3c3f45', color: '#fff'
                    } }, channelLinkAndCatCss
                ])}">`;
                html += `<div class="${css({ display: 'flex', alignItems: 'center' })}">`;
                if (dm.type === 3) { // @ts-ignore
                    html += avatarImgHTML(groupAvatarURL(dm.id, dm.icon), 32);
                } else {
                    const recipient = dm.recipients[0];
                    html += avatarImgHTML(avatarURL(recipient.id, recipient.avatar, recipient.discriminator, 32), 32);
                }
                html += `</div>`;
                html += `<div class="${css({ display: 'flex', flexDirection: 'column', justifyContent: 'center' })}">`;
                html += `<div class="${css({
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                })}">${dm.name || dm.recipients[0].username}</div>`;
                dm.type === 3 && (html += `<div class="${css({
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                })}">${dm.recipients.length + 1} members</div>`);
                html += `</div>`;
                html += `</a>`;
                html += `</div>`;
            });
            this.classList.add(css({
                width: '282px', minWidth: '282px', height: '100vh', padding: '10px 10px 0', overflow: 'hidden scroll',
                backgroundColor: '#2f3136'
            }));
            this.innerHTML = html;
        });
    }

}
