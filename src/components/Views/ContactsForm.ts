import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type ContactsFields = {
    email: string;
    phone: string;
};

export class ContactsForm extends Form<ContactsFields> {
    protected emailNode: HTMLInputElement;
    protected phoneNode: HTMLInputElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);

        this.emailNode = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneNode = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    }

    set email(value: string) {
        this.emailNode.value = value;
    }

    set phone(value: string) {
        this.phoneNode.value = value;
    }
}
