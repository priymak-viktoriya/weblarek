import { IBuyer, TPayment, TBuyerError } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private payment: TPayment = null;
    private address: string = '';
    private email: string = '';
    private phone: string = '';
    private eventBus: IEvents;

    constructor(events: IEvents) {
        this.eventBus = events;
    }

    private notify(field: keyof IBuyer | null): void {
        this.eventBus.emit('buyer:changed', { field });
    }

    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.notify('payment');
    }

    setAddress(address: string): void {
        this.address = address;
        this.notify('address');
    }

    setEmail(email: string): void {
        this.email = email;
        this.notify('email');
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.notify('phone');
    }

    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
        this.notify(null);
    }

    validate(): TBuyerError {
        const errors: TBuyerError = {};

        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}
