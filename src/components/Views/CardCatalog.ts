import { Card, CardBase } from './Card';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { IProduct, ICardActions } from '../../types';

type CatalogFields = Pick<IProduct, 'category' | 'image'>;

export class CardCatalog extends Card<CatalogFields> {
    protected categoryNode: HTMLElement;
    protected imageNode: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryNode = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageNode = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
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
}
