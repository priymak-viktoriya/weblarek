import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];
    private eventBus: IEvents;

    constructor(events: IEvents) {
        this.eventBus = events;
    }

    private notify(): void {
        this.eventBus.emit('basket:changed', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.hasItem(item.id)) {
            this.items.push(item);
            this.notify();
        }
    }

    removeItem(id: string): void {
        const before = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        if (before !== this.items.length) {
            this.notify();
        }
    }

    clear(): void {
        if (this.items.length) {
            this.items = [];
            this.notify();
        }
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}
