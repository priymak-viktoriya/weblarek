import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface HeaderState {
    counter: number;
}

export class Header extends Component<HeaderState> {
    protected counterNode: HTMLElement;
    protected cartButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.counterNode = ensureElement<HTMLElement>(
            '.header__basket-counter',
            this.container
        );
        this.cartButton = ensureElement<HTMLButtonElement>(
            '.header__basket',
            this.container
        );

        this.cartButton.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterNode.textContent = String(value);
    }
}
