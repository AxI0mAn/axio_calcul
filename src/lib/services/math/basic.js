
/**
 * src/lib/services/math/basic.js

*/
import { appState } from "$lib/store/appState.svelte";
import { isLastCharOperator } from "../calculatorActions.svelte";
import { float_toFixed } from "../base";
import { performCalculation } from "../calculatorActions.svelte";


/** 
 * общая функция для констант
 * принимает значение 
 * показывает результат на экране
 * */
function showConstanta(constanta) {
  // 1. Подготавливаем значение константы
  const value = String(float_toFixed(constanta));

  // 2. Проверяем наличие операндов в выражении или состояние ввода
  // Регулярное выражение ищет любые знаки: + - * / (используем экранирование для - и *)
  const hasOperator = /[+\-*/]/.test(appState.expression);

  // 3. Логика вставки:
  // Если это новый ввод, либо на экране 0, либо в выражении НЕТ операнда — заменяем экран
  if (appState.isNewInput || appState.display === '0' || !hasOperator) {
    appState.display = value;
  }
  // Если операнд есть и мы в процессе ввода — добавляем константу к существующему числу
  else {
    appState.display += value;
  }

  // Устанавливаем флаг, что следующее нажатие цифры начнет новый ввод 
  // (чтобы цифры не "прилипали" к константе без оператора)
  appState.isNewInput = true;
}

//=======================================
/**
 * Добавляет число Пи
 */
export function addPi() {
  showConstanta(Math.PI)
}
/**
 * Добавляет число Эйлера
 */
export function addE() {
  showConstanta(Math.E)
}
/**
 * Добавляет число Золотое сечение
 */
export function addGold() {
  const gold = (1 + Math.sqrt(5)) / 2
  showConstanta(gold)
}
/**
 * Добавляет √2
 */
export function addSqrt2() {
  showConstanta(Math.sqrt(2))
}
/**
 * Добавляет ln10
 */
export function addLN10() {
  showConstanta(Math.LN10)
}
/**
 * Добавляет ln2
 */
export function addLN2() {
  showConstanta(Math.LN2)
}

//==============================================
/**
 * logBase(base=Y, x);   // Это logY(X) — универсальный логарифм  (основание Y)
 * Math.log(x);    // Это ln(x) — натуральный логарифм  (основание e)
 * Math.log10(x);  // Это lg(x) — десятичный  логарифм (основание 10)
 * Math.log2(x);   // Это log2(x) — двоичный  логарифм (основание 2) 
 */

/**
 * Логарифм X по основанию Y
 * Сначала вводим X, нажимаем кнопку, вводим Y
 */
export function funcLogYX() {
  const xValue = appState.display;
  if (xValue === '0' || xValue === '') return;

  // Формируем выражение: log(xValue:
  // Мы пишем "log", чтобы пользователь понимал операцию
  appState.expression = `log(${xValue}:`;

  appState.display = '';
  appState.isNewInput = true;
}

export function funcLgX() {
  const xValue = appState.display;
  if (parseFloat(xValue) <= 0) {
    appState.display = "ERROR";
    return;
  }
  // Сразу формируем итоговое выражение
  appState.expression = `log10(${xValue})`;
  appState.display = '';
  // Вызываем расчет программно
  performCalculation();
}

/** 
 * ln(x) — натуральный логарифм  (основание e)
 */
export function funcLnX() {
  const xValue = appState.display;

  // Проверка на допустимость (x > 0)
  if (parseFloat(xValue) <= 0) {
    appState.display = "ERROR";
    appState.isNewInput = true;
    return;
  }
  // Записываем в expression: ln(x)
  appState.expression = `ln(${xValue})`;
  appState.display = '';
  // Вызываем расчет программно
  performCalculation();
}

/**
 * log2(x) — двоичный  логарифм (основание 2) 
 */
export function funcLog2X() {
  const xValue = appState.display;
  if (parseFloat(xValue) <= 0) {
    appState.display = "ERROR";
    return;
  }
  // Сразу формируем итоговое выражение
  appState.expression = `log2(${xValue})`;
  appState.display = '';
  // Вызываем расчет программно
  performCalculation();
}
//===========================================


/**
 * Дроби (1/x)
 */
export function denominator() {
  let cur = appState.display;
  if (cur === '0') return;

  // Оборачиваем текущее значение
  if (+cur < 0) {
    appState.display = `(1/(${cur}))`;
  } else {
    appState.display = `(1/${cur})`;

  }
  // ВАЖНО: ставим флаг, что это "новое число", 
  // чтобы при нажатии "+" оно улетело в expression целиком
  appState.isNewInput = false;
}

/**
 * Корень квадратный
 */
export function addSqrt() {
  const sqrtSym = String.fromCharCode(8730);
  const val = String(appState.display);

  if (val !== '0' && !appState.isNewInput) {
    appState.display = `${sqrtSym}(${val})`;
  } else {
    appState.display = `${sqrtSym}(`;
  }
  appState.isNewInput = false;
}

/**
 * Корень степени Y из X (y√x)
 * Принцип: x ^ (1 / y)
 * Ввести х потом нажать кнопку функции, затем ввести у и нажать =
 */
export function addSqrtY() {
  const xValue = appState.display;
  if (xValue === '0' && appState.expression === '') return;

  const sqrtSym = String.fromCharCode(8730); // Символ √

  // Мы временно сохраняем x так, чтобы при склейке с y 
  // получилось "y√x". Для этого используем спец-разделитель.
  // Записываем конструкцию, которую потом легко поменяем местами. 
  appState.expression = `\u207F${sqrtSym}${xValue}:`;

  appState.display = '';
  appState.isNewInput = true;
}


/**
 * Вычисляет факториал числа, используя BigInt для обработки больших значений.
 * @returns {bigint|string} - факториал или строка с ошибкой
 * console.log(bigFactorial(5));   // 120n
console.log(bigFactorial(0));   // 1n
console.log(bigFactorial(171)); // Огромное число без потери точности
 */
export function bigFactorial() {
  const n = +appState.display;

  try {
    const val = BigInt(n);
    if (val < 0n) {
      appState.display = "ERROR";
      return;
    }

    let result = 1n;
    for (let i = 2n; i <= val; i++) result *= i;

    // 1. Сохраняем в историю красиво
    appState.historySession.push(`${n}! = ${String(result)}`);

    // 2. В display кладем ТОЛЬКО число, чтобы с ним можно было работать дальше
    appState.display = String(result);

    // 3. Очищаем expression и ставим флаг "Новый ввод"
    // Это позволит сразу нажать "+" и продолжить считать
    appState.expression = '';
    appState.isNewInput = true;

    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    appState.display = "ERROR";
  }
}


/**
 * Модуль числа (работает с текущим числом на экране)
 */
export function modul() {
  let val = String(appState.display);
  if (val.startsWith('-')) {
    appState.display = val.substring(1);
  }
}


/**
 * Проценты (%)
 * Вычисляет процент в зависимости от контекста:
 * 80 + 10% -> 10% от 80 = 8. (Итог: 80 + 8 = 88)
 * 80 * 10% -> 10% превращается в 0.1. (Итог: 80 * 0.1 = 8) * 
 * 80-10%=72
 * 80+10%=88
 * 80/10%=800
 * 80*10%=8
 */
export function percentage() {
  const currentVal = parseFloat(appState.display);

  // Если в памяти пусто, процент просто превращает число в дробь (10% = 0.1)
  if (appState.expression === '') {
    appState.display = String(currentVal / 100);
    appState.isNewInput = true;
    return;
  }

  // Извлекаем базовое число и оператор из выражения (например, "80+" или "80*")
  // Регулярка ищет число в начале и оператор в конце
  const match = appState.expression.match(/([\d.]+)\s*([-+*/^])\s*$/);

  if (match) {
    const baseValue = parseFloat(match[1]);
    const operator = match[2];
    let result;

    if (operator === '+' || operator === '-') {
      // Для сложения и вычитания: % — это доля от базы (80 + 10% от 80)
      result = (baseValue * currentVal) / 100;
    } else {
      // Для умножения и деления: % — это просто число / 100 (80 * 0.1)
      result = currentVal / 100;
    }

    appState.display = String(result);
    // Оставляем isNewInput = false, чтобы пользователь мог нажать "=" 
    // и увидеть финальный результат (например, 80 + 8 = 88)
    appState.isNewInput = false;
  }
}

//==============================================================

/**
 * Возведение в степень x^y
 * 2 -> x^y -> 3 -> = даст 8
 */
export function toPower() {
  const currentVal = appState.display;

  // Если дисплей пустой или "0", и в выражении ничего нет, 
  // возводить в степень нечего
  if (currentVal === '0' && appState.expression === '') return;

  // Используем нашу стандартную логику добавления оператора
  // Символ '^' позже будет заменен на '**' в evaluateExpression
  if (appState.expression === '' && currentVal !== '0') {
    appState.expression = currentVal + '^';
  } else if (isLastCharOperator(appState.expression) && appState.isNewInput) {
    // Если пользователь передумал и нажал ^ после +
    appState.expression = appState.expression.slice(0, -1) + '^';
  } else {
    appState.expression += currentVal + '^';
  }

  // Очищаем экран для ввода показателя степени (y)
  appState.display = '0';
  appState.isNewInput = true;
}

/**
 * Возведение e в степень e^x
 * e -> e^x -> 3 -> = даст 20.085541
 */
export function ePowerX() {
  const val = parseFloat(appState.display);
  const e = Math.E;

  // Если на экране 0 и ничего не вводилось, ничего не делаем
  if (val === 0 && appState.isNewInput && appState.expression === '') return;

  try {
    const result = e ** val;

    // 1. Формируем запись для истории
    // Если это было просто число 8, будет "8^2 = 64"
    // Если это был результат выражения (например 10+5), будет "15^2 = 225"
    appState.historySession.push(`e^${val} = ${float_toFixed(result)}`);

    // 2. Обновляем дисплей результатом
    appState.display = String(float_toFixed(result));

    // 3. Важно: сбрасываем выражение и ставим флаг нового ввода,
    // чтобы результат можно было сразу использовать в новых вычислениях
    appState.expression = '';
    appState.isNewInput = true;

  } catch (e) {
    console.error("ePowerX Error:", e);
    appState.display = "ERROR";
  }
}

/**
 * Возведение во вторую степень (квадрат)
 * 8 -> x^2 -> получаем 64
 */
export function toPower2() {
  const val = parseFloat(appState.display);

  // Если на экране 0 и ничего не вводилось, ничего не делаем
  if (val === 0 && appState.isNewInput && appState.expression === '') return;

  try {
    const result = val ** 2;

    // 1. Формируем запись для истории
    // Если это было просто число 8, будет "8^2 = 64"
    // Если это был результат выражения (например 10+5), будет "15^2 = 225"
    appState.historySession.push(`${val}^2 = ${float_toFixed(result)}`);

    // 2. Обновляем дисплей результатом
    appState.display = String(float_toFixed(result));

    // 3. Важно: сбрасываем выражение и ставим флаг нового ввода,
    // чтобы результат можно было сразу использовать в новых вычислениях
    appState.expression = '';
    appState.isNewInput = true;

  } catch (e) {
    console.error("Power2 Error:", e);
    appState.display = "ERROR";
  }
}

/**
 * Возведение в третью степень (куб)
 * 4 -> x^3 -> получаем 64
 */
export function toPower3() {
  const val = parseFloat(appState.display);

  // Если на экране 0 и ничего не вводилось, ничего не делаем
  if (val === 0 && appState.isNewInput && appState.expression === '') return;

  try {
    const result = val ** 3;

    // 1. Формируем красивую запись для истории 
    appState.historySession.push(`${val}^3 = ${float_toFixed(result)}`);

    // 2. Обновляем дисплей результатом
    appState.display = String(float_toFixed(result));

    // 3. Важно: сбрасываем выражение и ставим флаг нового ввода,
    // чтобы результат можно было сразу использовать в новых вычислениях
    appState.expression = '';
    appState.isNewInput = true;

  } catch (e) {
    console.error("Power3 Error:", e);
    appState.display = "ERROR";
  }
}

/**
 * Возведение 10 в степень у
 * 77 -> *10^y -> 5 ->  получаем 77*10^5
 * JS самостоятельно пересчитывает в е+5 если более 20 нулей
 * в src/lib/services/base.js есть function float_toFixed которая работает с выводом этих цифр
 */
export function tenPowerX() {
  let xValue = appState.display;

  // Если дисплей пуст, считаем x = 1 (чтобы получилось 1*10^y)
  if (xValue === '' || xValue === '0') xValue = '1';

  // Логика пункта 2: Сокращение длинных чисел (более 9 цифр)
  // Проверяем, является ли число целым и длинным
  if (xValue.length > 9 && !xValue.includes('.') && !xValue.includes('^')) {
    const match = xValue.match(/^(.*?)(0+)$/);
    if (match) {
      const mantissa = match[1]; // Значимая часть
      const zerosCount = match[2].length; // Количество нулей
      xValue = `${mantissa}*10^${zerosCount}`;
      appState.expression = xValue;
      appState.display = xValue;
      appState.isNewInput = true;
      return;
    }
  }

  // Логика пункта 1: Обычное нажатие кнопки
  appState.expression = `${xValue}*10^`;
  appState.display = ''; // Очищаем дисплей для ввода степени 'y'
  appState.isNewInput = true;
}

//===========================================================

/**
 * Округление x до y знаков
 * x [~] y
 */
export function roundUp() {
  const xValue = appState.display;

  // Если на экране 0 или пусто — игнорируем
  if (xValue === '0' || xValue === '') return;

  // Формируем выражение: x~
  // Пользователь увидит "17.698864~" в expression и введет y
  appState.expression = `${xValue}~`;

  appState.display = '';
  appState.isNewInput = true;
}


/**
 * Случайное число между X и Y
 * x [#] y
 */
export function funcRandom() {
  const xValue = appState.display;

  // Если на дисплее пусто, берем 0.
  // Если есть число, преобразуем его в целое (отсекаем дробную часть).
  const startValue = xValue === '' ? '0' : String(parseInt(xValue));

  // Формируем выражение: "X#" (например, "11#")
  appState.expression = `${startValue}#`;

  // Очищаем дисплей для ввода второго числа (Y)
  appState.display = '';
  appState.isNewInput = true;
}


/**
 * Разложение числа на простые множители (факторизация)
 */
export function multipliers() {
  let x = Math.abs(parseInt(appState.display));

  if (isNaN(x) || x < 2) return; // Простые множители ищем для чисел >= 2

  const originalX = x;
  const factors = [];
  let d = 2;

  // Алгоритм поиска множителей
  while (d * d <= x) {
    while (x % d === 0) {
      factors.push(d);
      x /= d;
    }
    d++;
  }
  if (x > 1) factors.push(x);

  // Формируем строку результата: "98=2*7*7"
  const resultString = `${originalX}=${factors.join('*')}`;

  // Выводим результат на дисплей
  appState.display = resultString;

  // Очищаем expression, чтобы результат не смешивался с прошлыми операциями
  appState.expression = '';
  appState.isNewInput = true;

  // Опционально: можно сразу добавить это в историю
  appState.historySession.push(resultString);
}


/**
 * Общие делители для X и Y
 * x [divs:] y
 */
export function allDivisors() {
  const xValue = appState.display;

  // Если на дисплее пусто или 0 — выходим
  if (xValue === '' || xValue === '0') return;

  // Формируем выражение: divs:24:
  appState.expression = `divs:${xValue}:`;

  appState.display = '';
  appState.isNewInput = true;
}