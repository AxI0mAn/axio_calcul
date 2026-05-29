/**
 * Универсальная функция для эмуляции hover на тачскринах
 * @param {string} selector - CSS селектор (например, '.catalog__card')
 * @param {string} hoverClass - Класс для состояния (по умолчанию 'isHovered')
 */
export function initTouchHover(selector, hoverClass = 'isHovered') {
  if (typeof document === 'undefined') return;

  // Проверяем, что это тач-устройство
  const isTouch = !window.matchMedia('(hover: hover)').matches;
  if (!isTouch) return;

  const elements = document.querySelectorAll(selector);
  let isScrolling = false;
  let startY = 0;

  elements.forEach(el => {
    // Детекция скролла, чтобы не активировать карточку при прокрутке
    el.addEventListener('touchstart', (e) => {
      if (e instanceof TouchEvent) startY = e.touches[0].pageY;
      isScrolling = false;
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (e instanceof TouchEvent) {
        if (Math.abs(e.touches[0].pageY - startY) > 10) isScrolling = true;
      }
    }, { passive: true });

    el.addEventListener('click', function (e) {
      if (isScrolling) return;

      // Если на элементе НЕТ класса — это ПЕРВЫЙ клик
      if (!this.classList.contains(hoverClass)) {
        e.preventDefault(); // Останавливаем переход по ссылке
        e.stopPropagation(); // Не даем событию уйти к document раньше времени

        // Убираем класс у всех остальных карточек
        elements.forEach(item => item.classList.remove(hoverClass));

        // Добавляем текущей
        this.classList.add(hoverClass);
      }
      // Если класс ЕСТЬ — это ВТОРОЙ клик, сработает стандартный переход по href
    });
  });

  // Сброс ховера при клике в пустое место
  document.addEventListener('click', (e) => {
    if (e.target instanceof HTMLElement && !e.target.closest(selector)) {
      elements.forEach(item => item.classList.remove(hoverClass));
    }
  });
}

/*
Инструкция: Эмуляция Hover на тачскринах (initTouchHover)
Зачем нужна эта функция?
На мобильных устройствах обычные CSS-стили :hover часто «залипают» или ломают логику: пользователь нажимает на карточку-ссылку, и браузер сразу переводит его на другую страницу, не дав рассмотреть превью (например, цену, кнопку или описание, которые появляются только при ховере).

Эта функция превращает один мобильный клик (тач) в два раздельных действия:

Первый клик — активирует псевдо-ховер (добавляет CSS-класс, показывая скрытые элементы карточки) и блокирует переход по ссылке.

Второй клик — выполняет стандартное действие (например, переход по ссылке или открытие товара).

Скролл — если пользователь просто прокручивал страницу и задел карточку, эффект не сработает (защита от ложных срабатываний).

Клик мимо — убирает эффект ховера с карточки, если нажать на пустое место экрана.

Параметры функции
JavaScript
initTouchHover(selector, hoverClass);
selector (string, обязательно): CSS-селектор элементов, к которым нужно применить эффект (например, '.catalog__card').

hoverClass (string, необязательно): Название класса, который будет добавляться при первом таче. По умолчанию: 'isHovered'.

Шаг 1: Настройка в CSS / SCSS
Вместо обычного :hover в стилях компонента нужно использовать связку: стандартный десктопный ховер И твой мобильный класс.

SCSS
.catalog__card {
  // Базовые стили карточки...

  .card__hidden-info {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  // Срабатывает на ПК при наведении И на мобилках при первом таче
  &:hover, 
  &.isHovered {
    .card__hidden-info {
      opacity: 1;
    }
  }
}
Шаг 2: Подключение в Svelte-компоненте
В Svelte 5 функция инициализируется внутри руны $effect, так как ей нужен доступ к уже отрендеренному DOM.

Svelte
<script>
  import { onMount } from 'svelte'; // если нужно, но в Svelte 5 используем руны
  import { initTouchHover } from '$lib/utils/initTouchHover';

  // Запускаем эмуляцию после монтирования компонента в DOM
  $effect(() => {
    initTouchHover('.catalog__card');
  });
</script>

<div class="catalog">
  <a href="/product/1" class="catalog__card">
    <img src="photo.jpg" alt="Товар" />
    <div class="card__hidden-info">Быстрый просмотр</div>
  </a>
</div>
⚠️ Важные нюансы:
Безопасность SSR: Функция внутри себя проверяет typeof document === 'undefined', поэтому она абсолютно безопасна для пререндеринга SvelteKit и не уронит билд.

Проверка медиа-запроса: Функция автоматически определяет тип устройства через window.matchMedia('(hover: hover)'). На обычных компьютерах с мышкой она сразу отключается, позволяя браузеру использовать нативный CSS :hover без лишней нагрузки на процессор.
*/