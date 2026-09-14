import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type FormState = {
    valid: boolean;
    errors: string;
};

export abstract class Form<T> extends Component<FormState & T> {
    protected formNode: HTMLFormElement;
    protected confirmButton: HTMLButtonElement;
    protected errorNode: HTMLElement;

    constructor(events: IEvents, container: HTMLFormElement) {
        super(container);

        this.formNode = container;
        this.confirmButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            this.container
        );
        this.errorNode = ensureElement<HTMLElement>(
            '.form__errors',
            this.container
        );

        this.formNode.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit(`${this.formNode.name}:submit`);
        });

        this.formNode.addEventListener('input', (event) => {
            const target = event.target as HTMLInputElement;
            events.emit(`${this.formNode.name}:change`, {
                name: target.name,
                value: target.value,
            });
        });
    }

    set valid(value: boolean) {
        this.confirmButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorNode.textContent = value;
    }
}
