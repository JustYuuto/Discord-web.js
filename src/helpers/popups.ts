import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { Emoji, emojiGuild, userProfile } from './api';
import { css } from '@emotion/css';
import { emojiURL, guildIconURL, userBannerURL } from './image';

export function initTitlePopups() { // @ts-ignore
  document.querySelectorAll('[title]').forEach(el => {
    let title: string;
    el.addEventListener('mouseover', () => {
      title = el.getAttribute('title') || '';
      el.removeAttribute('title');
    });
    el.addEventListener('mouseout', () => {
      el.setAttribute('title', title);
    }); // @ts-ignore
    return tippy(el, {
      placement: el.getAttribute('data-tooltip-position') || 'top', arrow: true, content: el.getAttribute('title'), theme: 'discord'
    });
  });
}

export function initUserPopups() { // @ts-ignore
  document.querySelectorAll('[data-user-popup]').forEach(el => { // @ts-ignore
    return tippy(el, {
      placement: 'right', arrow: false, content: 'Loading...', theme: 'discord', trigger: 'click',
      interactive: true, allowHTML: true, onShow: function (instance) {
        userProfile(el.getAttribute('data-user-popup') || '')
          .then(user => {
            let html = '';
            html += `<div class="${css({
              backgroundColor: `#${parseInt(user.user_profile?.accent_color?.toString(), 16)}`
            })}">`;
            html += `<div>`;
            html += `<div class="${css({
              width: '340px'
            })}">`;
            html += `<div style="${user.user_profile.banner ? `background-image: url(${userBannerURL(user.user.id, user.user_profile.banner, user.user_profile.banner?.startsWith('a_'))});` : ''} background-color: ${user.user.banner_color}" class="${css({
              width: '340px', height: '90px'
            })}"></div>`;
            html += `</div>`;
            html += `</div>`;
            html += `<div class="${css({ fontSize: '20px' })}">`;
            html += user.user.discriminator === '0' ?
              `<span>${user.user.global_name || user.user.display_name}</span><br><span class="${css({
                color: '#b9bbbe'
              })}">${user.user.username}</span>` :
              `<span>${user.user.username}</span><span class="${css({
                color: '#b9bbbe'
              })}">#${user.user.discriminator}</span>`;
            html += `</div>`;
            html += `</div>`;
            instance.setContent(html);
          })
          .catch((error) => {
            instance.setContent(`Request failed: ${error}`);
          });
      },
    });
  });
}

export function initEmojisPopups() { // @ts-ignore
  document.querySelectorAll('[data-emoji-popup]').forEach(el => { // @ts-ignore
    const emoji: Emoji = JSON.parse(el.getAttribute('data-emoji-popup'));
    return tippy(el, {
      placement: 'right', arrow: false, content: 'Loading...', theme: 'discord__emoji', trigger: 'click',
      interactive: true, allowHTML: true, onShow: function (instance) { // @ts-ignore
        emojiGuild(emoji.id)
          .then(guild => {
            let html = `<div class="${css({
              padding: '3px'
            })}">`;
            html += `<div class="${css({
              display: 'flex', gap: '15px', alignItems: 'center', paddingBottom: '8px', backgroundColor: '#18191c',
              borderTopLeftRadius: '4px', borderTopRightRadius: '4px'
            })}">`;
            html += `<img src="${emojiURL(emoji.id, emoji.animated, 48)}" alt=":${emoji.name}:" class="${css({
              width: '3rem', height: '3rem'
            })}" draggable="false" />`;
            html += `<div class="${css({
              display: 'flex', flexDirection: 'column'
            })}">`;
            html += `<span class="${css({ fontWeight: 600 })}">:${emoji.name}:</span>`;
            html += `<span>This emoji is from one of your servers. Type its name in the chat bar to use it.</span>`;
            html += `</div>`;
            html += `</div>`;
            html += `<div class="${css({
              backgroundColor: '#292b2f', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px'
            })}">`;
            html += `<span class="${css({
              fontWeight: 700, textTransform: 'uppercase', color: '#a7a8ac'
            })}">This emoji is from</span>`;
            html += `<div class="${css({ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' })}">`;
            html += `<img src="${guildIconURL(guild.id, guild.icon, guild.icon.startsWith('a_'), 32)}" alt=":${emoji.name}:" class="${css({
              width: '32px', height: '32px', borderRadius: '.5rem'
            })}" draggable="false" />`;
            html += `<div class="${css({
              display: 'flex', flexDirection: 'column'
            })}">`;
            html += `<span class="${css({ fontWeight: 600 })}">${guild.name}</span>`;
            html += `<span>${guild.approximate_presence_count} Online &bull; Public Server</span>`;
            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            instance.setContent(html);
          })
          .catch((error) => {
            instance.setContent(`Request failed: ${error}`);
          });
      },
    });
  });
}

export function initPopups() {
  initTitlePopups();
  initUserPopups();
  initEmojisPopups();
}
