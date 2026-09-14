import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { ICardActions } from '../../types';

type BasketFields = {
    index: number;
};

export class CardBasket extends Card<BasketFields> {
    protected positionNode: HTMLElement;
    protected removeButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.positionNode = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.removeButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) {
            this.removeButton.addEventListener('click', actions.onDelete);
        }
    }

    set index(value: number) {
        this.positionNode.textContent = String(value);
    }
}
