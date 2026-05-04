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

  // если на дисплее ERROR, то Backspace - очищает не по символьно, а сразу всё слово
  if (currentValue === '' || currentValue === '0' || currentValue.length <= 1 || currentValue === 'ERROR') {
    appState.display = '0';
  } else {
    appState.display = currentValue.slice(0, -1);
  };
  // 2. Если мы удаляем цифры и точкa остаётся последним символом
  if (currentValue.endsWith('.')) {
    appState.display = currentValue.slice(0, -1);
  };


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
 * Ограничение знаков и автоматическое сокращение нулей в e+
 */
export function float_toFixed(num) {

  // 1. Убираем ошибку точности JS (например, 4.999...999 -> 5)
  // toPrecision(15) округляет до 15 значащих цифр. 
  // parseFloat затем уберет лишние нули: 5.000000000 -> 5
  const correctedNum = parseFloat(Number(num).toPrecision(15));
  const strNum = String(correctedNum);

  // 2. Если это уже экспонента (e+), NaN или ERROR — не трогаем
  if (isNaN(num) || strNum.includes('e') || strNum === 'ERROR') {
    return strNum.replace(/\.?0+e/, 'e');
  }

  // 3. Логика превращения нулей в e+
  // Ищем в конце числа 6 и более нулей
  const zeroMatch = strNum.match(/^(.*[^0])(0{6,})$/);
  if (zeroMatch) {
    const significantPart = zeroMatch[1]; // Часть без нулей в конце (например, 100001)
    const exponent = zeroMatch[2].length; // Количество нулей (например, 6)
    return `${significantPart}e+${exponent}`;
  }

  // 4. Стандартное форматирование для обычных чисел
  let result = correctedNum.toFixed(appState.numToFix);

  // Убирает нули после точки, а если останется точка в конце — убирает и её
  return result.replace(/(\.0+|(\.[0-9]*[1-9])0+)$/, '$2');
}


/**
* Очистка (клавиша С)
*/
export function clear() {
  appState.reset();
}
