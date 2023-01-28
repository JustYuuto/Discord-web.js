import { urlParts } from '../helpers/url';
import { css } from '@emotion/css';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.css';
import Component from './Component';

export default class Markdown extends Component {

    connectedCallback() {
        let text = this.innerHTML;
        const isEmbed = this.getOptionalAttribute('embed', false);
        console.log(text)

        text = text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
        text = text.replaceAll('\n', '<br />');
        text = text.replaceAll('\\\\', '\\');
        text = text.replaceAll(
            this.regex('codeblock'),
            `<pre><code class="hljs language-$1 ${css({ whiteSpace: 'pre-wrap' })}">${hljs.highlightAuto('$3').value}</code></pre>`
        );
        text = text.replaceAll(this.regex('code'), '<code>$1</code>');
        text = text.replaceAll(this.regex('bold_underline'), '<strong><u>$2</u></strong>');
        text = text.replaceAll(this.regex('italic_underline'), '<em><u>$2</u></em>');
        text = text.replaceAll(this.regex('bold'), '<strong>$1</strong>');
        text = text.replaceAll(this.regex('bold_underline_italic'), '<strong><u><em>$1</em></u></strong>');
        text = text.replaceAll(this.regex('bold_italic'), '<strong><em>$1</em></strong>');
        text = text.replaceAll(this.regex('italic'), '<em>$1</em>');
        text = text.replaceAll(this.regex('underline'), '<u>$1</u>');
        text = text.replaceAll(this.regex('blockquote'), '<blockquote>$1</blockquote>');
        text = isEmbed ?
            text.replaceAll(this.regex('link_with_text'), '<a href="http$2://$3$5.$6/$7" target="_blank">$1</a>') :
            text.replaceAll(this.regex('link'), '<a href="$1" target="_blank">$1</a>');
        text = text.replaceAll(this.regex('custom_emoji'), (_match, $1: string, $2: string, $3: string) => {
            return `<img src="https://cdn.discordapp.com/emojis/${$3}.${$1 === 'a' ? 'gif' : 'png'}?size=44&quality=lossless" alt=":${$2}:" title=":${$2}:" draggable="false" />`;
        });
        text = text.replaceAll(this.regex('channel'), `<a href="/channels/${urlParts()[1]}/$2">#aa</a>`);
        text = text.replaceAll(this.regex('user_mention'), '<user-mention id="$3"></user-mention>');
        text = text.replaceAll(this.regex('role_mention'), `<role-mention id="$3"></role-mention>`);
        text = text.replaceAll('@everyone', `<role-mention id="${urlParts()[1]}"></role-mention>`);
        text = text.replaceAll('@here', '<role-mention id="@here"></role-mention>');
        console.log(text)
        console.log('-----------------------------------------------------');

        this.classList.add(css({
            wordBreak: 'break-word', display: 'block'
        }));
        this.innerHTML = text;
    }

    regex(regex: string) {
        switch(regex) {
            case 'bold':
                return new RegExp(/\*{2}([^*]+)\*{2}/gi);
            case 'bold_underline':
                return new RegExp(/(\*{2}_{2}|_{2}\*{2})([^*]+)(\*{2}_{2}|_{2}\*{2})/gi);
            case 'bold_underline_italic':
                return new RegExp(/(\*{3}_{2}|_{2}\*{3})([^*]+)(\*{3}_{2}|_{2}\*{3})/gi);
            case 'italic':
                return new RegExp(/\*([^*]+)\*|_([^*]+)_/gi);
            case 'italic_underline':
                return new RegExp(/(\*{1}_{2}|_{2}\*{1})([^*]+)(\*{1}_{2}|_{2}\*{1})/gi);
            case 'bold_italic':
                return new RegExp(/(\*{3}([^*]+)\*{3})/gi);
            case 'underline':
                return new RegExp(/_{2}([^*]+)_{2}/gi);
            case 'codeblock':
                return new RegExp(/\`{3}([a-z]+)([\n]?)([^*]+)([\n]?)\`{3}/gmi);
            case 'code':
                return new RegExp(/``?([^`*]+)``?/gi);
            case 'link':
                return new RegExp(/(http(s?):\/\/(([a-zA-Z0-9\.\-]+)\.)?([a-zA-Z0-9\-]+)\.([a-zA-Z0-9]{2,5})(\/([^*<>]+))?)/gi);
            case 'link_with_text':
                return new RegExp(/\[([^*]+)\]\(http(s?):\/\/(([a-zA-Z0-9\.\-]+)\.)?([a-zA-Z0-9\-]+)\.([a-zA-Z0-9]{2,5})\/([^*]+)\)/gi);
            case 'blockquote':
                return new RegExp(/\n?> ([^*]+)/gi);
            case 'channel':
                return new RegExp(/(<|&lt;)#([0-9]{18,19})(>|&gt;)/gi);
            case 'user_mention':
                return new RegExp(/(<|&lt;)@(!?)([0-9]{18,19})(>|&gt;)/gi);
            case 'role_mention':
                return new RegExp(/(<|&lt;)@(&|&amp;)([0-9]{18,19})(>|&gt;)/gi);
            case 'custom_emoji':
                return new RegExp(/&lt;(a?):([a-zA-Z0-9_]+):([0-9]{18,19})&gt;/gi);
            default:
                return new RegExp(/\*/g);
        }
    }

}
