import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Products {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;
    private eventBus: IEvents;

    constructor(events: IEvents) {
        this.eventBus = events;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
        this.eventBus.emit('products:loaded', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
        this.eventBus.emit('products:selected', { item: this.selectedItem });
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}
