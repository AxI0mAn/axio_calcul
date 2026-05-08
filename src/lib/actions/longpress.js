// src/lib/actions/longpress.js
/**
 * Svelte Action для определения долгого нажатия.
 * Генерирует событие 'longpress' при удержании элемента.
 * * @param {HTMLElement} node - Элемент, к которому привязывается действие
 * @param {number} [threshold=500] - Время удержания в мс (по умолчанию 500)
 * @returns {{destroy: Function}}
 */
export function longpress(node, threshold = 500) {
  let timer;

  const handleStart = () => {
    timer = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress', {
        bubbles: true,
        detail: { originalEvent: true }
      }));
    }, threshold);
  };

  const handleCancel = () => {
    clearTimeout(timer);
  };

  node.addEventListener('mousedown', handleStart);
  node.addEventListener('mouseup', handleCancel);
  node.addEventListener('mouseleave', handleCancel);
  node.addEventListener('touchstart', handleStart, { passive: true });
  node.addEventListener('touchend', handleCancel);
  node.addEventListener('touchcancel', handleCancel); // Добавили для мобилок

  return {
    destroy() {
      node.removeEventListener('mousedown', handleStart);
      node.removeEventListener('mouseup', handleCancel);
      node.removeEventListener('mouseleave', handleCancel);
      node.removeEventListener('touchstart', handleStart);
      node.removeEventListener('touchend', handleCancel);
      node.removeEventListener('touchcancel', handleCancel);
    }
  };
}

/*
Эта функция — типичный Svelte Action. 
Она позволяет легко добавить логику «долгого нажатия» любому элементу, 
не загромождая основной код компонента лишними таймерами.

Вот описание для документации, написанное понятным языком:

Action: longpress
Назначение: Отслеживает долгое нажатие (удержание) на элементе. 
Работает как с компьютерной мышью, так и на сенсорных экранах (мобильных устройствах).

Как это работает
Когда пользователь нажимает на элемент и удерживает его дольше указанного времени (по умолчанию 500 мс), 
функция генерирует кастомное событие longpress. 
Если пользователь отпустил палец/кнопку раньше или увел курсор в сторону — действие отменяется.



Подключение в компоненте

Импорт:

JavaScript
import { longpress } from '$lib/actions/longpress.js';

Использование:
Добавьте атрибут use:longpress к нужному тегу. После этого вам станет доступен обработчик события onlongpress.

Svelte
<button 
  use:longpress 
  onlongpress={() => console.log('Кнопка зажата!')}
>
  Удерживай меня
</button>

Настройка времени (Таймаут)
Вы можете изменить время удержания, передав параметр в use:longpress. Время указывается в миллисекундах:

Svelte
<div use:longpress={1000} onlongpress={handleBigClick}>
  Долгое удержание
</div>

Почему это удобно:
Универсальность: Один и тот же код обрабатывает и mousedown (мышь), и touchstart (тачскрин).

Чистота: Вам не нужно создавать переменные let timer внутри каждого компонента.

Автоматизация: Svelte сам вызовет метод destroy() и удалит все обработчики событий, когда компонент исчезнет с экрана (защита от утечек памяти).

Полезный совет для мобильных устройств
В мобильных браузерах долгое нажатие часто вызывает контекстное меню (копирование текста или сохранение картинки). Если вы хотите, чтобы ваше событие longpress работало без помех, добавьте элементу в CSS:

CSS
.your-element {
  -webkit-touch-callout: none; - запрещает контекстное меню на iOS 
  user-select: none;           - запрещает выделение текста 
}
*/