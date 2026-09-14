import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

export type CardBase = Pick<IProduct, 'title' | 'price'>;

export abstract class Card<T> extends Component<CardBase & T> {
    protected nameElement: HTMLElement;
    protected costElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.nameElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.costElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.nameElement.textContent = value;
    }

    set price(value: number | null) {
        this.costElement.textContent = value === null
            ? 'Бесценно'
            : `${value} синапсов`;
    }
}
