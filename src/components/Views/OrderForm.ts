import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';

type OrderFields = {
    payment: TPayment;
    address: string;
};

export class OrderForm extends Form<OrderFields> {
    protected cardNode: HTMLButtonElement;
    protected cashNode: HTMLButtonElement;
    protected addressNode: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);

        this.cardNode = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashNode = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressNode = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.cardNode.addEventListener('click', () => {
            events.emit('order:change', { name: 'payment', value: 'card' });
        });

        this.cashNode.addEventListener('click', () => {
            events.emit('order:change', { name: 'payment', value: 'cash' });
        });
    }

    set payment(value: TPayment) {
        this.cardNode.classList.toggle('button_alt-active', value === 'card');
        this.cashNode.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressNode.value = value;
    }
}
