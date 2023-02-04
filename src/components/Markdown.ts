import { urlParts } from '../helpers/url';
import { css } from '@emotion/css';
import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/atom-one-dark.css';
import Component from './Component';
import moment from 'moment';
import { emojiURL } from '../helpers/image';

export default class Markdown extends Component {

  connectedCallback() {
    let text = this.getOptionalAttribute('text', undefined);
    if (!text) return;
    const isEmbed = this.getOptionalAttribute('embed', false) === 'true';

    text = text.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    text = text.replaceAll('\n', '<br />');
    text = text.replaceAll('\\\\', '\\');
    text = text.replaceAll(
      this.regex('codeblock'),
      `<pre><code class="hljs $1 ${css({ whiteSpace: 'pre-wrap' })}">${hljs.highlightAuto('$2').value}</code></pre>`
    );
    text = text.replaceAll(this.regex('code'), '<code>$1</code>');
    text = text.replaceAll(this.regex('underline'), '<u>$1</u>');
    text = text.replaceAll(this.regex('bold_italic'), '<strong><em>$1</em></strong>');
    text = text.replaceAll(this.regex('bold_underline'), '<strong><u>$2</u></strong>');
    text = text.replaceAll(this.regex('italic_underline'), '<em><u>$1</u></em>');
    text = text.replaceAll(this.regex('striked'), '<s>$1</s>');
    text = text.replaceAll(this.regex('bold'), '<strong>$1</strong>');
    text = text.replaceAll(this.regex('bold_underline_italic'), '<strong><u><em>$1</em></u></strong>');
    text = text.replaceAll(this.regex('italic'), '<em>$1</em>');
    text = text.replaceAll(this.regex('blockquote'), '<blockquote>$1</blockquote>');
    text = isEmbed ?
      text.replaceAll(this.regex('link_with_text'), '<a href="$2" target="_blank">$1</a>') :
      text.replaceAll(this.regex('link'), '<a href="$1" target="_blank">$1</a>');
    text = text.replaceAll(this.regex('custom_emoji'), (_match: any, $1: any, name: string, id: string) => {
      const animated = $1 === 'a';
      return `<img src="${emojiURL(id, animated, 44, 'lossless')}" class="${css({
        cursor: 'pointer'
      })}" alt=":${name}:" title=":${name}:" draggable="false" data-emoji-popup='${JSON.stringify({
        id, animated, name
      })}' />`;
    });
    text = text.replaceAll(this.regex('channel'), `<channel-link id="$2"></channel-link>`);
    text = text.replaceAll(this.regex('user_mention'), '<user-mention id="$3"></user-mention>');
    text = text.replaceAll(this.regex('role_mention'), `<role-mention id="$3">@deleted-role</role-mention>`);
    text = text.replaceAll('@everyone', `<role-mention id="${urlParts()[1]}"></role-mention>`);
    text = text.replaceAll('@here', '<role-mention id="@here"></role-mention>');
    text = text.replaceAll(this.regex('timestamp'), (_match: any, $1: string, $2: string) => {
      const timestamp = Number($1) * 1000;
      let html = (time: string) => `<span class="${css({
        backgroundColor: '#42464d', borderRadius: '3px', padding: '0 2px', ':hover': { backgroundColor: '#3c4046' }
      })}" title="${moment(timestamp).format('LLLL')}">${time}</span>`;
      // https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa
      switch ($2) {
        case 't': // short time
          text = moment(timestamp).format('h:mm A'); break;
        case 'T': // long time
          text = moment(timestamp).format('h:mm:ss A'); break;
        case 'd': // short date
          text = moment(timestamp).format('MM/DD/YYYY'); break;
        case 'D': // long date
          text = moment(timestamp).format('MMMM D, YYYY'); break;
        case 'f': // short date/time
          text = moment(timestamp).format('MMMM D, YYYY h:mm A'); break;
        case 'F': // long date/time
          text = moment(timestamp).format('LLLL'); break;
        case 'R': // relative
          text = moment(timestamp).fromNow(); break;
      }
      return html(text);
    });

    this.classList.add(css({
      wordBreak: 'break-word', display: 'block'
    }));
    this.innerHTML = text + this.innerHTML;
  }

  regex(regex: string) {
    switch (regex) {
      case 'bold':
        return new RegExp(/\*{2}([^*]+)\*{2}/gi);
      case 'bold_underline':
        return new RegExp(/(\*{2}_{2}|_{2}\*{2})([^*]+)(\*{2}_{2}|_{2}\*{2})/gi);
      case 'bold_underline_italic':
        return new RegExp(/(\*{3}_{2}|_{2}\*{3})([^*]+)(\*{3}_{2}|_{2}\*{3})/gi);
      case 'italic':
        return new RegExp(/[*|_]([^*]+)[*|_]/gi);
      case 'striked':
        return new RegExp(/~~([^*]+)~~/gi);
      case 'italic_underline':
        return new RegExp(/\*_{2}|_{2}\*([^*]+)\*_{2}|_{2}\*/gi);
      case 'bold_italic':
        return new RegExp(/\*{3}([^*]+)\*{3}/gi);
      case 'underline':
        return new RegExp(/_{2}([^*]+)_{2}/gi);
      case 'codeblock':
        return new RegExp(/```([a-z]+)?\n?([^*]+)\n?```/gmi);
      case 'code':
        return new RegExp(/``?([^`*]+)``?/gi);
      case 'link':
        return new RegExp(/(http(s?):\/\/(([a-zA-Z0-9\.\-]+)\.)?([a-zA-Z0-9\-]+)\.([a-zA-Z0-9]{2,5})(\/([^*<>]+))?)/gi);
      case 'link_with_text':
        return new RegExp(/\[([^*]+)\]\((https?:\/\/[a-zA-Z0-9\.\-]+\.?[a-zA-Z0-9\-]+\.[a-zA-Z0-9]{2,5}\/?[^*<>]+?)+\)/gi);
      case 'blockquote':
        return new RegExp(/\n?&gt; ([^*]+)/gi);
      case 'channel':
        return new RegExp(/(<|&lt;)#([0-9]{18,19})(>|&gt;)/gi);
      case 'user_mention':
        return new RegExp(/(<|&lt;)@(!?)([0-9]{18,19})(>|&gt;)/gi);
      case 'role_mention':
        return new RegExp(/(<|&lt;)@(&|&amp;)([0-9]{18,19})(>|&gt;)/gi);
      case 'custom_emoji':
        return new RegExp(/&lt;(a?):([a-zA-Z0-9_]+):([0-9]{18,19})&gt;/gi);
      case 'timestamp':
        return new RegExp(/&lt;t:([0-9]+):([a-zA-Z])&gt;/gi);
      default:
        return new RegExp(/\*/g);
    }
  }

}
