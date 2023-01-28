import { css } from '@emotion/css';
import { addReaction, removeReaction } from '../../helpers/api';
import Component from '../Component';
import {emojiURL} from "../../helpers/image";

export default class MessageReaction extends Component {

    connectedCallback() {
        let me = this.getAttribute('me') === 'true';
        const messageId = this.getAttribute('message-id');
        let count = Number(this.getAttribute('count')); // @ts-ignore
        const emoji: Emoji = JSON.parse(this.getAttribute('emoji'));
        const meCss = css({
            backgroundColor: '#3b405a !important', borderColor: '#5561e3 !important', ':hover': { borderColor: '#5561e3' }
        });
        const reactionCss = css({
            cursor: 'pointer', padding: '4px 6px', borderStyle: 'solid', borderColor: 'rgba(0,0,0,0)', borderWidth: '1px',
            borderRadius: '.25rem', userSelect: 'none', ':hover': { borderColor: '#4f5257' }, backgroundColor: '#2f3136',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });
        this.classList.add(reactionCss);
        me && this.classList.add(meCss);
        this.innerHTML = `${emoji.id ? `<img src="https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?size=16" alt="" draggable="false" class="${css({
            width: '16px', height: '16px'
        })}" />` : emoji.name}&nbsp;${count}`;
        this.addEventListener('click', async () => {
            const emojiName = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;
            if (!me) {
                await addReaction(messageId, emojiName).then(() => {
                    this.classList.add(meCss);
                    count++;
                    me = true;
                    const emojiHTML = emoji.id ? `<img src="${emojiURL(emoji.id, emoji.animated)}" alt="" draggable="false" />` : emoji.name;
                    this.innerHTML = `${emojiHTML}&nbsp;${count}`;
                });
            } else {
                await removeReaction(messageId, emojiName).then(() => {
                    this.classList.remove(meCss);
                    count--;
                    me = false;
                    if (count === 0) {
                        this.remove();
                    } else {
                        const emojiHTML = emoji.id ? `<img src="${emojiURL(emoji.id, emoji.animated)}" alt="" draggable="false" />` : emoji.name;
                        this.innerHTML = `${emojiHTML}&nbsp;${count}`;
                    }
                });
            }
        });
    }

}
