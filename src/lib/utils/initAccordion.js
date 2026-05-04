/**
 * На странице есть несколько <details>. 
 * Эта функция  НЕОБХОДИМА ДЛЯ СТАРЫХ БРАУЗЕРОВ отслеживает <details> на этой странице так, что открытым может быть только один. 
 * Если открыли первый, а потом открыли третий, то первый закроется.
 * 
 * ДЛЯ НОВЫХ БРАУЗЕРОВ ЕСТЬ АТТРИБУТ <details name="my-accordion">  
 * ЕГО ПРИСВАИВАЕМ ВСЕМ <details> КОТОРЫЕ ДОЛЖНЫ ВЕСТИ СЕБЯ КАК АККОРДЕОН
 */

export function initAccordion() {
  // Находим все элементы details на странице
  const details = document.querySelectorAll('details');

  details.forEach((targetDetail) => {
    // Слушаем событие toggle (срабатывает при смене состояния open)
    targetDetail.addEventListener('toggle', () => {
      // Если текущий элемент открылся
      if (targetDetail.open) {
        // Перебираем остальные и закрываем их
        details.forEach((detail) => {
          if (detail !== targetDetail) {
            detail.open = false;
          }
        });
      }
    });
  });
}

// Запускаем функцию в компоненте через onMount - Код внутри onMount никогда не запустится на сервере