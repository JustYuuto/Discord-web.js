import { ArrayCSSInterpolation, ComponentSelector, css, CSSObject } from '@emotion/css';
import { SerializedStyles } from '@emotion/utils';

export function defaultAvatarURL(discriminator: number, size?: number) {
    return `https://cdn.discordapp.com/embed/avatars/${discriminator % 5}.png${size ? `?size=${size}` : ''}`;
}

export function avatarURL(id: number, avatar: string, discriminator: number, size?: number) {
    return avatar ?
        `https://cdn.discordapp.com/avatars/${id}/${avatar}.png${size ? `?size=${size}` : ''}` :
        defaultAvatarURL(discriminator, size);
}

export function groupAvatarURL(id: number, icon: string, size?: number) {
    return icon ?
        `https://cdn.discordapp.com/channel-icons/${id}/${icon}.png${size ? `?size=${size}` : ''}` : // assets/f7e38ac976a2a696161c923502a8345b.png
        defaultAvatarURL(0, size);
}

export function avatarImgHTML(url: string, sizes?: number, customCss?: ComponentSelector | SerializedStyles | CSSObject | ArrayCSSInterpolation) {
    return `<img src="${url}" draggable="false" alt="" class="${css({
        borderRadius: '9999px', width: sizes || '48px', height: sizes || '48px'
    }, customCss)}" />`;
}

export function emojiURL(id: number, animated: boolean, size: number = 16) {
    return `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}${size ? `?size=${size}` : ''}`;
}
