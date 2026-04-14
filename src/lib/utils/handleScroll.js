/**
 * Функция для плавной прокрутки при нажатии на кнопку или ссылку
 * Применение
 * <a
    href="#instruction"
    onclick={(e) => handleScroll(e, '.instruction')}
    class="btn btn__interface"
    aria-label="Info">
    {@html Info}
</a>
 */


export function handleScroll(e, selector) {
  // Проверяем, передано ли событие, прежде чем отменять стандартное поведение
  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  const target = document.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.warn(`Element with selector "${selector}" not found.`);
  }
}