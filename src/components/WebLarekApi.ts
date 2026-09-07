import { IApi, IProductListResponse, IOrderRequest, IOrderResponse } from '../types';

export class WebLarekApi {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    getProducts(): Promise<IProductListResponse> {
        return this._api.get<IProductListResponse>('/product/');
    }

    createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
        return this._api.post<IOrderResponse>('/order/', orderData);
    }
}
