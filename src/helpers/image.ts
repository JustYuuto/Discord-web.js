import { ArrayCSSInterpolation, ComponentSelector, css, CSSObject } from '@emotion/css';
import { SerializedStyles } from '@emotion/utils';
import { Emoji } from './api';

export function defaultAvatarURL(discriminator: string, size?: number) {
  return `https://cdn.discordapp.com/embed/avatars/${parseInt(discriminator) % 5}.png${size ? `?size=${size}` : ''}`;
}

export function avatarURL(id: number, avatar: string, discriminator: string, size?: number) {
  return avatar ?
    `https://cdn.discordapp.com/avatars/${id}/${avatar}.png${size ? `?size=${size}` : ''}` :
    defaultAvatarURL(discriminator, size);
}

export function groupAvatarURL(id: number, icon: string, size?: number) {
  return icon ?
    `https://cdn.discordapp.com/channel-icons/${id}/${icon}.png${size ? `?size=${size}` : ''}` : // assets/f7e38ac976a2a696161c923502a8345b.png
    defaultAvatarURL('0', size);
}

export function avatarImgHTML(url: string, sizes?: number, customCss?: ComponentSelector | SerializedStyles | CSSObject | ArrayCSSInterpolation) {
  return `<img src="${url}" draggable="false" alt="" class="${css({
    borderRadius: '9999px', width: sizes || '48px', height: sizes || '48px'
  }, customCss)}" />`;
}

export function emojiURL(id: number | string, animated: boolean, size?: number, quality?: Emoji['quality']) {
  const params = new URLSearchParams();
  params.append('size', (size || 16).toString());
  params.append('quality', quality || 'lossless');
  return `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}?${params}`;
}

export function guildIconURL(id: number | string, icon: string, animated: boolean, size?: number) {
  const params = new URLSearchParams();
  params.append('size', (size || 48).toString());
  return `https://cdn.discordapp.com/icons/${id}/${icon}.${animated ? 'gif' : 'png'}?${params}`;
}

export function userBannerURL(id: number | string, banner: string, animated: boolean, size?: number) {
  const params = new URLSearchParams();
  params.append('size', (size || 480).toString());
  return `https://cdn.discordapp.com/banners/${id}/${banner}.${animated ? 'gif' : 'png'}?${params}`;
}

export function userBannerHTML(url: string, width?: number, height?: number, customCss?: ComponentSelector | SerializedStyles | CSSObject | ArrayCSSInterpolation) {
  return `<img src="${url}" draggable="false" alt="" class="${css({
    width: width || '480px', height: height || '120px', minHeight: height || '120px'
  }, customCss)}" />`;
}
