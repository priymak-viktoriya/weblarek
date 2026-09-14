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
        if (value.length) {
            this.listNode.replaceChildren(...value);
        } else {
            this.listNode.replaceChildren();
            const empty = document.createElement('p');
            empty.textContent = 'Корзина пуста';
            this.listNode.append(empty);
        }
    }

    set total(value: number) {
        this.sumNode.textContent = `${value} синапсов`;
    }

    set isEmpty(value: boolean) {
        this.checkoutNode.disabled = value;
    }
}
