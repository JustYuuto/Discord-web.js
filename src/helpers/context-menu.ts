import { css } from '@emotion/css';

declare type Items = Item[];

declare interface Item {
  label: string,
  icon?: string,
  danger?: boolean,
  type?: ItemType,
  onClick: (e: Event) => void
}

declare enum ItemType {
  'DEFAULT'
}

export default function showContextMenu(items: Items, x: number, y: number) {
  document.querySelectorAll('#ctx-menu').forEach(i => i.remove());
  let html = '';
  items.forEach(item => {
    html += `<div aria-label="${item.label}">`;
    html += `<div>`;
    html += `<span>${item.label}</span>`;
    html += `</div>`;
    html += `<div>`;
    html += `</div>`;
    html += `</div>`;
  });

  const menu = document.createElement('div');
  menu.setAttribute('id', 'ctx-menu');
  menu.innerHTML = html;
  menu.classList.add(css({
    position: 'absolute', top: y, left: x
  }));
  items.forEach(item => {
    menu.querySelector(`div[aria-label="${item.label}"]`)?.addEventListener('click', (e) => {
      menu.remove();
      item.onClick(e);
    });
  })
  document.body.appendChild(menu);
}
