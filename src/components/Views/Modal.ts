import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ModalState {
    content: HTMLElement;
}

export class Modal extends Component<ModalState> {
    protected body: HTMLElement;
    protected dismissButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.body = ensureElement<HTMLElement>('.modal__content', this.container);
        this.dismissButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.dismissButton.addEventListener('click', () => this.close());

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this.body.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}
