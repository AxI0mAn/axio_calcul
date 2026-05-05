/**
 * Эта функция один раз при загрузке проверяет устройство. 
 * Если это тачскрин — она просто вешает класс .mobileStyle на все нужные элементы (карточки).
 */
/*
Применение:
<script>
  import { setMobileClass } from '$lib/utils/initTouchCards';

  $effect(() => {
    // Запускаем для карточек
    setMobileClass('.catalog__card');
    
    // Если есть другие элементы, можно вызвать еще раз
    // setMobileClass('.other-element', 'mobileStyle');
  });
</script>

ВАЖНО!!! для стилей применяем :global() - без него мобильные стили не запускаются!!
:global(.catalog__card.mobileStyle::before)
*/


/**
 * Функция для добавления спец. класса на мобильных устройствах
 * @param {string} selector - CSS селектор (например, '.catalog__card')
 * @param {string} mobileClass - Класс, который добавим (по умолчанию 'mobileStyle')
 */
export function setMobileClass(selector, mobileClass = 'mobileStyle') {
  if (typeof document === 'undefined') return;

  // Проверяем: устройство поддерживает тач ИЛИ не поддерживает наведение мыши
  const isTouch = window.matchMedia('(pointer: coarse)').matches ||
    !window.matchMedia('(hover: hover)').matches;

  if (isTouch) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.add(mobileClass);
    });

    console.log(`Найдено ${elements.length} эл. Добавлен класс ${mobileClass}`);
  }
}