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