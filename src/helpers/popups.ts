import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

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
