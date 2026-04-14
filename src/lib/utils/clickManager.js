// src/lib/utils/clickManager.js

/**
 * Создает обработчик, который разделяет одинарный и двойной клики.
 * @param {Function} onSingle - функция для одиночного клика
 * @param {Function} onDouble - функция для двойного клика
 * @param {number} delay - задержка в мс (по умолчанию 250)
 * @returns {Function} - единая функция-обработчик
 */
export function createClickManager(onSingle, onDouble, delay = 200) {
  let timer = null;

  return (event) => {
    if (timer === null) {
      // Первый клик: запускаем таймер
      timer = setTimeout(() => {
        onSingle(event);
        timer = null;
      }, delay);
    } else {
      // Второй клик: отменяем таймер и вызываем двойной клик
      clearTimeout(timer);
      timer = null;
      onDouble(event);
    }
  };
}

/*
Как использовать в компоненте (на примере M1)
Теперь ваш компонент станет намного чище. 
Вам не нужно следить за переменными таймеров — утилита сделает это внутри своего замыкания.

Svelte
<script>
  import { btnMemo } from '$lib/utils/btnMemo.js';
  import { createClickManager } from '$lib/utils/clickManager.js';

  // Создаем изолированные обработчики для каждой кнопки
  const handleM1 = createClickManager(
    () => btnMemo('M1'),        // Обычный клик
    () => btnMemo('M1', true)   // Двойной клик
  );

  const handleM2 = createClickManager(
    () => btnMemo('M2'),
    () => btnMemo('M2', true)
  );
</script>

<div class="row">
  <BtnText
    buttonText="M1"
    customClass="..."
    onclick={handleM1} 
  />

  <BtnText
    buttonText="M2"
    customClass="..."
    onclick={handleM2}
  />
</div>
*/