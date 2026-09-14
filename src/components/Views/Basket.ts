import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type BasketState = {
    items: HTMLElement[];
    total: number;
};

export class Basket extends Component<BasketState> {
    protected listNode: HTMLElement;
    protected sumNode: HTMLElement;
    protected checkoutNode: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.listNode = ensureElement<HTMLElement>('.basket__list', this.container);
        this.sumNode = ensureElement<HTMLElement>('.basket__price', this.container);
        this.checkoutNode = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.checkoutNode.addEventListener('click', () => {
            events.emit('basket:submit');
        });
    }

    set items(value: HTMLElement[]) {
        this.listNode.replaceChildren(...value);
    }

    set total(value: number) {
        this.sumNode.textContent = `${value} синапсов`;
    }

    set isEmpty(value: boolean) {
        this.checkoutNode.disabled = value;
    }
}
