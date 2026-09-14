import './scss/styles.scss';

// Модели
import { Products } from './components/models/Product';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Bueyr';

// Слой коммуникации
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { WebLarekApi } from './components/WebLarekApi';

// Компоненты представления
import { Header } from './components/Views/Header';
import { Gallery } from './components/Views/Gallery';
import { Modal } from './components/Views/Modal';
import { CardCatalog } from './components/Views/CardCatalog';
import { CardPreview } from './components/Views/CardPreview';
import { CardBasket } from './components/Views/CardBasket';
import { Basket as BasketView } from './components/Views/Basket';
import { OrderForm } from './components/Views/OrderForm';
import { ContactsForm } from './components/Views/ContactsForm';
import { Success } from './components/Views/Success';

// Утилиты и константы
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Типы
import { IProduct, IOrderRequest, TPayment } from './types';

// === Инициализация брокера, моделей и API ===
const events = new EventEmitter();

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// === Статические элементы страницы ===
const headerView = new Header(events, ensureElement<HTMLElement>('.header'));
const galleryView = new Gallery(ensureElement<HTMLElement>('.gallery'));
const modalView = new Modal(events, ensureElement<HTMLElement>('#modal-container'));

// === Шаблоны ===
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// === Компоненты на основе шаблонов ===
const basketView = new BasketView(events, cloneTemplate(basketTemplate));
const orderFormView = new OrderForm(events, cloneTemplate(orderTemplate) as HTMLFormElement);
const contactsFormView = new ContactsForm(events, cloneTemplate(contactsTemplate) as HTMLFormElement);
const successView = new Success(events, cloneTemplate(successTemplate));

const previewView = new CardPreview(cloneTemplate(previewTemplate), {
    onButtonClick: () => events.emit('card:preview:button-click'),
});

// === Вспомогательные функции ===

function renderBasket(): void {
    const items = basketModel.getItems();

    const cards = items.map((product, index) => {
        const card = new CardBasket(cloneTemplate(basketCardTemplate), {
            onDelete: () => events.emit('basket:item-remove', { id: product.id }),
        });
        card.title = product.title;
        card.price = product.price;
        card.index = index + 1;
        return card.render();
    });

    basketView.items = cards;
    basketView.total = basketModel.getTotal();
    basketView.isEmpty = items.length === 0;
}

function updateOrderForm(): void {
    const data = buyerModel.getBuyerData();
    orderFormView.payment = data.payment;
    orderFormView.address = data.address;

    const errors = buyerModel.validate();
    const messages = [errors.payment, errors.address].filter(Boolean) as string[];
    orderFormView.errors = messages.join('; ');
    orderFormView.valid = messages.length === 0;
}

function updateContactsForm(): void {
    const data = buyerModel.getBuyerData();
    contactsFormView.email = data.email;
    contactsFormView.phone = data.phone;

    const errors = buyerModel.validate();
    const messages = [errors.email, errors.phone].filter(Boolean) as string[];
    contactsFormView.errors = messages.join('; ');
    contactsFormView.valid = messages.length === 0;
}

// === Загрузка товаров с сервера ===
webLarekApi.getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
    })
    .catch((error) => {
        console.error('Ошибка при получении товаров:', error);
    });

// === Обработчики событий моделей ===

// Каталог загружен — рендерим карточки
events.on('products:loaded', () => {
    const cards = productsModel.getItems().map((product) => {
        const card = new CardCatalog(cloneTemplate(catalogTemplate), {
            onClick: () => events.emit('card:select', product),
        });
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        return card.render();
    });

    galleryView.catalog = cards;
});

// Выбран товар для просмотра — сохраняем в модель
events.on('card:select', (product: IProduct) => {
    productsModel.setSelectedItem(product);
});

// Выбранный товар изменился — открываем превью в модальном окне
events.on('products:selected', () => {
    const product = productsModel.getSelectedItem();
    if (!product) return;

    previewView.title = product.title;
    previewView.price = product.price;
    previewView.category = product.category;
    previewView.image = product.image;
    previewView.description = product.description;

    if (product.price === null) {
        previewView.buttonText = 'Недоступно';
        previewView.disabled = true;
    } else if (basketModel.hasItem(product.id)) {
        previewView.buttonText = 'Удалить из корзины';
        previewView.disabled = false;
    } else {
        previewView.buttonText = 'Купить';
        previewView.disabled = false;
    }

    modalView.content = previewView.render();
    modalView.open();
});

// Корзина изменилась — обновляем счётчик и перерисовываем содержимое
events.on('basket:changed', () => {
    headerView.counter = basketModel.getCount();
    renderBasket();
});

// Покупатель изменился — перерисовываем формы и их валидацию
events.on('buyer:changed', () => {
    updateOrderForm();
    updateContactsForm();
});

// === Обработчики событий представления ===

// Клик по кнопке в превью — добавить или удалить товар из корзины
events.on('card:preview:button-click', () => {
    const product = productsModel.getSelectedItem();
    if (!product || product.price === null) return;

    if (basketModel.hasItem(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        basketModel.addItem(product);
    }

    modalView.close();
});

// Удаление товара из корзины
events.on('basket:item-remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

// Открытие корзины в модальном окне
events.on('basket:open', () => {
    modalView.content = basketView.render();
    modalView.open();
});

// Кнопка «Оформить» — открыть первую форму оформления
events.on('basket:submit', () => {
    modalView.content = orderFormView.render();
    modalView.open();
});

// Изменение полей первой формы
events.on('order:change', (data: { name: string; value: string }) => {
    if (data.name === 'payment') {
        buyerModel.setPayment(data.value as TPayment);
    }
    if (data.name === 'address') {
        buyerModel.setAddress(data.value);
    }
});

// Переход ко второй форме оформления
events.on('order:submit', () => {
    modalView.content = contactsFormView.render();
    modalView.open();
});

// Изменение полей второй формы
events.on('contacts:change', (data: { name: string; value: string }) => {
    if (data.name === 'email') {
        buyerModel.setEmail(data.value);
    }
    if (data.name === 'phone') {
        buyerModel.setPhone(data.value);
    }
});

// Отправка заказа на сервер
events.on('contacts:submit', () => {
    const buyer = buyerModel.getBuyerData();

    const order: IOrderRequest = {
        payment: buyer.payment,
        address: buyer.address,
        email: buyer.email,
        phone: buyer.phone,
        items: basketModel.getItems().map((item) => item.id),
        total: basketModel.getTotal(),
    };

    webLarekApi.createOrder(order)
        .then((response) => {
            basketModel.clear();
            buyerModel.clear();

            successView.total = response.total;
            modalView.content = successView.render();
            modalView.open();
        })
        .catch((error) => {
            console.error('Ошибка оформления заказа:', error);
        });
});

// Закрытие экрана успешного заказа
events.on('success:close', () => {
    modalView.close();
});
