import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type SuccessState = {
    total: number;
};

export class Success extends Component<SuccessState> {
    protected infoNode: HTMLElement;
    protected finishButton: HTMLButtonElement;

    constructor(events: IEvents, container: HTMLElement) {
        super(container);

        this.infoNode = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.finishButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.finishButton.addEventListener('click', () => {
            events.emit('success:close');
        });
    }

    set total(value: number) {
        this.infoNode.textContent = `Списано ${value} синапсов`;
    }
}
