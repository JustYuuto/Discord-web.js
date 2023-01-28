import { channelMessages } from '../../helpers/api';
import { css } from '@emotion/css';
import { urlParts } from '../../helpers/url';
import moment from 'moment';
import { avatarImgHTML, avatarURL } from '../../helpers/image';

export default class ChannelMessages extends HTMLElement {

    connectedCallback() {
        channelMessages(urlParts()[2]).then(messages => {
            let html = '';
            html += `<div class="${css({ height: '100vh', overflow: 'hidden scroll' })}">`;
            messages.forEach(message => {
                const messageActions = [];
                messageActions.push({ icon: 'reply', text: 'Reply' });
                messageActions.push({ icon: 'id', text: 'Copy ID', onClick: `copyText("${message.id}")` });
                const mentionned = (message.mention_everyone || typeof message.mentions.find(u => u.id === message.author.id) !== 'undefined');
                const messageActionsCss = css({ display: 'none', '> :first-of-type': {
                        borderBottomLeftRadius: '0.25rem', borderTopLeftRadius: '0.25rem'
                    }, '> :last-of-type': {
                        borderBottomRightRadius: '0.25rem', borderTopRightRadius: '0.25rem'
                    }, borderColor: '#2f3237', borderWidth: '1px', borderStyle: 'solid' });
                html += `<div class="${css([{
                    display: 'flex', padding: '5px 15px', margin: '10px 0', position: 'relative', 
                    ':hover': { 
                        backgroundColor: mentionned ? 'rgba(75,68,59,0.7)' : '#32353b',
                        [`.${messageActionsCss}`]: {
                            position: 'absolute', right: '20px', top: '-13px', display: 'flex'
                        }
                    },
                }, mentionned && { backgroundColor: '#4b443b' }])}">`;
                html += avatarImgHTML(
                    avatarURL(message.author.id, message.author.avatar, message.author.discriminator, 48), 48,
                    { marginRight: '8px' }
                );
                html += `<div>`;
                html += `<div class="${css({
                    marginBottom: '5px', display: 'flex', alignItems: 'center',
                    '*': { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
                })}">`;
                html += `<span>${message.author.username}</span>&nbsp;`;
                html += `<small>${moment(message.timestamp).format('DD/MM/YYYY [at] HH:mm:ss')}${message.edited_timestamp ? `&nbsp;(edited ${moment(message.edited_timestamp).format('DD/MM/YYYY [at] HH:mm:ss')})` : ''}</small>`;
                html += `</div>`;
                html += `<div class="${css({ width: 'fit-content' })}">`;
                html += `<markdown-text>${message.content.replaceAll('"', '&quot;').replaceAll('<', '&lt;')}</markdown-text>`;
                if (message.reactions && message.reactions.length !== 0) {
                    html += `<div class="${css({ display: 'flex', gap: '5px', marginTop: '5px' })}">`;
                    html += message.reactions
                        .map(reaction =>
                            `<message-reaction me="${reaction.me}" count="${reaction.count}" emoji='${JSON.stringify(reaction.emoji)}' message-id="${message.id}"></message-reaction>`)
                        .join('');
                    html += `</div>`;
                }
                html += `</div>`;
                html += `<div class="${messageActionsCss}">`;
                html += messageActions.map(action => {
                    return `<message-action icon="${action.icon}" text="${action.text}" on-click='${action.onClick?.toString()}'></message-action>`;
                }).join('');
                html += `</div>`;
                html += `</div>`;
                html += `</div>`;
            });
            html += `</div>`;
            this.classList.add(css({
                width: 'calc(100% - 282px)', height: '100%', backgroundColor: '#36393f', color: 'white', position: 'relative'
            }));
            this.innerHTML = html;
        });
    }

}
