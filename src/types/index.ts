export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
export type TPayment = 'card' | 'cash';

// Интерфейс товара (с сервера)
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс данных покупателя (для заказа)
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderRequest extends IBuyer {
    total: number;
    items: string[];
};

export interface IOrderResultApi {
    items: IProduct[];
    total: number;
}
