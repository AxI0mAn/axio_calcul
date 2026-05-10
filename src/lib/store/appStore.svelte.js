// src/lib/store/appStore.svelte.js

// Вместо этого:
// import { browser } from '$app/environment';
// Используем это:
const browser = typeof window !== 'undefined' && typeof document !== 'undefined';



class AppStore {

  /** цветовая тема приложения
   * @type {'light' | 'dark'} */
  #theme = $state('light');

  /** выбор языка для интерфейсов и текстов
   * @type {'RU' | 'EN' | 'UA' | 'PT' | 'ES'} */
  #lang = $state('RU');

  /** размер шрифта rem
   * @type {number} */
  #fontSize = $state(16);

  /** точность знаков после запятой
   *  @type {number} */
  #toFix = $state(6);

  /** количество элементов в map из historyStore в котором храним историю с предыдущими вычислениями
   * @type {number} */
  #historyLocal = $state(12);

  /** Статус на разрешение установки PWA от браузера
   * true - разрешение на установку получено и можно установить приложение  
   * false - нельзя установить приложение 
   * @type {boolean} */
  #canInstall = $state(false);

  /** * Статус установки. false - если не установлено, 
   * или строка с датой 'YYYY.MM.DD'
   * @type {string | boolean} 
   */
  #installed = $state(false);

  constructor() {
    // Эта часть кода выполняется ОДИН РАЗ при загрузке приложения в браузере
    if (browser) {
      this.#initFromStorage();

      // Авто-сохранение: при любом изменении реактивных свойств
      $effect.root(() => {
        $effect(() => {
          const data = this.serialize();
          localStorage.setItem('app_settings', JSON.stringify(data));
        });
      });
    }
  }

  #initFromStorage() {
    const saved = localStorage.getItem('app_settings');
    if (!saved) {
      console.log('AppStore: Настройки не найдены, использую значения по умолчанию');
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      // Применяем сохраненные значения
      if (parsed.theme) this.#theme = parsed.theme;
      if (parsed.lang) this.#lang = parsed.lang;
      if (parsed.fontSize) this.#fontSize = parsed.fontSize;
      if (parsed.toFix) this.#toFix = parsed.toFix;
      if (parsed.historyLocal) this.#historyLocal = parsed.historyLocal;
      if (parsed.installed) this.#installed = parsed.installed;

      console.log('AppStore: Настройки успешно загружены из localStorage');
    } catch (err) {
      console.error('AppStore: Ошибка чтения localStorage, сброс на дефолт', err);
    }
  }

  // Геттеры и сеттеры
  get theme() { return this.#theme; }
  set theme(v) { this.#theme = v; }

  get lang() { return this.#lang; }
  set lang(v) { this.#lang = v; }

  get fontSize() { return this.#fontSize; }
  set fontSize(v) { this.#fontSize = v; }

  get toFix() { return this.#toFix; }
  set toFix(v) { this.#toFix = v; }

  get historyLocal() { return this.#historyLocal; }
  set historyLocal(v) { this.#historyLocal = v; }

  get canInstall() { return this.#canInstall; }
  set canInstall(v) { this.#canInstall = v; }

  get installed() { return this.#installed; }
  set installed(v) { this.#installed = v; }

  serialize() {
    return {
      theme: this.#theme,
      lang: this.#lang,
      fontSize: this.#fontSize,
      toFix: this.#toFix,
      historyLocal: this.#historyLocal,
      installed: this.#installed
    };
  }

  setInstalled() {
    this.#installed = new Date().toISOString().split('T')[0].replace(/-/g, '.');
  }
}

// Экземпляр создается один раз при первом импорте файла
export const appStore = new AppStore();


/*
Тонкости, которые важно знать:
1. Нужно ли вызывать функцию в onMount?
Нет. Так как мы экспортируем const appStore = new AppStore(), конструктор сработает в тот момент, когда первый компонент импортирует этот файл. Благодаря проверке if (browser), он безопасно дождется появления window и localStorage.

2. Как обращаться к параметрам?
Ты просто импортируешь appStore и берешь свойства. Они всегда будут актуальными (либо дефолтными, либо из хранилища):

Svelte
<script>
  import { appStore } from '$lib/store/appStore.svelte.js';
</script>

<h1>Настройки</h1>
<p>Язык: {appStore.lang}</p>
<p>Точность: {appStore.toFix}</p>

3. А если данных в localStorage нет?
В конструкторе стоит проверка if (!saved) return;. Это значит, что если записи нет, выполнение функции прервется, и поля останутся равными тем значениям, которые ты указал при объявлении (например, RU, 16, 6). Это и есть твои "заводские настройки".

4. Безопасность (JSON.parse)
Использование try...catch обязательно. Если пользователь вручную впишет в localStorage сломанный JSON, твое приложение не упадет "в белый экран", а просто откатится к стандартным настройкам.

5. Запись в localStorage происходит при любом фактическом изменении любого свойства, входящего в serialize(). Если ты сменил язык — сохранится всё состояние (включая тему и шрифт), но с новым языком.

Визуальная схема процесса:

Действие: Вызов appStore.lang = 'ES'.

Сеттер: Меняет приватное состояние $state.

Реактивность: Svelte уведомляет всех «подписчиков».

Эффект: Видит изменение, вызывает this.serialize().

localStorage: Получает обновленную строку JSON.

*/ 