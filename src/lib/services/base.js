/**
 * Модуль с чистыми функциями для работы калькулятора.
 * Эти функции не меняют состояние напрямую, а возвращают новое значение для appState.display 
 * Удаление последнего символа (Backspace)
  * Переключение знака (+/-)
  * Добавление десятичной точки
  * ограничение знаков результата после запятой
 */

import { appState } from "$lib/store/appState.svelte";


// Удаление последнего символа (Backspace)
export function backspace() {
  let currentValue = appState.display;
  // console.log('function backspace'); 
  if (currentValue === '' || currentValue === '0' || currentValue.length <= 1) {
    appState.display = '0';
  } else {
    appState.display = currentValue.slice(0, -1);
  };
  // 2. Если мы удаляем цифры и точкa остаётся последним символом
  if (currentValue.endsWith('.')) {
    appState.display = currentValue.slice(0, -1);
  }
}

// Переключение знака (+/-)
export function toggleSign() {
  let currentValue = appState.display;

  // 1. Игнорируем, если на экране ноль
  if (currentValue === '0') return;

  // 2. Проверяем, обернуто ли уже число в скобки с минусом: (-число)
  const wrappedMatch = currentValue.match(/^\(-(.*)\)$/);

  if (wrappedMatch) {
    // Если нашли паттерн (-число), достаем то, что внутри скобок после минуса
    appState.display = wrappedMatch[1];
  } else if (currentValue.startsWith('-')) {
    // На всякий случай обрабатываем вариант без скобок: -число -> число
    appState.display = currentValue.slice(1);
  } else {
    // В противном случае оборачиваем в скобки: число -> (-число)
    appState.display = `(-${currentValue})`;
  }
}

// Добавление десятичной точки
export function addDecimal() {
  let currentValue = appState.display;

  // 1. Если это начало нового ввода (isNewInput === true)
  if (appState.isNewInput) {
    appState.display = '0.'; // Начинаем с "0."
    appState.isNewInput = false; // Теперь ввод продолжается
    return;
  }

  // 2. Если мы уже что-то вводим и точки еще нет
  if (!currentValue.includes('.')) {
    appState.display = currentValue + '.';
  }
  // Если точка уже есть — ничего не делаем (игнорируем повторное нажатие)
}

/**
 * ограничение знаков результата после запятой
 */
export function float_toFixed(num) {
  return parseFloat(num.toFixed(appState.numToFix));
}

