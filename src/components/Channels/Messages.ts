import { channelMessages } from '../../helpers/api';
import { css } from '@emotion/css';
import { urlParts } from '../../helpers/url';
import moment from 'moment';

export default class ChannelMessages extends HTMLElement {

    connectedCallback() {
        channelMessages(urlParts()[2]).then(messages => {
            let html = '';
            html += `<div class="${css({ height: '100vh', overflow: 'hidden scroll' })}">`;
            messages.forEach(message => {
                const messageActions = [];
                messageActions.push({ icon: 'reply', text: 'Reply' });
                messageActions.push({ icon: 'id', text: 'Copy ID' });
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
                html += `<img src="https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=48" 
                              draggable="false" alt="" class="${css({
                                  marginRight: '8px', borderRadius: '9999px', width: '48px', height: '48px'
                              })}" />`;
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
                    html += `<div class="${css({ display: 'flex', gap: '5px' })}">`;
                    html += message.reactions.map(reaction => {
                        const reactionCss = css({
                            cursor: 'pointer', padding: '4px 6px', borderStyle: 'solid', borderColor: 'rgba(0,0,0,0)', borderWidth: '1px',
                            borderRadius: '.25rem', userSelect: 'none', ':hover': { borderColor: '#4f5257' }, backgroundColor: '#2f3136'
                        }, reaction.me && { backgroundColor: '#3b405a', borderColor: '#5561e3', ':hover': { borderColor: '#5561e3' } });
                        let html = `<div class="${reactionCss}">`;
                        html += `${reaction.emoji.id ? `<img src="https://cdn.discordapp.com/emojis/${reaction.emoji.id}.${reaction.emoji.animated ? 'gif' : 'png'}?size=16" alt="" draggable="false" />` : reaction.emoji.name}&nbsp;${reaction.count}`;
                        html += '</div>';
                        document.addEventListener('DOMContentLoaded', () => {
                            console.log(reactionCss)
                            console.log(this.querySelector(`.${reactionCss}`))
                            this.querySelectorAll(`.${reactionCss}`).forEach(e => e.addEventListener('click', (e) => {
                                console.log(e);
                            }));
                        })
                        return html;
                    }).join('');
                    html += `</div>`;
                }
                html += `</div>`;
                html += `<div class="${messageActionsCss}">`;
                html += messageActions.map(action => {
                    return `<div class="${css({
                        padding: '5px', margin: 0, backgroundColor: '#36393f', height: '28px', width: '28px',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                        ':hover': { backgroundColor: '#40444b' }
                    })}"><svg-icon icon="${action.icon}" width="20" height="20" class="${css({ margin: 0, padding: 0 })}"></svg-icon></div>`;
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
