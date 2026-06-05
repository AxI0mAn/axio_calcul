/* eslint-disable no-useless-escape */
/**
 * src/lib/services/math/fractionActions.js
 * Обработчики кнопок для страницы дробей.
 */

/* eslint-disable no-unused-vars */
import { appState } from '$lib/store/appState.svelte.js';
import { Fraction, evaluateFractionExpression } from './fractionCore.js';
import { toSuperscript, fromSuperscript } from "$lib/utils/toSuperscript";
import FractionJS from 'fraction.js';

function isError() {
  return appState.display === 'ERROR';
}

function clearErrorIfNeeded() {
  if (isError()) {
    appState.display = '0';
    appState.expression = '';
    appState.isNewInput = true;
  }
}

// ---- цифры и точка ----
export function addDigitFraction(digit) {
  clearErrorIfNeeded();

  if (appState.isNewInput) {
    appState.display = digit;
    appState.isNewInput = false;
    return;
  }

  if (digit === '.') {
    // Защита: нельзя поставить точку, если строка пустая, уже содержит точку или заканчивается на спецсимвол
    if (appState.display === '' || /[\.^÷√\(\)]$/.test(appState.display)) return;

    // Защита от второй точки в текущем вводимом числе (с учетом знаков)
    const currentParts = appState.display.split(/[\+\-\*\/÷\^\(]/);
    const lastPart = currentParts[currentParts.length - 1];
    if (lastPart.includes('.')) return;

    appState.display += '.';
    return;
  }

  // КРИТИЧЕСКИЙ МОМЕНТ ДЛЯ СТЕПЕНИ: 
  // Если на дисплее уже есть знак '^', то ВСЕ последующие цифры 
  // мы принудительно переводим в верхний индекс (superscript)!
  if (appState.display.includes('^')) {
    const parts = appState.display.split('^');
    // Гарантируем, что parts[1] существует и является строкой, даже если split дал сбой
    if (parts[1] === undefined) parts[1] = '';
    parts[1] += toSuperscript(digit);
    appState.display = parts[0] + '^' + parts[1];
  } else {
    // Обычный ввод числа
    if (appState.display === '0') {
      appState.display = digit;
    } else {
      appState.display += digit;
    }
  }
}

// ---- операторы + - * / ÷ √ ^ ---- 
export function addOperatorFraction(op) {
  clearErrorIfNeeded();

  const lastChar = appState.display.slice(-1);

  // 1. Защита для корня √
  if (op === '√') {
    // Единственная защита — от точки прямо перед корнем
    if (lastChar === '.') return false;

    if (appState.display === '0' || appState.isNewInput) {
      appState.display = '√';
    } else {
      appState.display += '√';
    }
    appState.isNewInput = false;
    return true; // Всегда разрешаем добавить скобку ( в BtnBlockOpFraction
  }

  // 2. Защита для знака степени ^
  if (op === '^') {
    if (appState.display === '0' && appState.expression === '') return;
    // Запрещаем ставить степень после операторов, точек, открывающих скобок или если степень уже есть
    if (/[\+\-\*\/÷\^\.\(√]$/.test(appState.display)) return;

    appState.display += '^';
    appState.isNewInput = false;
    return;
  }

  // 3. Защита для знака деления ÷
  if (op === '÷') {
    if (appState.display === '0' && appState.expression === '') return;
    // Запрещаем ставить деление после любого оператора, точки или открывающей скобки
    if (/[\+\-\*\/÷\^\.\(√]$/.test(appState.display)) return;

    appState.display += '÷';
    appState.isNewInput = false;
    return;
  }

  // 4. Обычные операторы (+ - * /)
  if ((appState.display === '0' || appState.display === '') && appState.expression === '') {
    // Разрешаем унарный минус в начале ввода
    if (op === '-') {
      appState.display = op;
      appState.isNewInput = false;
    }
    return;
  }

  // Запрещаем ставить бинарный оператор после другого оператора или точки
  if (/[\+\-\*\/÷\^\.√]$/.test(appState.display) && !appState.isNewInput) return;

  if (appState.isNewInput && appState.expression !== '') {
    appState.expression = appState.expression.slice(0, -1) + op;
  } else {
    appState.expression += appState.display + op;
  }
  appState.display = '0';
  appState.isNewInput = true;
}

// ---- скобки ----
export function addBracketFraction(bracket) {
  clearErrorIfNeeded();

  if (bracket === '(') {
    // Если текущий дисплей равен '0' или включен флаг нового ввода, 
    // скобка должна ПОЛНОСТЬЮ заменить ноль, а не приклеиться к нему!
    if (appState.isNewInput || appState.display === '0') {
      appState.display = '(';
    } else {
      // Если пользователь ввел, например, "2" и нажал "(", это превратится в "2(" 
      appState.display += '(';
    }
    appState.isNewInput = false;
    return; // Не забываем return
  }
  else if (bracket === ')') {
    const current = appState.display;
    const mixedMatch = current.match(/^(-?\d+)\(([^()]+)\)$/);
    if (mixedMatch) {
      const whole = mixedMatch[1];
      const inner = mixedMatch[2];
      if (inner.includes('÷')) {
        const parts = inner.split('÷');
        if (parts.length === 2 && parts[0].match(/^\d+$/) && parts[1].match(/^\d+$/)) {
          appState.display = `${whole}⥑${parts[0]}÷${parts[1]}⥏`;
          appState.isNewInput = false;
          return;
        }
      }
    }
    appState.display += ')';
    appState.isNewInput = false;
  }
}

// ---- смена знака +/- ----
export function toggleSignFraction() {
  clearErrorIfNeeded();
  let current = appState.display;
  if (current === '0') return;

  if (/^-?\d+(\.\d+)?$/.test(current)) {
    appState.display = current.startsWith('-') ? current.slice(1) : '-' + current;
    appState.isNewInput = false;
    return;
  }
  const simpleMatch = current.match(/^(-?)(\d+)÷(\d+)$/);
  if (simpleMatch) {
    const sign = simpleMatch[1];
    const num = simpleMatch[2];
    const den = simpleMatch[3];
    appState.display = (sign === '-' ? '' : '-') + num + '÷' + den;
    appState.isNewInput = false;
    return;
  }
  const mixedMatch = current.match(/^(-?)(\d+)⥑(\d+)÷(\d+)⥏$/);
  if (mixedMatch) {
    const sign = mixedMatch[1];
    const whole = mixedMatch[2];
    const num = mixedMatch[3];
    const den = mixedMatch[4];
    appState.display = (sign === '-' ? '' : '-') + whole + '⥑' + num + '÷' + den + '⥏';
    appState.isNewInput = false;
  }
}

// ---- преобразование десятичной -> обычная ( .: ) ---- 
export function decimalToFraction() {
  clearErrorIfNeeded();

  // Если на экране уже дробь, то ничего делать не нужно
  if (appState.display.includes('÷') || appState.display.includes('⥑')) {
    return;
  }

  let value = parseFloat(appState.display);
  if (isNaN(value)) {
    appState.display = 'ERROR';
    return;
  }

  if (value === 0) {
    appState.display = '0';
    appState.isNewInput = true;
    return;
  }

  try {
    const frac = new FractionJS(value);
    const num = Math.abs(Number(frac.n));
    const den = Math.abs(Number(frac.d));
    const signStr = value < 0 ? '-' : '';

    const whole = Math.floor(num / den);
    const remainder = num % den;

    let resultStr = '';
    if (whole !== 0 && remainder !== 0) {
      resultStr = `${signStr}${whole}⥑${remainder}÷${den}⥏`;
    } else if (whole !== 0) {
      resultStr = `${signStr}${whole}`;
    } else {
      resultStr = `${signStr}${remainder}÷${den}`;
    }

    appState.display = resultStr;

    // Очищаем expression, чтобы дробь не дублировалась на экране!
    if (appState.expression !== undefined) {
      appState.expression = '';
    }

    // Ставим true, чтобы этот результат вел себя как готовое число,
    // и ввод новых цифр начинался заново, а не приклеивался к дроби
    appState.isNewInput = true;

  } catch (e) {
    console.error(e);
    appState.display = 'ERROR';
  }
}

// ---- преобразование обычной -> десятичная ( :. ) ----
export function fractionToDecimal() {
  clearErrorIfNeeded();
  const expr = appState.display;
  try {
    let normalized = expr.replace(/⥑/g, ' ').replace(/÷/g, '/').replace(/⥏/g, '');
    const frac = new FractionJS(normalized);
    const decimal = frac.valueOf();
    appState.display = String(decimal);
    appState.isNewInput = false;
  } catch (e) {
    console.error(e);
    appState.display = 'ERROR';
  }
}

// ---- возведение в квадрат  ----
export function fractionToPower2() {
  clearErrorIfNeeded();

  // Если на экране ничего нет, возводить в квадрат нечего
  if (appState.display === '0' && appState.expression === '') return;

  // Дописываем обычную двойку. Визуальный парсер сам увидит ^2, 
  // скроет птичку ^ и поднимет двойку в superscript!
  appState.display += '^2';
  appState.isNewInput = false;
}

/**
 * Равно (вычисление финального выражения).
 * Собирает цепочку из expression и display, автоматически закрывает скобки,
 * передает выражение в математическое ядро и управляет выводом результата или ERROR.
 */
export function evaluateFraction() {
  // Если калькулятор уже находится в состоянии ошибки, нажатие "=" сбрасывает его в "0"
  if (isError()) {
    appState.display = '0';
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  // Собираем полное выражение: склеиваем накопленную цепочку (expression) и текущий ввод (display)
  let fullExpr = '';
  if (appState.expression === '') {
    fullExpr = appState.display;
  } else {
    fullExpr = appState.expression + appState.display;
  }
  fullExpr = fullExpr.trim();

  // Предохранитель: если выражение пустое или равно нулю, ничего не делаем
  if (fullExpr === '' || fullExpr === '0') return;

  // === АВТОЗАКРЫТИЕ ВСЕХ НЕЗАКРЫТЫХ СКОБОК ===
  // Считаем количество открывающих и закрывающих скобок во всей строке
  const openBrackets = (fullExpr.match(/\(/g) || []).length;
  const closeBrackets = (fullExpr.match(/\)/g) || []).length;

  // Если есть незакрытые скобки (например, при вводе вложенных корней вида "√(√(64"),
  // калькулятор автоматически дописывает их в конец строки перед расчетом
  if (openBrackets > closeBrackets) {
    const missingCount = openBrackets - closeBrackets;
    const bracketsToAdd = ')'.repeat(missingCount);

    fullExpr += bracketsToAdd;
  }

  try {
    // 1. Переводим всю строку в чистый текстовый вид для математического ядра
    // (например, конвертируем superscript-символы степени: "2^³" -> "2^3")
    let cleanExpr = fromSuperscript(fullExpr);

    console.log("Исходная строка перед фиксом скобок:", cleanExpr);

    // 2. ИЗОЛЯЦИЯ ПРИОРИТЕТОВ СТЕПЕНИ ДЛЯ ЯДРА
    // Если пользователь ввел "1÷4^2", ядро без скобок посчитает это как (1÷4)^2.
    // Чтобы этого не происходило, мы заменяем конструкции "число÷число^степень" 
    // или "число÷(выражение)^степень" на изолированные скобки.

    // Случай А: Число ÷ Число ^ Любое выражение (включая дробные степени вроде 2÷3)
    if (cleanExpr.includes('÷') && cleanExpr.includes('^')) {
      // Сначала изолируем сам показатель степени, если там идет деление без скобок: "5^2÷3" -> "5^(2÷3)"
      cleanExpr = cleanExpr.replace(/\^([\d.÷]+)/g, '^($1)');

      // Теперь изолируем всю правую часть деления (основание вместе со степенью): "1÷5^(2÷3)" -> "1÷(5^(2÷3))"
      cleanExpr = cleanExpr.replace(/(\d+)÷(\d+)\^([(\d.÷)]+)/g, '$1÷($2^$3)');
    }

    // Убираем возможные дубликаты двойных скобок вокруг степеней, если они случайно возникли
    cleanExpr = cleanExpr.replace(/\^\(\(([^)]+)\)\)/g, '^($1)');

    console.log("Строка, отправляемая в ядро (ФИКС СКОБОК):", cleanExpr);

    // 3. ВЫЧИСЛЕНИЕ
    // Отправляем полностью сбалансированное и подготовленное выражение в парсер ядра
    const resultFraction = evaluateFractionExpression(cleanExpr);

    // Жесткая проверка на деление на ноль на уровне результата
    if (resultFraction.den === 0) throw new Error('Division by zero');

    // 4. ФОРМАТИРОВАНИЕ РЕЗУЛЬТАТА
    // Переводим полученную правильную дробь в смешанный вид для отображения
    const mixed = resultFraction.toMixed();
    let displayStr;

    if (mixed.whole !== 0 && mixed.num !== 0) {
      // Смешанная дробь с маркерами начала и конца дробной части (целое⥑числитель÷знаменатель⥏)
      displayStr = `${mixed.whole}⥑${mixed.num}÷${mixed.den}⥏`;
    } else if (mixed.whole !== 0) {
      // Только целое число
      displayStr = `${mixed.whole}`;
    } else {
      // Простая дробь без целой части
      displayStr = `${mixed.num}÷${mixed.den}`;
    }

    // 5. ЗАПИСЬ В ИСТОРИЮ СЕССИИ
    // Добавляем красивую строку с автоматически закрытыми скобками в массив истории
    appState.historySession.push({
      type: 'fractionSteps',
      steps: [fullExpr, displayStr]
    });

    // Обновляем состояние дисплея для пользователя
    appState.display = displayStr;
    appState.expression = '';
    appState.isNewInput = true;

  } catch (err) {
    console.error('Evaluation error:', err);

    // 1. В историю сессии отправляем исходное выражение и текстовый маркер 'ERROR'
    // Компонент DisFraction.svelte отобразит это в истории как: 1÷0+5 = ERROR
    appState.historySession.push({
      type: 'fractionSteps',
      steps: [fullExpr, 'ERROR']
    });

    // 2. КАК ДОЛЖНО БЫТЬ: переводим главный дисплей в режим ожидания (выводим "0")
    appState.display = '0';

    // 3. Очищаем верхнюю строку цепочки выражений
    appState.expression = '';

    // 4. Выставляем флаг, что следующий ввод сотрет этот ноль и начнется заново
    appState.isNewInput = true;
  }
}

// ---- очистка C ----
export function clearFraction() {
  appState.display = '0';
  appState.expression = '';
  appState.isNewInput = true;
}

// ---- backspace ⌫ ----
export function backspaceFraction() {
  if (isError()) {
    appState.display = '0';
    appState.isNewInput = true;
    return;
  }
  if (appState.display.length > 1) {
    appState.display = appState.display.slice(0, -1);
  } else {
    appState.display = '0';
    appState.isNewInput = true;
  }
}