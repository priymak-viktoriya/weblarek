import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// === Тестирование моделей данных ===
console.log('=== Тестирование моделей данных ===');

const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log('Товары в каталоге:', productsModel.getItems());

const firstProduct = productsModel.getItems()[0];
if (firstProduct) {
    productsModel.setSelectedItem(firstProduct);
    console.log('Выбранный товар:', productsModel.getSelectedItem());
    const found = productsModel.getItem(firstProduct.id);
    console.log('Поиск по id:', found);
}

const basketModel = new Basket();
if (firstProduct) {
    basketModel.addItem(firstProduct);
    console.log('Корзина после добавления:', basketModel.getItems());
    console.log('Количество товаров в корзине:', basketModel.getCount());
    console.log('Сумма корзины:', basketModel.getTotal());
    console.log('Наличие товара в корзине:', basketModel.hasItem(firstProduct.id));

    basketModel.removeItem(firstProduct.id);
    console.log('Корзина после удаления:', basketModel.getItems());
}

basketModel.addItem(apiProducts.items[1]);
basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

const buyerModel = new Buyer();
buyerModel.setPayment('card');
buyerModel.setAddress('Москва');
buyerModel.setEmail('test@example.com');
buyerModel.setPhone('+79990000000');
console.log('Данные покупателя:', buyerModel.getBuyerData());
console.log('Ошибки валидации:', buyerModel.validate());

buyerModel.clear();
console.log('Покупатель после очистки:', buyerModel.getBuyerData());

// === Подключение к серверу ===
console.log('=== Загрузка товаров с сервера ===');

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi.getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
        console.log('Товары с сервера сохранены в модель каталога.');
        console.log('Все товары:', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });
