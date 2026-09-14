import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { IProduct, ICardActions } from '../../types';

type PreviewFields = Pick<IProduct, 'category' | 'image' | 'description'>;

export class CardPreview extends Card<PreviewFields> {
    protected categoryNode: HTMLElement;
    protected imageNode: HTMLImageElement;
    protected textNode: HTMLElement;
    protected actionButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryNode = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageNode = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.textNode = ensureElement<HTMLElement>('.card__text', this.container);
        this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (actions?.onButtonClick) {
            this.actionButton.addEventListener('click', actions.onButtonClick);
        }
    }

    set category(value: string) {
        this.categoryNode.textContent = value;

        for (const modifier of Object.values(categoryMap)) {
            this.categoryNode.classList.remove(modifier);
        }

        const modifier = categoryMap[value as keyof typeof categoryMap];
        if (modifier) {
            this.categoryNode.classList.add(modifier);
        }
    }

    set image(value: string) {
        const alt = this.nameElement.textContent ?? '';
        this.setImage(this.imageNode, `${CDN_URL}${value}`, alt);
    }

    set description(value: string) {
        this.textNode.textContent = value;
    }

    set buttonText(value: string) {
        this.actionButton.textContent = value;
    }

    set disabled(value: boolean) {
        this.actionButton.disabled = value;
    }
}
