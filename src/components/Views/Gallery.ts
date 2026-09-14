import { Component } from '../base/Component';

type GalleryState = {
    catalog: HTMLElement[];
};

export class Gallery extends Component<GalleryState> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(items: HTMLElement[]) {
        this.container.innerHTML = '';
        this.container.append(...items);
    }
}
