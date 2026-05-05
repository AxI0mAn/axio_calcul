/**
 * перехватывает первый клик на мобильном устройстве, остановит переход по ссылке и просто «подсветит» карточку.
 * второй клик сработает как нажатие 
 * инструкция в /home/daxio/Desktop/Link to svelte5doc/assets/CODING/Double Tap Issue.md
 */

/* Применение 
    // В Svelte 5 используйте руну $effect
    <script>
      import { initTouchHover } from './utils.js';

      $effect(() => {
        initTouchHover('.card');
      });
    </script>
*/

/**
 * Универсальная функция для эмуляции hover на тачскринах
 * @param {string} selector - CSS селектор элементов
 * @param {string} hoverClass - Класс, заменяющий :hover
 */
export function initTouchHover(selector, hoverClass = 'is-hovered') {
  if (typeof document === 'undefined') return;

  const isTouch = !window.matchMedia('(hover: hover)').matches;
  if (!isTouch) return;

  const elements = document.querySelectorAll(selector);
  let touchStartPos = { x: 0, y: 0 };
  let isScrolling = false;

  elements.forEach((el) => {
    el.addEventListener('touchstart', (e) => {
      if (e instanceof TouchEvent) {
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        isScrolling = false;
      }
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (e instanceof TouchEvent) {
        const moveX = Math.abs(e.touches[0].clientX - touchStartPos.x);
        const moveY = Math.abs(e.touches[0].clientY - touchStartPos.y);
        if (moveX > 10 || moveY > 10) isScrolling = true;
      }
    }, { passive: true });

    // Используем touchend для мгновенной реакции на тач
    el.addEventListener('touchend', function (e) {
      if (isScrolling) return;

      if (!this.classList.contains(hoverClass)) {
        // Останавливаем всё: и переход по ссылке, и последующий 'click'
        e.preventDefault();

        elements.forEach((item) => item.classList.remove(hoverClass));
        this.classList.add(hoverClass);

        console.log('TouchEnd: Класс добавлен');
      } else {
        // Если класс уже есть, позволяем браузеру сгенерировать клик и перейти
        console.log('TouchEnd: Повторный тап, переход...');
      }
    }, { passive: false }); // Важно: false, чтобы работал preventDefault
  });

  document.addEventListener('click', (e) => {
    if (e.target instanceof HTMLElement) {
      const target = e.target.closest(selector);
      if (!target) {
        elements.forEach((item) => item.classList.remove(hoverClass));
      }
    }
  });
}
