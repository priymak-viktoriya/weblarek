# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные 

#### Тип TPayment
type TPayment = 'card' | 'cash' | null;
Допустимые способы оплаты: 'card' — онлайн-оплата картой, 'cash' — оплата при получении, null — способ не выбран.

#### Интерфейс IProduct
Описывает структуру товара.
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}
`id — уникальный идентификатор товара;
`description — описание товара;
`image — путь к изображению товара;
`title — название товара;
`category — категория товара;
`price — цена товара (число) или null, если цена недоступна.

#### Интерфейс IBuyer
Описывает данные покупателя при оформлении заказа.
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}
`payment — выбранный способ оплаты (TPayment);
`email — адрес электронной почты;
`phone — номер телефона;
`address — адрес доставки.

#### Тип IProductListResponse
Ответ сервера при получении списка товаров.

interface IProductListResponse {
  items: IProduct[];
  total?: number;
}
`items — массив товаров;
`total — общее количество товаров (опционально).

#### Тип IOrderRequest
Данные заказа, отправляемые на сервер.
interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}
наследует все поля IBuyer;

`items — массив идентификаторов товаров в заказе;
`total — итоговая сумма заказа.

#### Тип IOrderResponse
Ответ сервера при успешном оформлении заказа.

interface IOrderResponse {
  id: string;
  total: number;
}
`id — идентификатор оформленного заказа;
`total — сумма заказа, подтверждённая сервером.

#### Тип TBuyerError
Объект с ошибками валидации данных покупателя.
type TBuyerError = {
  payment?: string;
  address?: string;
  email?: string;
  phone?: string;
};
Каждое поле опционально и содержит текст ошибки для соответствующего поля формы. Если поле валидно, оно отсутствует в объекте.

### Модели данных
#### Класс Products
Отвечает за хранение каталога товаров и товара, выбранного для детального просмотра.
Конструктор: без параметров.
Поля класса:
`private items: IProduct[] = [] — массив всех товаров каталога;
`private selectedItem: IProduct | null = null — товар, выбранный для подробного отображения.

Методы:
`setItems(items: IProduct[]): void — сохраняет переданный массив товаров;
`getItems(): IProduct[] — возвращает массив всех товаров;
`getItem(id: string): IProduct | undefined — возвращает товар по его идентификатору;
`setSelectedItem(item: IProduct): void — сохраняет товар для детального просмотра;
`getSelectedItem(): IProduct | null — возвращает выбранный товар или null.

#### Класс Basket
Отвечает за хранение и управление товарами, добавленными в корзину.

Конструктор: без параметров.

Поле класса:

`private items: IProduct[] = [] — массив товаров в корзине.

Методы:

`getItems(): IProduct[] — возвращает все товары корзины;
`addItem(item: IProduct): void — добавляет товар в корзину, если его ещё нет;
`removeItem(id: string): void — удаляет товар из корзины по идентификатору;
`clear(): void — очищает корзину;
`getTotal(): number — вычисляет суммарную стоимость товаров (игнорирует null);
`getCount(): number — возвращает количество товаров в корзине;
`hasItem(id: string): boolean — проверяет наличие товара по идентификатору.

#### Класс Buyer
Отвечает за хранение и валидацию данных покупателя.
Конструктор: без параметров.

Поля класса:
`private payment: TPayment = null — выбранный способ оплаты;
`private address: string = '' — адрес доставки;
`private email: string = '' — электронная почта;
`private phone: string = '' — номер телефона.

Методы:

`setPayment(payment: TPayment): void — сохраняет способ оплаты;
`setAddress(address: string): void — сохраняет адрес;
`setEmail(email: string): void — сохраняет email;
`setPhone(phone: string): void — сохраняет телефон;
`getBuyerData(): IBuyer — возвращает объект с актуальными данными покупателя;
`clear(): void — сбрасывает все поля к начальным значениям;
`validate(): TBuyerError — проверяет валидность каждого поля. Возвращает объект, где ключи — названия полей с ошибками, а значения — текст ошибки. Если ошибок нет, объект пустой.

### Слой коммуникации
#### Класс WebLarekApi
Обеспечивает взаимодействие с API сервера: получение списка товаров и отправку заказа.

Конструктор:
constructor(api: IApi) — принимает объект, реализующий интерфейс IApi (методы get и post).

Поле класса:
private api: IApi — низкоуровневый клиент для выполнения HTTP-запросов.

Методы:

`getProducts(): Promise<IProductListResponse> — выполняет GET-запрос на эндпоинт /product/ и возвращает промис с объектом, содержащим массив товаров;

`createOrder(order: IOrderRequest): Promise<IOrderResponse> — выполняет POST-запрос на эндпоинт /order/ с данными заказа и возвращает промис с подтверждением от сервера.

### Слой представления (View)
Все компоненты представления наследуются от базового класса Component<T> и получают ссылку на брокер событий IEvents. Каждый класс отвечает за свой блок разметки, не хранит данные в полях и не принимает решений о логике — только уведомляет Презентер через события.

#### Класс Header
Отвечает за шапку сайта: логотип, кнопку корзины и счётчик товаров.

Конструктор:
constructor(events: IEvents, container: HTMLElement)

Поля класса:

private basketButton: HTMLButtonElement — кнопка открытия корзины (.header__basket);

private counterElement: HTMLElement — элемент счётчика товаров (.header__basket-counter).

Методы:

set counter(value: number): void — обновляет число товаров в счётчике.

Генерируемые события:

basket:open — при клике на кнопку корзины.

#### Класс Gallery
Контейнер для карточек каталога на главной странице.

Конструктор:
constructor(container: HTMLElement)

Поля класса:

private catalogElement: HTMLElement — корневой элемент галереи (.gallery).

Методы:

set catalog(items: HTMLElement[]): void — заменяет содержимое галереи массивом готовых DOM-элементов карточек.

Генерируемые события: отсутствуют.

#### Класс Modal
Универсальное модальное окно. От этого класса не наследуются другие классы. Любой контент рендерится внутри .modal__content.

Конструктор:
constructor(events: IEvents, container: HTMLElement)

Поля класса:

private contentElement: HTMLElement — контейнер для динамического содержимого (.modal__content);

private closeButton: HTMLButtonElement — кнопка закрытия (.modal__close).

Методы:

set content(value: HTMLElement): void — устанавливает содержимое модального окна;

open(): void — открывает окно, добавляя модификатор modal_active элементу .modal;

close(): void — закрывает окно, удаляя модификатор modal_active.

Генерируемые события:

modal:close — при клике на крестик или клике вне модального окна.

#### Абстрактный класс Card<T>
Общий родитель для всех трёх типов карточек. Содержит поля и сеттеры, общие для каталога, превью и корзины.

Конструктор:
constructor(container: HTMLElement)

Поля класса:

protected titleElement: HTMLElement — элемент названия (.card__title);

protected priceElement: HTMLElement — элемент цены (.card__price).

Методы:

set title(value: string): void — устанавливает название товара;

set price(value: number | null): void — устанавливает цену: если null — выводит «Бесценно», иначе — «X синапсов».

#### Класс CardCatalog
Карточка товара для каталога. Вся карточка — кнопка.

Конструктор:
constructor(container: HTMLElement, actions?: ICardActions)

Поля класса:

private categoryElement: HTMLElement — категория товара (.card__category);

private imageElement: HTMLImageElement — изображение (.card__image).

Методы:

set category(value: string): void — устанавливает категорию и добавляет соответствующий модификатор card__category_<ключ> на основе объекта categoryMap;

set image(value: string): void — формирует полный URL изображения через CDN_URL и устанавливает его.

Генерируемые события: вызывает переданный в actions колбэк onClick при клике на карточку; обработчик в main.ts эмитит событие card:select с данными товара.

#### Класс CardPreview
Карточка товара для детального отображения в модальном окне.

Конструктор:
constructor(container: HTMLElement, actions?: ICardActions)

Поля класса:

private categoryElement: HTMLElement — категория (.card__category);

private imageElement: HTMLImageElement — изображение (.card__image);

private descriptionElement: HTMLElement — описание (.card__text);

private buttonElement: HTMLButtonElement — кнопка действия (.card__button).

Методы:

set category(value: string): void — устанавливает категорию с модификатором через categoryMap;

set image(value: string): void — устанавливает изображение через CDN_URL;

set description(value: string): void — устанавливает текст описания;

set buttonText(value: string): void — устанавливает текст кнопки («Купить», «Удалить из корзины», «Недоступно»);

set disabled(value: boolean): void — включает/отключает кнопку.

Генерируемые события: вызывает колбэк onButtonClick; обработчик эмитит card:preview:button-click.

#### Класс CardBasket
Карточка товара в корзине. Показывает порядковый номер и кнопку удаления.

Конструктор:
constructor(container: HTMLElement, actions?: ICardActions)

Поля класса:

private indexElement: HTMLElement — порядковый номер (.basket__item-index);

private deleteButton: HTMLButtonElement — кнопка удаления (.basket__item-delete).

Методы:

set index(value: number): void — устанавливает порядковый номер товара.

Генерируемые события: вызывает колбэк onDelete; обработчик эмитит basket:item-remove с id товара.

#### Класс Basket
Отображение корзины: список товаров, общая стоимость, кнопка оформления.

Конструктор:
constructor(events: IEvents, container: HTMLElement)

Поля класса:

private listElement: HTMLElement — контейнер списка (.basket__list);

private priceElement: HTMLElement — общая стоимость (.basket__price);

private orderButton: HTMLButtonElement — кнопка «Оформить» (.basket__button).

Методы:

set items(value: HTMLElement[]): void — заменяет список товаров; если массив пуст, выводит «Корзина пуста»;

set total(value: number): void — устанавливает общую стоимость в формате «X синапсов»;

set isEmpty(value: boolean): void — блокирует/разблокирует кнопку оформления.

Генерируемые события:

basket:submit — при клике на кнопку «Оформить».

#### Абстрактный класс Form<T>
Общий родитель для форм оформления заказа. Содержит кнопку отправки и контейнер ошибок.

Конструктор:
constructor(events: IEvents, container: HTMLFormElement)

Поля класса:

protected submitButton: HTMLButtonElement — кнопка отправки (button[type="submit"]);

protected errorsElement: HTMLElement — контейнер ошибок (.form__errors);

protected formElement: HTMLFormElement — корневой элемент формы.

Методы:

set valid(value: boolean): void — активирует/деактивирует кнопку отправки;

set errors(value: string): void — выводит текст ошибок.

Генерируемые события: на submit формы эмитит событие <name формы>:submit (например, order:submit или contacts:submit).

#### Класс OrderForm
Первый шаг оформления заказа: выбор способа оплаты и ввод адреса.

Конструктор:
constructor(events: IEvents, container: HTMLFormElement)

Поля класса:

private cardButton: HTMLButtonElement — кнопка «Онлайн» (button[name="card"]);

private cashButton: HTMLButtonElement — кнопка «При получении» (button[name="cash"]);

private addressInput: HTMLInputElement — поле адреса (input[name="address"]).

Методы:

set payment(value: TPayment): void — подсвечивает выбранную кнопку модификатором button_alt-active;

set address(value: string): void — устанавливает значение поля адреса.

Генерируемые события:

order:payment-change — при выборе способа оплаты;

order:address-change — при вводе адреса.

#### Класс ContactsForm
Второй шаг оформления заказа: ввод email и телефона.

Конструктор:
constructor(events: IEvents, container: HTMLFormElement)

Поля класса:

private emailInput: HTMLInputElement — поле email (input[name="email"]);

private phoneInput: HTMLInputElement — поле телефона (input[name="phone"]).

Методы:

set email(value: string): void — устанавливает значение поля email;

set phone(value: string): void — устанавливает значение поля телефона.

Генерируемые события:

contacts:email-change — при вводе email;

contacts:phone-change — при вводе телефона.

#### Класс Success
Экран успешного оформления заказа.

Конструктор:
constructor(events: IEvents, container: HTMLElement)

Поля класса:

private descriptionElement: HTMLElement — текст со списанной суммой (.order-success__description);

private closeButton: HTMLButtonElement — кнопка закрытия (.order-success__close).

Методы:

set total(value: number): void — выводит «Списано X синапсов».

Генерируемые события:

success:close — при клике на кнопку «За новыми покупками!».

### События приложения
#### События от моделей данных:

products:loaded — изменён массив товаров каталога;

products:selected — изменён выбранный для просмотра товар;

basket:changed — изменено содержимое корзины;

buyer:changed — изменены данные покупателя.

#### События от компонентов представления:

card:select — выбрана карточка товара для просмотра;

card:preview:button-click — нажата кнопка в карточке товара (Купить / Удалить из корзины);

basket:item-remove — нажата кнопка удаления товара из корзины;

basket:open — нажата кнопка открытия корзины в шапке;

basket:submit — нажата кнопка «Оформить» в корзине;

order:payment-change — изменён способ оплаты в первой форме;

order:address-change — изменён адрес доставки;

order:submit — нажата кнопка «Далее» в первой форме;

contacts:email-change — изменён email;

contacts:phone-change — изменён телефон;

contacts:submit — нажата кнопка «Оплатить» во второй форме;

modal:close — закрыто модальное окно;

success:close — закрыт экран успешного заказа.
