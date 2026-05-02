/** 
 * общая функция для констант
 * принимает значение 
 * показывает результат на экране
 * */
import { appState } from "$lib/store/appState.svelte";
import { float_toFixed } from "$lib/services/base";

/** 
 * общая функция для констант
 * принимает значение 
 * показывает результат на экране
 * */

export function showConstanta(constanta) {
  // 1. Берем полное значение константы
  const fullValue = String(float_toFixed(constanta));

  // 2. Логика вставки (как в addDigit)
  if (appState.isNewInput || appState.display === '0') {
    appState.display = fullValue;
  } else {
    // Если уже что-то вводили, приклеиваем (например, 2 + константа)
    appState.display += fullValue;
  }

  // 3. КЛЮЧЕВОЙ МОМЕНТ:
  // Сбрасываем флаг в false, как это делает addDigit!
  // Теперь, когда вы нажмете "-", функция addOperator пойдет по ветке 
  // "else { appState.expression += appState.display + op; }"
  // и заберет полное значение из display в expression.
  appState.isNewInput = false;
}


/**
 * общая функция для констант старая
 * принимает значение
 * показывает результат на экране
 * */
// function showConstanta(constanta) {
//   // 1. Подготавливаем значение константы
//   const value = String(float_toFixed(constanta));

//   // 2. Проверяем наличие операндов в выражении или состояние ввода
//   // Регулярное выражение ищет любые знаки: + - * / (используем экранирование для - и *)
//   const hasOperator = /[+\-*/]/.test(appState.expression);

//   // 3. Логика вставки:
//   // Если это новый ввод, либо на экране 0, либо в выражении НЕТ операнда — заменяем экран
//   if (appState.isNewInput || appState.display === '0' || !hasOperator) {
//     appState.display = value;
//   }
//   // Если операнд есть и мы в процессе ввода — добавляем константу к существующему числу
//   else {
//     appState.display += value;
//   }

//   // Устанавливаем флаг, что следующее нажатие цифры начнет новый ввод 
//   // (чтобы цифры не "прилипали" к константе без оператора)
//   appState.isNewInput = true;
// }