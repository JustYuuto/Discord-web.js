import Component from '../Component';
import { css } from '@emotion/css';
import { filesize } from 'filesize';

export default class MessageAttachment extends Component {

  connectedCallback() { // @ts-ignore
    const attachment: Attachment = JSON.parse(this.getAttribute('attachment'));
    let html = '';
    const width = Math.floor(attachment.width >= 900 ? attachment.width / 3 : attachment.width / 2);
    const height = Math.floor(attachment.height >= 900 ? attachment.height / 3 : attachment.height / 2);
    if (attachment.content_type.startsWith('image/')) {
      html += `<img src="${attachment.url}" alt="${attachment.filename}" class="${css({
        borderRadius: '.20rem', cursor: 'pointer'
      })}" height="${height}" />`;
    } else if (attachment.content_type.startsWith('video/')) {
      html += `<video controls preload="metadata" poster="${attachment.proxy_url}?format=jpeg&width=${width}&height=${Math.floor(height)}" class="${css({
        borderRadius: '.20rem'
      })}" height="${height}">`;
      html += `<source src="${attachment.url}" type="${attachment.content_type}" sizes="${attachment.width}x${attachment.height}" />`;
      html += `</video>`;
    } else {
      html += `<div class="${css({ display: 'flex', margin: 0, marginRight: '8px', padding: 0 })}">`;
      html += `<svg-icon icon="unknown_file" width="72" height="96" class="${css({
        width: '30px', height: '40px'
      })}"></svg-icon>`;
      html += `</div>`;
      html += `<div class="${css({ display: 'flex', flexDirection: 'column' })}">`;
      html += `<a href="${attachment.url}" download="${attachment.filename}" class="${css({ maxWidth: '500px' })}">${attachment.filename}</a>`;
      html += `<small>${filesize(attachment.size)}</small>`;
      html += `</div>`;
      html += `<div class="${css({
        display: 'flex', flexDirection: 'column', ':hover': { path: { fill: '#dcddde' } }
      })}">`;
      html += `<a href="${attachment.url}" download="${attachment.filename}" class="${css({
        display: 'flex', alignItems: 'center', paddingLeft: '10px'
      })}"><svg-icon icon="download" class="${css({ path: { fill: '#b9bbbe' } })}"></svg-icon></a>`;
      html += `</div>`;
      this.classList.add(css({
        backgroundColor: '#2f3136', padding: '10px', display: 'flex', alignItems: 'center', paddingLeft: '10px', borderRadius: '.25rem'
      }));
    }
    this.innerHTML = html;
  }

}
