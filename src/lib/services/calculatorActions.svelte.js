/**
* файл src/lib/action/calculatorActions.js
* Функции, вызываемые кнопками. Связывают mathCore и appState.
* Нажатие цифры
* Нажатие оператора (+, -, *, /)
* Нажатие "="
* Очистка (клавиша С) 
*/
import { appState } from '../store/appState.svelte.js';
import { evaluateExpression } from './mathCore.js';
import { float_toFixed } from './base.js';

/**
* Проверяет, является ли последний символ строки оператором
*/
export function isLastCharOperator(str) {
  return /[-+*^/]$/.test(str);
}


/**
* Нажатие цифры
*/
export function addDigit(digit) {
  if (appState.isNewInput) {
    appState.display = digit;
    appState.isNewInput = false;
  } else {
    appState.display = appState.display === '0' ? digit : appState.display + digit;
  }
}

/**
* Нажатие оператора (+, -, *, / ) 
*/
export function addOperator(op) {
  // ПРОВЕРКА: Если на экране результат делителей (массив в скобках) 
  // или результат факторизации (знак =)
  if (appState.display.includes('[') || appState.display.includes('=')) {
    appState.display = op; // Сбрасываем всё и записываем новую цифру
    appState.expression = '';  // Очищаем верхнюю строку
    appState.isNewInput = false;
    return;
  }
  // 1. СПЕЦ-ЛОГИКА ДЛЯ ОТКРЫВАЮЩЕЙ СКОБКИ
  if (op === '(') {
    // Если на экране 0, просто заменяем его на (
    // Если там уже что-то есть (например, sin), приклеиваем
    if (appState.display === '0' || appState.isNewInput) {
      appState.display = '(';
    } else {
      appState.display += '(';
    }
    appState.isNewInput = false;
    return; // Выходим, чтобы не срабатывала логика обычных операторов
  }

  // 2. СПЕЦ-ЛОГИКА ДЛЯ ЗАКРЫВАЮЩЕЙ СКОБКИ
  if (op === ')') {
    appState.display += ')';
    appState.isNewInput = false;
    return;
  }

  // 3. СТАНДАРТНЫЕ ОПЕРАТОРЫ (+, -, *, /, ^)

  if (appState.expression === '' && appState.display !== '0') {
    appState.expression = appState.display + op;
  } else if (isLastCharOperator(appState.expression) && appState.isNewInput) {
    appState.expression = appState.expression.slice(0, -1) + op;
  } else {
    appState.expression += appState.display + op;
  }

  appState.display = '0';
  appState.isNewInput = true;
}


/**
* Нажатие "=" 
export function performCalculation() {

  // 1. ИЗМЕНЕНО: Если и в памяти пусто, и на экране только "0", тогда выходить
  if (appState.expression === '' && (appState.display === '0' || appState.display === '')) return;

  let finalExpr = '';

  // 2. Формируем финальное выражение
  if (appState.isNewInput && appState.expression !== '') {
    // Если нажали "5 + =" -> считаем как "5"
    finalExpr = appState.expression.slice(0, -1);
  } else {
    // Склеиваем накопленное и то, что на экране
    // Например: "" + "√(4" или "10+" + "5"
    finalExpr = appState.expression + appState.display;
  }

  // 3. Вычисляем (evaluateExpression сама закроет скобки!)
  const result = evaluateExpression(finalExpr);

  if (result === "ERROR") {
    appState.display = "ERROR";
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  // 4. Формируем красивую запись для истории (с закрытыми скобками)
  const closedExpr = autoCloseBrackets(finalExpr);
  appState.historySession.push(`${closedExpr} = ${result}`);

  // 5. Обновляем состояние
  appState.display = String(float_toFixed(result));
  appState.expression = '';
  appState.isNewInput = true;

  // 6. Для y√x
  const sqrtSym = String.fromCharCode(8730); // Объявляем один раз

  let historyExpr = finalExpr;

  // Если в строке есть наша техническая метка
  if (historyExpr.includes('sqrtY_base:')) {
    // Используем переменную в конструкторе RegExpconst  
    const re = new RegExp(`([\\d.]+)\u207F${sqrtSym}([\\d.]+)`, 'g');

    // Меняем местами: было "base:8√3", станет "3√8"
    historyExpr = historyExpr.replace(re, `$2${sqrtSym}$1`);
  }

  appState.historySession.push(`${historyExpr} = ${result}`);
}
*/


export function performCalculation() {
  // console.trace("Кто вызвал вычисление?"); // Раскомментируйте для отладки, если дубли вернутся

  // 1. Проверка на пустой ввод
  if (appState.expression === '' && (appState.display === '0' || appState.display === '')) return;

  let finalExpr = '';

  // 2. Формируем финальное выражение для вычисления
  if (appState.isNewInput && appState.expression !== '') {
    // Случай "5 + =" -> берем просто "5"
    finalExpr = appState.expression.slice(0, -1);
  } else {
    // Стандартная склейка: "10+" + "5" или "8ⁿ√3"
    finalExpr = appState.expression + appState.display;
  }

  // 3. Вычисляем результат
  const result = evaluateExpression(finalExpr);

  if (result === "ERROR" || result === undefined || String(result) === 'NaN') {
    appState.display = "ERROR";
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  // 4. Подготовка записи для истории (Превращаем "ⁿ√64:3" в красивое "3√64")
  // Сначала закрываем скобки в финальном выражении
  let historyEntry = autoCloseBrackets(finalExpr);

  // 5. Обработка визуального отображения y√x (используем только наш символ \u207F)
  const sqrtSym = String.fromCharCode(8730);
  const nSym = '\u207F'; // наш секретный символ "ⁿ"

  if (historyEntry.includes(nSym)) {
    const re = new RegExp(`${nSym}${sqrtSym}([\\d.]+):([\\d.]+)`, 'g');
    // Превращаем "ⁿ√64:3" в красивое "3√64"
    historyEntry = historyEntry.replace(re, `$2${sqrtSym}$1`);
  }

  // 6. logYX логарифм Х по основанию Y
  if (historyEntry.includes('log(') && historyEntry.includes(':')) {
    const re = /log\(([\d.]+):([\d.]+)\)/g;
    // Превращаем "log(64:4)" в "log4(64)"
    historyEntry = historyEntry.replace(re, 'log$2($1)');
  }

  // 7. Случайное число между двух
  if (historyEntry.includes('#')) {
    historyEntry = historyEntry.replace(/([\d.]+)\s*#\s*([\d.]+)/g, 'rand($1, $2)');
  }

  // 9. Общие делители для двух чисел
  if (appState.expression.includes('divs:')) {
    // Если это наши делители, мы не добавляем "expression = result", 
    // так как результат уже содержит в себе условие.
    // historyEntry = ``;
    appState.historySession.push(`${result}`);
  } else {
    // X. Убедитесь, что ПОСЛЕ этого блока if/else в коде больше нет вызовов appState.historySession.push.
    appState.historySession.push(`${historyEntry} = ${result}`);
  }

  // Y. Обновляем состояние экрана
  // Используем float_toFixed, чтобы избежать проблем с точностью JS (например, 0.1 + 0.2)
  // appState.display = String(float_toFixed(+result)); - выводит NaN для 

  //  Проверяем, является ли результат "просто числом" (даже если оно в строке)
  // Регулярное выражение проверяет, состоит ли строка только из цифр, точки и знака минус
  const isSimpleNumber = /^-?\d+\.?\d*$/.test(String(result));

  if (isSimpleNumber) {
    // Это число (например, "4" или "3.14159") -> применяем округление
    const processed = float_toFixed(Number(result));

    if (String(processed) === 'NaN') {
      appState.display = 'ERROR';
    } else {
      appState.display = String(processed);
    }
  } else if (String(result).includes('e')) {
    // Если в результате есть буква 'e', выводим как есть (это уже готовая нотация JS)
    appState.display = String(result);
  } else {
    // Это текстовый результат (например, "24 ∩ 48 : [2, 4...]" или "ERROR")
    // Выводим как есть, не пропуская через float_toFixed
    appState.display = (result === undefined || String(result) === 'NaN') ? 'ERROR' : String(result);
  }

  appState.expression = '';
  appState.isNewInput = true;
}

// Вспомогательная функция для истории, чтобы не было "√(4 ="
function autoCloseBrackets(str) {
  const open = (str.match(/\(/g) || []).length;
  const close = (str.match(/\)/g) || []).length;
  return str + ')'.repeat(Math.max(0, open - close));
}





// console.log('История обновлена, текущая длина:', appState.historySession.length);
// console.log(`show appState:`)
// console.log({
//   'display': appState.display,
//   'M1 ': appState.M1,
//   'M2': appState.M2,
//   'M3 ': appState.M3,
//   'M4 ': appState.M4,
//   'historySession': $state.snapshot(appState.historySession), // ПРИМЕНЯЕМ snapshot Т.К. МУТИРУЕМ МАССИВ  appState.historySession.push(toHistory);
//   'isNewInput': appState.isNewInput,
//   'expression': appState.expression,
//   'numToFix': appState.numToFix,
// })