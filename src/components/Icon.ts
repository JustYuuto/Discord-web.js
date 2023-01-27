import Component from './Component';

export default class Icon extends Component {

    connectedCallback() {
        const icon = this.getAttribute('icon');
        const width = this.getOptionalAttribute('width', 24);
        const height = this.getOptionalAttribute('height', 24);
        const tag = new DOMParser().parseFromString(this.outerHTML, 'text/html').querySelector('svg-icon');
        let html = `<svg width="${width}px" height="${height}px" viewBox="0 0 24 24" class="${tag?.getAttribute('class')}">`;
        switch (icon) {
            case 'reply':
                html += `<path d="M10 8.26667V4L3 11.4667L10 18.9333V14.56C15 14.56 18.5 16.2667 21 20C20 14.6667 17 9.33333 10 8.26667Z" fill="currentColor" />`;
                break;
            case 'id':
                html += `<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V5C22 3.34315 20.6569 2 19 2H5ZM8.79741 7.72V16H6.74541V7.72H8.79741ZM13.2097 7.72C16.0897 7.72 17.5897 9.388 17.5897 11.848C17.5897 14.308 16.0537 16 13.2577 16H10.3537V7.72H13.2097ZM13.1497 14.404C14.6137 14.404 15.5257 13.636 15.5257 11.86C15.5257 10.12 14.5537 9.316 13.1497 9.316H12.4057V14.404H13.1497Z" />`;
                break;
            default:
                break;
        }
        html += '</svg>';
        this.outerHTML = html;
    }

}
