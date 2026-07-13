/* eslint-disable no-useless-escape */
/**
 * src/lib/services/math/fractionActions.js
 * Обработчики кнопок для страницы дробей.
 */

/* eslint-disable no-unused-vars */
import { appState } from '$lib/store/appState.svelte.js';
import { Fraction, evaluateFractionExpression } from './fractionCore.js';
import { MARKERS, getUnclosedMarkersStack, stripMarkers } from './fractionVisualParser.js';
import { generateSteps } from './fractionSteps.js';
import { toSuperscript, fromSuperscript } from "$lib/utils/toSuperscript";
import FractionJS from 'fraction.js';

// ---- Локальное состояние для режима степени ----
let isPowerMode = false; // флаг, активен ли ввод показателя степени.
let powerDepth = 0; // счётчик незакрытых скобок внутри показателя степени.

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

/**
 * Вычисляет математическое выражение, переданное в виде строки
 * Поддерживает: +, -, *, /, ÷, ^, √, скобки, дроби
 * @param {string} expr - выражение для вычисления
 * @returns {number} - результат вычисления
 */
function evaluateExpression(expr) {
  if (!expr) return 0;

  // Очищаем выражение от пробелов
  let clean = expr.trim();

  // Заменяем ÷ на / для совместимости
  clean = clean.replace(/÷/g, '/');

  // Заменяем √ на Math.sqrt
  clean = clean.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');

  // Заменяем ^ на **
  clean = clean.replace(/\^/g, '**');

  try {
    // Безопасное вычисление
    const result = Function('"use strict"; return (' + clean + ')')();
    return result;
  } catch (e) {
    console.error('Evaluation error:', e);
    return NaN;
  }
}

/**
 * Преобразует десятичное число в смешанную дробь
 * @param {number} value - десятичное число
 * @returns {string} - строка в формате "целое⥑числитель÷знаменатель⥏" или "числитель÷знаменатель"
 */
function toMixedFraction(value) {
  if (!isFinite(value)) return 'ERROR';
  if (value === 0) return '0';

  // Определяем знак
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);

  // Находим целую часть
  const whole = Math.floor(absValue);
  const fractional = absValue - whole;

  if (fractional === 0) {
    return sign + whole;
  }

  // Преобразуем дробную часть в обыкновенную дробь
  // Используем точность 1e-12 для избежания ошибок округления
  const precision = 1e-12;
  let num = Math.round(fractional / precision);
  let den = Math.round(1 / precision);

  // Сокращаем дробь
  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  const divisor = gcd(num, den);
  num = num / divisor;
  den = den / divisor;

  // Форматируем результат
  if (whole > 0 && num > 0) {
    return `${sign}${whole}⥑${num}÷${den}⥏`;
  } else if (whole > 0) {
    return `${sign}${whole}`;
  } else {
    return `${sign}${num}÷${den}`;
  }
}

/**
 * Проверяет, есть ли ÷ или / на верхнем уровне внутри строки
 * @param {string} str - строка для проверки
 * @returns {boolean} - true если есть деление на верхнем уровне
 */
function hasDivisionOnTopLevel(str) {
  if (!str) {
    return false;
  }

  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (depth === 0 && (ch === '÷' || ch === '/')) {
      return true;
    }
  }
  return false;
}

// ===== ЕДИНАЯ ЛОГИКА ДЛЯ НЕЯВНЫХ ОПЕРАТОРОВ =====
/**
 * Проверяет, является ли содержимое скобок "чистой" дробью
 * @param {string} content - содержимое скобок
 * @returns {boolean} - true если это чистая дробь (число÷число или выражение÷выражение без других операторов на верхнем уровне)
 */
function isPureFractionContent(content) {
  if (!content) return false;

  let divCount = 0;
  let hasOtherOps = false;
  let depth = 0;

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (depth === 0) {
      if (ch === '÷' || ch === '/') {
        divCount++;
      } else if (/[\+\-\*]/.test(ch)) {
        hasOtherOps = true;
      }
    }
  }

  // Чистая дробь: ровно одна ÷ на верхнем уровне и нет других операторов
  return divCount === 1 && !hasOtherOps;
}

/**
 * Определяет оператор между числом и скобкой
 * @param {string} insideContent - содержимое скобок
 * @param {boolean} hasDivisionAfter - есть ли ÷ или / после закрывающей скобки
 * @param {boolean} isNumberBefore - есть ли число перед открывающей скобкой
 * @returns {'+' | '*'} 
 */
function getImplicitOperator(insideContent, hasDivisionAfter, isNumberBefore) {
  // Логируем ВХОДНЫЕ ДАННЫЕ

  // Если перед скобкой не число → умножение
  if (!isNumberBefore) {
    return '*';
  }

  // Если после скобки есть ÷ → умножение (это числитель)
  if (hasDivisionAfter) {
    return '*';
  }

  // Проверяем, является ли содержимое скобок "чистой" дробью
  const isPureFraction = isPureFractionContent(insideContent);

  // Если внутри есть ÷ → смешанная дробь → '+'
  if (isPureFraction) {
    return '+';
  }

  // Во всех остальных случаях → умножение
  return '*';
}

/**
 * Анализирует выражение и заменяет обычные скобки на маркеры
 * @param {string} fullExpr - выражение для анализа
 * @returns {string} - выражение с маркерами
 */
function analyzeAndReplaceMarkers(fullExpr) {
  if (!fullExpr) return fullExpr;

  // Находим все пары скобок
  const pairs = findMatchingParens(fullExpr);
  if (pairs.length === 0) return fullExpr;

  // Сортируем по глубине (от самой глубокой)
  pairs.sort((a, b) => b.depth - a.depth);

  let result = fullExpr;
  const replacements = [];

  for (const pair of pairs) {
    // Проверяем, не заменяли ли уже эту позицию
    if (pair.openPos >= result.length || pair.closePos >= result.length) continue;

    const type = getBracketType(pair.openPos, pair.closePos, result);
    let replacement = '';
    const content = result.substring(pair.openPos + 1, pair.closePos);
    const before = pair.openPos > 0 ? result[pair.openPos - 1] : '';
    const after = pair.closePos < result.length - 1 ? result[pair.closePos + 1] : '';

    switch (type) {
      case 'MIXED_FRACTION':
        // число(число÷число) → число⥑число÷число⥏
        replacement = before + MARKERS.WHOLE_START + content + MARKERS.WHOLE_END;
        // Удаляем старую открывающую скобку
        replacements.push({
          openPos: pair.openPos - (before ? 1 : 0),
          closePos: pair.closePos + (after ? 1 : 0),
          replacement: replacement,
          type: 'MIXED_FRACTION'
        });
        break;

      case 'NUMERATOR':
        // (выражение)÷ → ⥾выражение⥿÷
        replacement = MARKERS.COMPLEX_NUM_START + content + MARKERS.COMPLEX_END + after;
        replacements.push({
          openPos: pair.openPos,
          closePos: pair.closePos + 1,
          replacement: replacement,
          type: 'NUMERATOR'
        });
        break;

      case 'DENOMINATOR':
        // ÷(выражение) → ÷⥾выражение⥿
        replacement = before + MARKERS.COMPLEX_NUM_START + content + MARKERS.COMPLEX_END;
        replacements.push({
          openPos: pair.openPos - 1,
          closePos: pair.closePos,
          replacement: replacement,
          type: 'DENOMINATOR'
        });
        break;

      case 'SIMPLE_PARENS':
      default:
        // Оставляем как есть
        continue;
    }
  }

  // Применяем замены (от самой глубокой)
  for (const rep of replacements) {
    if (rep.openPos < 0 || rep.closePos > result.length) continue;
    const beforePart = result.substring(0, rep.openPos);
    const afterPart = result.substring(rep.closePos + 1);
    result = beforePart + rep.replacement + afterPart;
  }

  return result;
}

// Функция поиска пар скобок
function findMatchingParens(str) {
  const pairs = [];
  const stack = [];

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    // Игнорируем маркеры
    if (ch === MARKERS.WHOLE_START || ch === MARKERS.WHOLE_END ||
      ch === MARKERS.COMPLEX_NUM_START || ch === MARKERS.COMPLEX_END) {
      continue;
    }

    if (ch === '(') {
      stack.push(i);
    } else if (ch === ')') {
      if (stack.length === 0) continue; // несбалансированная скобка
      const openPos = stack.pop();
      const depth = stack.length;
      pairs.push({
        openPos: openPos,
        closePos: i,
        depth: depth
      });
    }
  }

  return pairs;
}

// Функция определения типа скобок
function getBracketType(openPos, closePos, fullExpr) {
  const content = fullExpr.substring(openPos + 1, closePos);
  const before = openPos > 0 ? fullExpr[openPos - 1] : '';
  const after = closePos < fullExpr.length - 1 ? fullExpr[closePos + 1] : '';

  // Проверяем, является ли содержимое простой дробью
  const divCount = (content.match(/÷/g) || []).length;
  const hasOtherOps = /[\+\-\*]/.test(content.replace(/÷/g, ''));
  const isSimpleFraction = (divCount === 1) && !hasOtherOps;

  // Проверяем, есть ли число перед скобкой
  const isNumberBefore = before && /^-?\d+$/.test(before);

  // ===== ЕСЛИ ЭТО ПРОСТАЯ ДРОБЬ И ПЕРЕД НЕЙ НЕТ ЧИСЛА =====
  // То это просто дробь, не требующая замены
  if (isSimpleFraction && !isNumberBefore) {
    return 'SIMPLE_PARENS';
  }

  // Если после скобки * или /, это умножение, а не дробь
  if (after === '*' || after === '/') {
    return 'SIMPLE_PARENS';
  }

  // ===== СМЕШАННАЯ ДРОБЬ (ЛЮБОЕ СОДЕРЖИМОЕ) =====
  // число(любое выражение÷любое выражение)
  // Проверяем: перед скобкой число, внутри есть ÷ или / на верхнем уровне
  if (isNumberBefore && hasDivisionOnTopLevel(content)) {
    if (after !== '÷' && after !== '/') {
      return 'MIXED_FRACTION';
    }
  }

  // === ПРАВИЛО 1: Числитель дроби ===
  // (выражение)÷
  if (after === '÷' || after === '/') {
    if (isSimpleFraction && !isNumberBefore) {
      return 'SIMPLE_PARENS';
    }
    if (hasOtherOps || content.includes('(')) {
      return 'NUMERATOR';
    }
  }

  // === ПРАВИЛО 2: Знаменатель дроби ===
  // ÷(выражение)
  if (before === '÷' || before === '/') {
    return 'DENOMINATOR';
  }

  // === ПРАВИЛО 5: Простые скобки ===
  return 'SIMPLE_PARENS';
}

// В evaluateFraction, после анализа, добавить обработку умножения на дробь

// === ОБРАБОТКА: (выражение)*(дробь) ===
// Ищем паттерн: (выражение)*(дробь) где дробь - простая или смешанная
// Заменяем на вычисленное значение

// Пример: (5+4-3)*(2÷5) → 6*(2÷5) → (12÷5) → 2(2÷5)

function handleMultiplicationByFraction(fullExpr) {
  // Ищем паттерн: (выражение)*(дробь)
  const pattern = /\(([^()]+)\)\*\((\d+÷\d+)\)/g;
  let result = fullExpr;
  let match;

  while ((match = pattern.exec(fullExpr)) !== null) {
    const expr = match[1];
    const fraction = match[2];

    // Вычисляем выражение в скобках
    const value = evaluateExpression(expr);

    // Умножаем на дробь
    const parts = fraction.split('÷');
    const num = parseInt(parts[0]);
    const den = parseInt(parts[1]);
    const resultValue = value * (num / den);

    // Преобразуем в смешанную дробь
    const mixed = toMixedFraction(resultValue);

    // Заменяем в выражении
    result = result.replace(`(${expr})*(${fraction})`, mixed);
  }

  return result;
}

// ---- вспомогательные функции для проверки готовности маркеров к закрытию ----
/**
 * Проверяет, есть ли незакрытая сложная скобка (⥾) в выражении.
 */
function hasUnclosedComplexMarker(expr) {
  const stack = getUnclosedMarkersStack(expr);
  return stack.length > 0;
}

/**
 * Проверяет, есть ли незакрытая целая часть (⥑ без ⥏).
 */
function hasUnclosedWholePart(expr) {
  const open = (expr.match(/⥑/g) || []).length;
  const close = (expr.match(/⥏/g) || []).length;
  return open > close;
}

/**
 * Проверяет, завершён ли ввод числителя (внутри последней открытой ⥾).
 * Условия: нет незакрытых круглых скобок внутри и последний символ display — цифра или ')'.
 */
function isNumeratorReadyToClose(expr, display) {
  const lastOpen = expr.lastIndexOf(MARKERS.COMPLEX_NUM_START);
  if (lastOpen === -1) return false;
  const inside = expr.substring(lastOpen + 1);
  let openParens = 0, closeParens = 0;
  for (const ch of inside) {
    if (ch === '(') openParens++;
    if (ch === ')') closeParens++;
    if (ch === MARKERS.COMPLEX_END) return false; // уже закрыт
  }
  if (openParens > closeParens) return false; // есть незакрытые скобки внутри
  // Дополнительное условие: последний символ display — ')' (явное закрытие)
  const lastChar = display.slice(-1);
  return lastChar === ')';
}

/**
 * Проверяет, завершена ли целая часть (внутри последней открытой ⥑).
 * Аналогично, но для маркера ⥑.
 */
function isWholePartReadyToClose(expr, display) {
  const lastOpen = expr.lastIndexOf(MARKERS.WHOLE_START);
  if (lastOpen === -1) return false;
  const inside = expr.substring(lastOpen + 1);
  let openParens = 0, closeParens = 0;
  for (const ch of inside) {
    if (ch === '(') openParens++;
    if (ch === ')') closeParens++;
    if (ch === MARKERS.WHOLE_END) return false;
  }
  if (openParens > closeParens) return false;
  const lastChar = display.slice(-1);
  return lastChar === ')';
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

    // В режиме степени точка добавляется как обычный символ (без суперскрипта)
    if (isPowerMode) {
      appState.display += '.';
      return;
    }
    appState.display += '.';
    return;
  }

  // ---- В режиме степени все цифры добавляются как обычные символы ----
  if (isPowerMode) {
    appState.display += digit;
    return;
  }

  if (appState.display === '0') {
    appState.display = digit;
  } else {
    appState.display += digit;
  }
}

// ---- операторы + - * / ÷ √ ^ ---- 
export function addOperatorFraction(op) {
  clearErrorIfNeeded();

  // ---- Если активен режим степени и есть незакрытые скобки, оператор добавляется внутрь показателя ----
  if (isPowerMode && powerDepth > 0) {
    appState.display += op;
    appState.isNewInput = false;
    return;
  }

  const lastChar = appState.display.slice(-1);

  // 1. Защита для корня √
  if (op === '√') {
    if (isPowerMode) {
      appState.display += '√';
      appState.isNewInput = false;
      return true;
    }
    if (lastChar === '.') return false;
    if (appState.display === '0' || appState.isNewInput) {
      appState.display = '√';
    } else {
      appState.display += '√';
    }
    appState.isNewInput = false;
    return true;
  }

  // 2. Защита для знака степени ^
  if (op === '^') {
    if (appState.display === '0' && appState.expression !== '') {
      return;
    }
    if (appState.display === '0' && appState.expression === '') return;
    if (/[\+\-\*\/÷\^\.\(√]$/.test(appState.display)) return;

    appState.display += '^';
    appState.isNewInput = false;
    isPowerMode = true;
    powerDepth = 0;
    return;
  }

  // 2.5. ЛОГИКА для бинарных операторов при активном режиме степени ----
  const isBinaryOp = ['+', '-', '*', '/', '÷'].includes(op);
  if (isPowerMode && isBinaryOp) {
    if (powerDepth > 0) {
      appState.display += op;
      appState.isNewInput = false;
      return;
    } else {
      isPowerMode = false;
    }
  }

  // 3. Защита для знака дроби ÷ и деления /
  if (op === '÷' || op === '/') {
    const hasPower = /[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(appState.display) || appState.display.includes('^');
    if (hasPower) {
      appState.display += '÷';
      appState.isNewInput = false;
      return;
    }

    if (appState.display === '0' && appState.expression === '') return;
    if (/[\+\-\*\/÷\^\.\(√]$/.test(appState.display)) return;

    const fullExpr = (appState.expression || '') + (appState.display || '');
    if (hasUnclosedComplexMarker(fullExpr) && isNumeratorReadyToClose(fullExpr, appState.display)) {
      appState.display += MARKERS.COMPLEX_END;
    }
    appState.display += '÷';
    appState.isNewInput = false;
    return;
  }

  // 4. Обработка обычных операторов (+ - * /) с завершением степени
  if ((appState.display === '0' || appState.display === '') && appState.expression === '') {
    if (op === '-') {
      appState.display = op;
      appState.isNewInput = false;
    }
    return;
  }

  // Если активен режим степени и нет незакрытых скобок, завершаем степень
  if (isPowerMode && powerDepth === 0) {
    appState.expression += appState.display + op;
    appState.display = '0';
    appState.isNewInput = true;
    isPowerMode = false;
    return;
  }

  if (/[\+\-\*\/÷\^\.√]$/.test(appState.display) && !appState.isNewInput) return;

  const fullExpr = (appState.expression || '') + (appState.display || '');

  // Закрываем целую часть, если знаменатель закрыт, целая часть открыта и завершена
  if (!hasUnclosedComplexMarker(fullExpr) &&
    hasUnclosedWholePart(fullExpr) &&
    isWholePartReadyToClose(fullExpr, appState.display)) {
    appState.display += MARKERS.WHOLE_END;
  }
  // ===== ПЕРЕНОС В EXPRESSION =====
  const displayValue = appState.display;

  if (appState.isNewInput && appState.expression !== '') {
    appState.expression = appState.expression.slice(0, -1) + op;
  } else {
    appState.expression += appState.display + op;
  }
  appState.display = '0';
  appState.isNewInput = true;
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

  // Убираем внешние скобки, если они есть вокруг десятичного числа
  function extractNumberFromDisplay(str) {
    const trimmed = str.trim();
    // Поддерживает: (0.5), (-0.5), (.5), (-.5), (5), (-5)
    const match = trimmed.match(/^\((-?\d*\.?\d+)\)$/);
    if (match) {
      return match[1];
    }
    return trimmed;
  }

  // Если на экране уже дробь, то ничего делать не нужно
  if (appState.display.includes('÷') || appState.display.includes('⥑')) {
    return;
  }

  // Фиксируем исходное значение для записи в историю сессии
  const originalDisplay = appState.display;

  const numberStr = extractNumberFromDisplay(appState.display);
  let value = parseFloat(numberStr);
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

    // ДОПОЛНЕНИЕ: Запись операции перевода в историю сессии
    appState.historySession.push({
      type: 'fractionSteps',
      steps: [originalDisplay, resultStr]
    });

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

  if (isError()) return;

  const originalDisplay = appState.display;
  const expr = appState.display;

  // ===== ОБРАБОТКА ДЕЛЕНИЯ НА НОЛЬ (единая точка) =====
  if (/[÷/]0(?=\D|$|\))/.test(expr)) {
    appState.historySession.push({
      type: 'fractionSteps',
      steps: [expr, 'ERROR']
    });
    appState.display = 'ERROR';
    appState.expression = '';
    appState.isNewInput = true;
    return;
  }

  try {
    // Нормализация: маркеры → скобки
    let normalized = expr
      .replace(/⥾/g, '(')
      .replace(/⥿/g, ')')
      .replace(/⥑/g, '(')
      .replace(/⥏/g, ')');

    // Распознаем смешанную дробь: "7(1÷5)" → "7 1/5"
    const mixedMatch = normalized.match(/^(-?)(\d+)\((\d+)[÷/](\d+)\)$/);
    if (mixedMatch) {
      const sign = mixedMatch[1] === '-' ? '-' : '';
      const whole = mixedMatch[2];
      const num = mixedMatch[3];
      const den = mixedMatch[4];

      // Проверка на деление на ноль (дублирующая, но оставляем для безопасности)
      if (parseInt(den) === 0) {
        throw new Error('Division by zero');
      }

      normalized = `${sign}${whole} ${num}/${den}`;
    } else {
      // Простая дробь: "3÷4" → "3/4"
      normalized = normalized.replace(/÷/g, '/');
    }

    const frac = new FractionJS(normalized);
    const decimal = frac.valueOf();
    const resultStr = String(decimal);

    appState.historySession.push({
      type: 'fractionSteps',
      steps: [originalDisplay, resultStr]
    });

    appState.display = resultStr;
    appState.isNewInput = true;
  } catch (e) {
    console.error('fractionToDecimal error:', e);

    appState.historySession.push({
      type: 'fractionSteps',
      steps: [originalDisplay, 'ERROR']
    });

    appState.display = 'ERROR';
    appState.expression = '';
    appState.isNewInput = true;
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

// ---- скобки ----
/**
* Обработчик нажатия скобок ( и ) для дробного калькулятора.
* @param {string} bracket - '(' или ')'
*/
export function addBracketFraction(bracket) {
  clearErrorIfNeeded();

  if (bracket === '(') {
    // ---- Если активен режим степени ----
    if (isPowerMode) {
      appState.display += '(';
      powerDepth++;
      appState.isNewInput = false;
      return;
    }

    let shouldReplace = false;

    if (appState.isNewInput || appState.display === '0' || appState.display === '') {
      shouldReplace = true;
    }

    // ===== ВСЕГДА ДОБАВЛЯЕМ ОБЫЧНУЮ СКОБКУ =====
    if (shouldReplace) {
      appState.display = '(';
    } else {
      appState.display += '(';
    }

    appState.isNewInput = false;
    return;
  }

  if (bracket === ')') {
    // ---- Если активен режим степени ----
    if (isPowerMode) {
      appState.display += ')';
      powerDepth--;
      if (powerDepth < 0) powerDepth = 0;
      if (powerDepth === 0) {
        isPowerMode = false;
      }
      appState.isNewInput = false;
      return;
    }

    // ===== ВСЕГДА ДОБАВЛЯЕМ ОБЫЧНУЮ СКОБКУ =====
    appState.display += ')';
    appState.isNewInput = false;
    return;
  }
}

/**
 * Автодополнение пустых или незавершённых скобок в выражении.
 * - Удаляет пары пустых скобок: "3()" → "3"
 * - Удаляет конечный оператор (кроме ÷) внутри скобок: "(1÷2+)" → "(1÷2)"
 * - Не трогает ошибочные конструкции вида "(1÷)" или "(÷2)" (оставляет для дальнейшей обработки)
 *
 * @param {string} expr - исходное выражение с круглыми скобками
 * @returns {string} - выражение с исправленными скобками
 */
export function autoCompleteEmptyBrackets(expr) {
  let result = expr;
  let changed = false;

  do {
    changed = false;
    result = result.replace(/\(([^()]*)\)/g, (match, content) => {
      // Случай 1: пустое содержимое -> удаляем пару скобок
      if (content === "") {
        changed = true;
        return "";
      }

      // Случай 2: содержимое состоит только из операторов (кроме ÷? разрешим любые, но ÷ сам по себе не оператор, а разделитель)
      // Удаляем такие скобки полностью, так как внутри нет чисел
      if (/^[\+\-\*\/÷]+$/.test(content)) {
        changed = true;
        return "";
      }

      // Случай 3: содержимое заканчивается на оператор + - * / (не на ÷)
      // и после удаления этого оператора содержимое не пусто и не состоит только из операторов
      if (/[\+\-\*\/]$/.test(content)) {
        const trimmed = content.slice(0, -1);
        if (trimmed !== "" && !/^[\+\-\*\/÷]+$/.test(trimmed)) {
          changed = true;
          return "(" + trimmed + ")";
        }
      }

      // Все остальные случаи (в том числе (1÷), (÷2), (1÷2)) – без изменений
      return match;
    });
  } while (changed);

  return result;
}

/**
 * Вставляет явный знак умножения '*' или сложения '+' в местах неявных операций.
 * Использует единую функцию getImplicitOperator для определения оператора.
 * @param {string} expr - выражение с обычными скобками (без маркеров)
 * @returns {string} - выражение с явными операторами
 */
export function insertImplicitMultiplication(expr) {
  if (!expr) return expr;

  // Вспомогательная функция: найти парную закрывающую скобку
  function findMatchingClose(str, openPos) {
    let depth = 1;
    for (let i = openPos + 1; i < str.length; i++) {
      if (str[i] === '(') depth++;
      else if (str[i] === ')') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  // Вспомогательная: проверяет, есть ли после закрывающей скобки (пропуская пробелы) знак деления
  function hasDivisionAfter(str, closePos) {
    let i = closePos + 1;
    while (i < str.length && str[i] === ' ') i++;
    return i < str.length && /[÷\/]/.test(str[i]);
  }

  let result = expr;
  let i = 0;

  // Проход 1: вставка операторов перед открывающими скобками
  while (i < result.length) {
    if (result[i] === '(') {
      // Определяем предыдущий значимый символ (не пробел)
      let prevIdx = i - 1;
      while (prevIdx >= 0 && result[prevIdx] === ' ') prevIdx--;
      if (prevIdx < 0) { i++; continue; }
      const prevChar = result[prevIdx];

      // Проверяем, является ли prevChar числом или ')'
      const isNumber = /\d/.test(prevChar);
      const isClosingBracket = prevChar === ')';

      if (isNumber || isClosingBracket) {
        // Находим парную закрывающую скобку 
        const closePos = findMatchingClose(result, i);
        if (closePos === -1) { i++; continue; }

        // Получаем содержимое скобок
        const insideContent = result.substring(i + 1, closePos);
        // Проверяем, есть ли деление после
        const hasDivAfter = hasDivisionAfter(result, closePos);

        // Используем единую функцию для определения оператора
        const operator = getImplicitOperator(insideContent, hasDivAfter, isNumber);

        // Проверяем, что между prevIdx и i нет другого оператора (кроме пробелов)
        let hasOpBetween = false;
        for (let k = prevIdx + 1; k < i; k++) {
          if (result[k] !== ' ' && /[+\-*/÷^()]/.test(result[k])) {
            hasOpBetween = true;
            break;
          }
        }

        if (!hasOpBetween) {
          // Вставляем оператор перед '('
          result = result.slice(0, i) + operator + result.slice(i);
          i += 2; // пропускаем оператор и '('
          continue;
        }
      }
    }
    i++;
  }

  // Проход 2: вставка '*' между ')' и числом (например, (1÷4)3...)
  result = result.replace(/\)(\d+)/g, ')*$1');

  return result;
}

/**
 * Вставляет '+' или '*' между числом/закрывающей скобкой и открывающей скобкой
 * Использует единую функцию getImplicitOperator для определения оператора.
 * @param {string} expr - выражение с обычными скобками (без маркеров)
 * @returns {string} - выражение с явными операторами
 */
export function processImplicitOperators(expr) {
  if (!expr) return expr;

  function findMatchingClose(str, openPos) {
    let depth = 1;
    for (let i = openPos + 1; i < str.length; i++) {
      if (str[i] === '(') depth++;
      else if (str[i] === ')') {
        depth--;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function hasDivisionAfter(str, closePos) {
    let i = closePos + 1;
    while (i < str.length && str[i] === ' ') i++;
    return i < str.length && /[÷\/]/.test(str[i]);
  }

  let result = expr;
  let i = 0;

  while (i < result.length) {
    if (result[i] === '(') {
      let prevIdx = i - 1;
      while (prevIdx >= 0 && result[prevIdx] === ' ') prevIdx--;
      if (prevIdx < 0) { i++; continue; }

      const prevChar = result[prevIdx];
      const isNumber = /\d/.test(prevChar);
      const isClosingBracket = prevChar === ')';

      if (!isNumber && !isClosingBracket) { i++; continue; }

      // Проверяем, есть ли оператор между
      let hasOperatorBetween = false;
      for (let k = prevIdx + 1; k < i; k++) {
        if (result[k] !== ' ' && /[+\-*/÷^()]/.test(result[k])) {
          hasOperatorBetween = true;
          break;
        }
      }
      if (hasOperatorBetween) { i++; continue; }

      const closePos = findMatchingClose(result, i);
      if (closePos === -1) { i++; continue; }

      const insideContent = result.substring(i + 1, closePos);
      const hasDivAfter = hasDivisionAfter(result, closePos);

      // Если предыдущий символ - ')', обрабатываем отдельно
      if (isClosingBracket) {
        const operator = getImplicitOperator(insideContent, hasDivAfter, false);
        result = result.slice(0, i) + operator + result.slice(i);
        i += 2;
        continue;
      }

      // Если перед скобкой число
      // Находим начало числа (учитываем знак минус)
      let start = prevIdx;
      while (start > 0 && /[\d.]/.test(result[start - 1])) start--;

      // Проверяем, есть ли минус перед числом
      let hasMinus = false;
      if (start > 0 && result[start - 1] === '-') {
        // Проверяем, что это унарный минус (перед ним не число и не ')')
        const beforeMinus = start - 2;
        if (beforeMinus < 0 || !/[\d)]/.test(result[beforeMinus])) {
          hasMinus = true;
          start--;
        }
      }

      const numberStr = result.slice(start, i);

      // Проверяем, что это число
      if (!/^-?\d+\.?\d*$/.test(numberStr)) { i++; continue; }

      // Определяем оператор
      const operator = getImplicitOperator(insideContent, hasDivAfter, true);

      // Просто вставляем оператор между числом и скобкой
      // НЕ преобразуем в -(число+...)
      result = result.slice(0, i) + operator + result.slice(i);
      i += 2;

    } else {
      i++;
    }
  }

  return result;
}

/**
 * Преобразует смешанные дроби вида [−]число(выражение)÷ в [−]число+(выражение)÷
 * Поддерживает обычные скобки () и маркеры ⥑/⥾ (открывающие) и ⥏/⥿ (закрывающие).
 * Ищет сбалансированные скобки, следующие сразу за целым числом (с опциональным минусом),
 * и проверяет, что после закрывающей скобки идёт символ '÷'.
 *
 * @param {string} expr - выражение (может содержать маркеры)
 * @returns {string} - преобразованное выражение
 */
export function transformMixedFractionWithDivision(expr) {
  if (!expr) return expr;

  const openBrackets = ['(', MARKERS.WHOLE_START, MARKERS.COMPLEX_NUM_START];
  const closeBrackets = [')', MARKERS.WHOLE_END, MARKERS.COMPLEX_END];

  function findMatchingClose(str, startIdx) {
    const openChar = str[startIdx];
    const openIndex = openBrackets.indexOf(openChar);
    if (openIndex === -1) return -1;
    const closeChar = closeBrackets[openIndex];
    let stack = 1;
    let idx = startIdx + 1;
    while (idx < str.length && stack > 0) {
      const ch = str[idx];
      if (ch === openChar) stack++;
      else if (ch === closeChar) stack--;
      idx++;
    }
    return stack === 0 ? idx - 1 : -1;
  }

  let result = expr;
  let i = 0;
  while (i < result.length) {
    // Пропускаем возможный знак минуса перед числом
    let sign = '';
    if (result[i] === '-') {
      sign = '-';
      i++;
    }
    // Ищем цифры числа
    if (i < result.length && /\d/.test(result[i])) {
      let numStart = i;
      while (i < result.length && /\d/.test(result[i])) i++;
      let numEnd = i;
      // Восстанавливаем полное число с учётом знака
      const fullNum = sign + result.slice(numStart, numEnd);
      // Проверяем, что после числа идёт открывающая скобка
      if (numEnd < result.length && openBrackets.includes(result[numEnd])) {
        let openPos = numEnd;
        let closePos = findMatchingClose(result, openPos);
        if (closePos !== -1 && closePos + 1 < result.length && result[closePos + 1] === '÷') {
          // Если число отрицательное – пропускаем, т.к. оно уже обработано в transformNegativeMixedNumber
          if (fullNum.startsWith('-')) {
            i++;
            continue;
          }
          const bracketPart = result.slice(openPos, closePos + 1);
          // Проверяем, является ли выражение в скобках смешанной дробью
          // (ровно одна ÷ на верхнем уровне и нет других операторов)
          const openChar = result[openPos];
          const closeChar = closeBrackets[openBrackets.indexOf(openChar)];
          const bracketContent = result.slice(openPos + 1, closePos);

          // Анализируем верхний уровень вложенности
          let divCountOnTopLevel = 0;
          let hasOtherOpsOnTopLevel = false;
          let depth = 0;
          const OPEN_MARKER = MARKERS.COMPLEX_NUM_START;
          const CLOSE_MARKER = MARKERS.COMPLEX_END;

          for (let k = 0; k < bracketContent.length; k++) {
            const ch = bracketContent[k];
            if (ch === OPEN_MARKER) depth++;
            else if (ch === CLOSE_MARKER) depth--;
            else if (depth === 0) {
              if (ch === '÷') divCountOnTopLevel++;
              else if (/[\+\-\*]/.test(ch)) hasOtherOpsOnTopLevel = true;
            }
          }

          const isSimpleFraction = (divCountOnTopLevel === 1) && !hasOtherOpsOnTopLevel;

          // Если это смешанная дробь, НЕ вставляем *, иначе вставляем
          const replacement = isSimpleFraction
            ? fullNum + bracketPart + '÷'  // БЕЗ *
            : fullNum + '*' + bracketPart + '÷';  // С *
          result = result.slice(0, numStart - (sign ? 1 : 0)) + replacement + result.slice(closePos + 2);
          i = numStart - (sign ? 1 : 0) + replacement.length;
          continue;
        }
      }
    }

    // ===== ИСПРАВЛЕНИЕ: Обработка деления смешанной дроби =====
    // Паттерн: число⥑дробь⥏÷число → (число+дробь)÷число
    // Ищем паттерн: целая часть + маркеры ⥑...⥏, за которыми идет ÷ и число
    const mixedDivisionMatch = result.slice(i).match(/^(\d+)⥑([^⥏]+)⥏÷(\d+)/);
    if (mixedDivisionMatch) {
      const whole = mixedDivisionMatch[1];
      const fraction = mixedDivisionMatch[2];
      const divisor = mixedDivisionMatch[3];
      const fullMatch = mixedDivisionMatch[0];
      const replacement = '(' + whole + '+' + fraction + ')÷' + divisor;
      result = result.slice(0, i) + replacement + result.slice(i + fullMatch.length);
      i = i + replacement.length;
      continue;
    }
    // ===== КОНЕЦ ИСПРАВЛЕНИЯ =====

    i++;
  }
  return result;
}

/**
 * Преобразует смешанные числа без знаменателя вида число⥑дробь⥏ в число+⥑дробь⥏.
 * Работает с маркерами целой части ⥑ и ⥏.
 * 
 * Паттерн: -?(\d+)⥑ ... ⥏ , где внутри между ⥑ и ⥏ ровно одна операция '÷' и нет других операторов.
 * 
 * Пример: "2⥑1÷2⥏+3⥑1÷3⥏" → "2+⥑1÷2⥏+3+⥑1÷3⥏"
 *         "-2⥑1÷2⥏+3⥑1÷3⥏" → "-(2+⥑1÷2⥏)+3+⥑1÷3⥏"
 * 
 * Если внутри есть другие операторы, или после ⥏ идёт ÷, или нет ÷ внутри – преобразование не выполняется.
 *
 * @param {string} expr - выражение с маркерами ⥑ и ⥏
 * @returns {string} - преобразованное выражение
 */
export function transformMixedNumberWithoutDivision(expr) {
  if (!expr) return expr;

  const OPEN = MARKERS.WHOLE_START;   // '⥑'
  const CLOSE = MARKERS.WHOLE_END;    // '⥏'

  function findMatchingCloseMarker(str, startIdx) {
    if (str[startIdx] !== OPEN) return -1;
    let stack = 1;
    let i = startIdx + 1;
    while (i < str.length && stack > 0) {
      if (str[i] === OPEN) stack++;
      else if (str[i] === CLOSE) stack--;
      i++;
    }
    return stack === 0 ? i - 1 : -1;
  }

  let result = expr;
  let i = 0;

  while (i < result.length) {
    let match = result.slice(i).match(/^(-?\d+)⥑/);
    if (match) {
      const fullMatch = match[0];
      const numberPart = match[1];
      const numStart = i;
      const openPos = i + fullMatch.length - 1;
      const closePos = findMatchingCloseMarker(result, openPos);

      if (closePos !== -1) {
        const content = result.slice(openPos + 1, closePos);

        // Проверяем: ровно один ÷, нет других операторов
        const hasDiv = content.includes('÷');
        const hasOtherOps = /[\+\-\*]/.test(content);
        const isSimpleFraction = hasDiv && !hasOtherOps;

        if (isSimpleFraction) {
          // ===== ПРОСТАЯ ДРОБЬ: НЕ добавляем + и скобки =====
          // Оставляем как есть: 9⥑7÷23⥏
          // Просто пропускаем, ничего не меняем
          i += fullMatch.length;
          continue;
        }
      }
      i += fullMatch.length;
    } else {
      i++;
    }
  }

  return result;
}

/**
 * Преобразует -число(выражение)÷ в -(число+выражение)÷.
 * Поддерживает маркеры целой части (⥑...⥏) и сложных выражений (⥾...⥿).
 * 
 * Пример: "-3⥾1÷2⥿÷4" → "-1(3+⥾1÷2⥿)÷4" → после stripMarkers: "-(3+(1÷2))÷4"
 * 
 * Проверяет, что внутри маркеров ровно одна операция '÷' и нет других операторов.
 * Если условие не выполнено – оставляет строку без изменений.
 */
export function transformNegativeMixedNumber(expr) {
  if (!expr) return expr;

  const OPEN_MARKERS = [MARKERS.WHOLE_START, MARKERS.COMPLEX_NUM_START];
  const CLOSE_MARKERS = [MARKERS.WHOLE_END, MARKERS.COMPLEX_END];

  function findMatchingClose(str, startIdx, openChar, closeChar) {
    if (str[startIdx] !== openChar) return -1;
    let stack = 1;
    let i = startIdx + 1;
    while (i < str.length && stack > 0) {
      if (str[i] === openChar) stack++;
      else if (str[i] === closeChar) stack--;
      i++;
    }
    return stack === 0 ? i - 1 : -1;
  }

  let result = expr;
  let i = 0;

  while (i < result.length) {
    // Ищем паттерн: минус, затем цифры, затем открывающий маркер (⥑ или ⥾)
    const match = result.slice(i).match(/^-(\d+)(⥑|⥾)/);
    if (match) {
      const numberPart = match[1];
      const openMarker = match[2];
      const closeMarker = (openMarker === MARKERS.WHOLE_START) ? MARKERS.WHOLE_END : MARKERS.COMPLEX_END;
      const fullMatch = match[0];
      const numStart = i;
      const openPos = i + fullMatch.length - 1; // позиция открывающего маркера
      const closePos = findMatchingClose(result, openPos, openMarker, closeMarker);
      if (closePos !== -1) {
        const content = result.slice(openPos + 1, closePos);
        // Проверяем, что внутри ровно одна операция '÷' и нет других операторов
        const hasDiv = content.includes('÷');
        const hasOtherOps = /[\+\-\*]/.test(content);
        const isSimpleFraction = hasDiv && !hasOtherOps;
        // Проверяем, не идёт ли после закрывающего маркера символ '÷' или '/'
        const nextChar = (closePos + 1 < result.length) ? result[closePos + 1] : '';
        const followedByDiv = (nextChar === '÷' || nextChar === '/');

        if (isSimpleFraction && followedByDiv) {
          const bracketPart = result.slice(openPos, closePos + 1);
          const restAfterDiv = result.slice(closePos + 1); // начинается с ÷ или / и далее
          // Преобразуем в -(число+дробь)÷...
          const replacement = `-1(${numberPart}+${bracketPart})${restAfterDiv}`;
          result = result.slice(0, numStart) + replacement;
          i = numStart + replacement.length;
          continue;
        }
      }
      i += fullMatch.length;
    } else {
      i++;
    }
  }
  return result;
}

/**
 * Преобразует смешанные числа с маркерами ⥾...⥿ в число+дробь.
 * Анализирует верхний уровень вложенности: если внутри ⥾...⥿ ровно одна операция '÷' 
 * на верхнем уровне (не внутри вложенных скобок), то это смешанная дробь.
 * 
 * Правило 1: число⥾дробь⥿ → число+дробь (без дополнительных скобок)
 * 
 * Пример: 4⥾⥾4-3⥿÷3⥿ → 4+((4-3)÷3)
 * 
 * @param {string} expr - выражение с маркерами
 * @returns {string} - преобразованное выражение
 */
export function transformMixedNumberWithComplexBrackets(expr) {
  if (!expr) return expr;

  const OPEN = MARKERS.COMPLEX_NUM_START;   // '⥾'
  const CLOSE = MARKERS.COMPLEX_END;        // '⥿'

  function findMatchingClose(str, startIdx) {
    if (str[startIdx] !== OPEN) return -1;
    let stack = 1;
    let i = startIdx + 1;
    while (i < str.length && stack > 0) {
      if (str[i] === OPEN) stack++;
      else if (str[i] === CLOSE) stack--;
      i++;
    }
    return stack === 0 ? i - 1 : -1;
  }

  let result = expr;
  let i = 0;

  while (i < result.length) {
    let match = result.slice(i).match(/(-?\d+)⥾/);
    if (match) {
      const fullMatch = match[0];
      const numberPart = match[1];
      const numStart = i;
      const openPos = i + fullMatch.length - 1;
      const closePos = findMatchingClose(result, openPos);

      if (closePos !== -1) {
        const content = result.slice(openPos + 1, closePos);

        // Считаем операции ÷ на верхнем уровне
        let divCountOnTopLevel = 0;
        let hasOtherOpsOnTopLevel = false;
        let depth = 0;

        for (let k = 0; k < content.length; k++) {
          const ch = content[k];
          if (ch === OPEN) depth++;
          else if (ch === CLOSE) depth--;
          else if (depth === 0) {
            if (ch === '÷') divCountOnTopLevel++;
            else if (/[\+\-\*]/.test(ch)) hasOtherOpsOnTopLevel = true;
          }
        }

        const isSimpleFraction = (divCountOnTopLevel === 1) && !hasOtherOpsOnTopLevel;

        if (isSimpleFraction) {
          // ===== СЛОЖНОЕ ВЫРАЖЕНИЕ: добавляем + =====
          const bracketPart = result.slice(openPos, closePos + 1);

          const hasMinus = numberPart.startsWith('-');
          const numWithoutMinus = hasMinus ? numberPart.slice(1) : numberPart;

          let replacement;
          if (hasMinus) {
            // -7⥾15÷(9-2)⥿ → -(7+⥾15÷(9-2)⥿)
            replacement = `-(${numWithoutMinus}+${bracketPart})`;
          } else {
            // 1⥾5÷(8-3)⥿ → (1+⥾5÷(8-3)⥿)
            replacement = `(${numberPart}+${bracketPart})`;
          }

          result = result.slice(0, numStart) + replacement + result.slice(closePos + 1);
          i = numStart + replacement.length;
          continue;
        }
      }
      i += fullMatch.length;
    } else {
      i++;
    }
  }

  return result;
}

/**
 * Обрабатывает случай, когда перед смешанной дробью стоит явный оператор.
 * Правило 2: оператор + смешанная дробь → оператор(число+дробь)
 * 
 * Примеры:
 * - 2*3(4÷5) → 2*(3+(4÷5))
 * - 3 * 4(1÷2) → 3 * (4+(1÷2))
 * 
 * @param {string} expr - выражение с обычными скобками (без маркеров)
 * @returns {string} - преобразованное выражение
 */
export function wrapMixedNumberWithOperator(expr) {
  if (!expr) return expr;

  let result = expr;
  let i = 0;

  while (i < result.length) {
    // ===== ИСПРАВЛЕНИЕ: Ищем паттерн число*число+(выражение) =====
    // Пример: 2*3+(4÷5) → 2*(3+(4÷5))
    // Ищем: цифры, затем оператор (*, /, +, -), затем цифры, затем +(выражение)
    const match = result.slice(i).match(/(\d+)([*/÷+\-])(\d+)\+\(([^)]+)\)/);
    if (match) {
      const firstNumber = match[1];      // 2
      const operator = match[2];          // *
      const secondNumber = match[3];      // 3
      const fractionPart = match[4];      // 4÷5
      const fullMatch = match[0];         // 2*3+(4÷5)

      // Проверяем, что внутри скобок есть ровно одна операция ÷
      const divCount = (fractionPart.match(/÷/g) || []).length;
      const hasOtherOps = /[\+\-\*]/.test(fractionPart.replace(/÷/g, ''));

      if (divCount === 1 && !hasOtherOps) {
        // Это смешанная дробь → оборачиваем второе число и дробь в скобки
        // 2*3+(4÷5) → 2*(3+(4÷5))
        const replacement = firstNumber + operator + '(' + secondNumber + '+' + '(' + fractionPart + ')' + ')';
        result = result.slice(0, i) + replacement + result.slice(i + fullMatch.length);
        i = i + replacement.length;
        continue;
      }
    }
    i++;
  }

  return result;
}

/**
 * Форматирует выражение для отображения в истории.
 * Вставляет '*' между числом и скобкой, если внутри скобок не простая дробь.
 * Заменяет маркеры ⥾/⥿ и ⥑/⥏ на обычные скобки.
 * @param {string} expr - выражение с маркерами (после автозакрытия)
 * @returns {string} - отформатированное выражение для истории
 */
function formatHistoryExpr(expr) {
  if (!expr) return expr;

  const OPEN = MARKERS.COMPLEX_NUM_START;   // '⥾'
  const CLOSE = MARKERS.COMPLEX_END;        // '⥿'

  function findMatchingClose(str, startIdx) {
    if (str[startIdx] !== OPEN) return -1;
    let stack = 1;
    let i = startIdx + 1;
    while (i < str.length && stack > 0) {
      if (str[i] === OPEN) stack++;
      else if (str[i] === CLOSE) stack--;
      i++;
    }
    return stack === 0 ? i - 1 : -1;
  }

  let result = '';
  let i = 0;
  while (i < expr.length) {
    const match = expr.slice(i).match(/^(\d+)⥾/);
    if (match) {
      const number = match[1];
      const openPos = i + match[0].length - 1;
      const closePos = findMatchingClose(expr, openPos);
      if (closePos !== -1) {
        const content = expr.slice(openPos + 1, closePos);
        const divCount = (content.match(/÷/g) || []).length;
        const hasOtherOps = /[\+\-\*]/.test(content);
        const isSimpleFraction = divCount === 1 && !hasOtherOps;

        if (!isSimpleFraction) {
          // Вставляем '*' между числом и открывающей скобкой
          result += number + '*' + OPEN;
          i += number.length + 1; // пропускаем число и OPEN
          continue;
        }
      }
    }
    result += expr[i];
    i++;
  }

  // Заменяем маркеры на обычные скобки
  return result
    .replace(/⥾/g, '(')
    .replace(/⥿/g, ')')
    .replace(/⥑/g, '(')
    .replace(/⥏/g, ')');
}

/**
 * Преобразует все смешанные дроби вида "число+(число÷число)" в неправильные дроби "(число*знаменатель+числитель)÷знаменатель"
 * Пример: "4+(3÷4)" → "(4*4+3)÷4" → "19÷4"
 */
function convertMixedToImproper(expr) {
  // Ищем паттерн: число+(числитель÷знаменатель)
  return expr.replace(/(\d+)\+\((\d+)÷(\d+)\)/g, (match, whole, num, den) => {
    const improperNum = parseInt(whole) * parseInt(den) + parseInt(num);
    return `(${improperNum}÷${den})`;
  });
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
    isPowerMode = false;
    powerDepth = 0;
    return;
  }

  // ---- Сбрасываем режим степени перед вычислением ----
  isPowerMode = false;
  powerDepth = 0;

  // === ШАГ 1: АВТОДОПОЛНЕНИЕ ПУСТЫХ СКОБОК ===
  const fixedDisplay = autoCompleteEmptyBrackets(appState.display);
  if (fixedDisplay !== appState.display) {
    appState.display = fixedDisplay;
  }

  // ===== ШАГ 2: Собираем полное выражение =====
  let fullExpr = (appState.expression || '') + (appState.display || '');
  // =====  АВТОДОПОЛНЕНИЕ =====
  fullExpr = autoCompleteEmptyBrackets(fullExpr);

  // ===== ШАГ 3: Автозакрытие маркеров (если есть) =====
  let stack = getUnclosedMarkersStack(fullExpr);
  while (stack.length > 0) {
    fullExpr += MARKERS.COMPLEX_END;
    stack.pop();
  }
  let openWhole = (fullExpr.match(/⥑/g) || []).length;
  let closeWhole = (fullExpr.match(/⥏/g) || []).length;
  while (openWhole > closeWhole) {
    fullExpr += MARKERS.WHOLE_END;
    closeWhole++;
  }

  // ===== ШАГ 4: Автозакрытие обычных скобок =====
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

  // ===== ШАГ 5: АНАЛИЗ И РАССТАНОВКА МАРКЕРОВ =====   
  // // Теперь все скобки закрыты, можно анализировать структуру
  fullExpr = analyzeAndReplaceMarkers(fullExpr);

  // ===== ШАГ 6: Трансформации =====
  // 1. Обрабатываем смешанные числа с маркерами целой части (⥑...⥏)
  fullExpr = transformMixedNumberWithoutDivision(fullExpr);
  // 2. Обрабатываем отрицательные смешанные числа
  fullExpr = transformNegativeMixedNumber(fullExpr);
  // 3. Обрабатываем смешанные дроби с оператором ÷ после скобок
  fullExpr = transformMixedFractionWithDivision(fullExpr);
  // 4. Обрабатываем сложные скобки ⥾...⥿ (Правило 1: число+дробь)
  fullExpr = transformMixedNumberWithComplexBrackets(fullExpr);

  // ===== ШАГ 7: ВСТАВКА НЕЯВНЫХ ОПЕРАТОРОВ (ДО УДАЛЕНИЯ МАРКЕРОВ) =====
  // Это ключевое изменение! Вставляем операторы пока еще есть маркеры
  fullExpr = processImplicitOperators(fullExpr);
  fullExpr = insertImplicitMultiplication(fullExpr);

  // ===== ШАГ 8: СОХРАНЯЕМ ИСТОРИЮ С ОПЕРАТОРАМИ =====
  // Берем выражение с операторами и маркерами
  let historyDisplayExpr = fullExpr;

  // Просто заменяем маркеры на скобки для читаемости
  // НЕ УДАЛЯЕМ операторы! НЕ используем formatHistoryExpr!
  historyDisplayExpr = historyDisplayExpr
    .replace(/⥾/g, '(')
    .replace(/⥿/g, ')')
    .replace(/⥑/g, '(')
    .replace(/⥏/g, ')');

  // ===== ШАГ 9: Преобразуем маркеры в обычные скобки для вычислений =====
  fullExpr = stripMarkers(fullExpr);

  // ===== ШАГ 10: Восстановление скобок числителя =====
  // Восстанавливаем скобки числителя, если они были потеряны
  // Проверяем, было ли выражение вида ⥾...⥿÷... (дробь с числителем)
  const hasFractionStructure = /[⥾⥿]/.test(
    (appState.expression || '') + (appState.display || '')
  );

  if (hasFractionStructure) {
    // Находим позицию последнего ÷ на верхнем уровне
    let depth = 0;
    let mainDivIndex = -1;
    for (let i = 0; i < fullExpr.length; i++) {
      if (fullExpr[i] === '(') depth++;
      else if (fullExpr[i] === ')') depth--;
      else if (fullExpr[i] === '÷' && depth === 0) {
        mainDivIndex = i;
        break; // Берём первый ÷ на верхнем уровне
      }
    }

    if (mainDivIndex !== -1) {
      const numerator = fullExpr.substring(0, mainDivIndex);
      const denominator = fullExpr.substring(mainDivIndex + 1);

      // Если числитель не обёрнут в скобки, оборачиваем
      if (!numerator.startsWith('(') || !numerator.endsWith(')')) {
        fullExpr = '(' + numerator + ')' + '÷' + denominator;
      }
    }
  }

  // ===== ШАГ 11: Остальные трансформации =====

  // Обрабатываем случаи с оператором перед смешанной дробью (Правило 2: оператор(число+дробь))
  fullExpr = wrapMixedNumberWithOperator(fullExpr);

  // =====  Обработка деления смешанной дроби =====
  // После stripMarkers, выражение вида "2+(3÷6)÷7" должно стать "(2+(3÷6))÷7"
  // Ищем паттерн: число+(выражение)÷число
  const mixedDivisionPattern = /(\d+)\+\(([^)]+)\)÷(\d+)/g;
  fullExpr = fullExpr.replace(mixedDivisionPattern, (match, whole, fraction, divisor) => {
    return '(' + whole + '+' + fraction + ')÷' + divisor;
  });

  // ===== ДОПОЛНИТЕЛЬНАЯ ВСТАВКА ОПЕРАТОРОВ =====
  fullExpr = fullExpr.replace(/\)(\d+)/g, ')*$1');
  fullExpr = insertImplicitMultiplication(fullExpr);

  // ===== ШАГ 12: Вычисление =====

  try {
    // Переносим целые части в числитель дроби
    fullExpr = convertMixedToImproper(fullExpr);

    // 1. Переводим всю строку в чистый текстовый вид для математического ядра
    // (например, конвертируем superscript-символы степени: "2^³" -> "2^3")
    let cleanExpr = fromSuperscript(fullExpr);

    console.log("Исходная строка перед фиксом скобок:", cleanExpr);

    // 2. ИЗОЛЯЦИЯ ПРИОРИТЕТОВ СТЕПЕНИ ДЛЯ ЯДРА
    // Если пользователь ввел "1÷4^2", ядро без скобок посчитает это как (1÷4)^2.
    // Чтобы этого не происходило, мы заменяем конструкции "число÷число^степень" 
    // или "число÷(выражение)^степень" на изолированные скобки.

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
      displayStr = `${mixed.whole}⥑${Math.abs(mixed.num)}÷${mixed.den}⥏`;
    } else if (mixed.whole !== 0) {
      // Только целое число
      displayStr = `${mixed.whole}`;
    } else {
      // Для отрицательной чистой дроби знак определяется числителем resultFraction
      const sign = resultFraction.num < 0 ? '-' : '';
      displayStr = `${sign}${Math.abs(mixed.num)}÷${mixed.den}`;
    }

    // 5. ЗАПИСЬ В ИСТОРИЮ СЕССИИ
    // Проверяем флаг подробных шагов из appState
    let finalStepsArray = [historyDisplayExpr, displayStr];

    if (appState.stepsFraction) {
      // Генерируем подробную цепочку шагов, передавая подготовленное cleanExpr и готовый результат
      finalStepsArray = generateSteps(cleanExpr, resultFraction);
    }

    console.log('📊 [DEBUG] История с операторами:', historyDisplayExpr);
    console.log('📊 [DEBUG] Результат:', displayStr);

    // === -📝=TODO=📝- ===
    // ===== ВРЕМЕННАЯ ОТЛАДКА =====
    console.log('📊 [DEBUG] Шаги для выражения:', cleanExpr);
    console.log('📊 [DEBUG] Массив шагов:', finalStepsArray);
    // =============================

    appState.historySession.push({
      type: 'fractionSteps',
      steps: finalStepsArray
    });

    // Обновляем состояние дисплея для пользователя
    appState.display = displayStr;
    appState.expression = '';
    appState.isNewInput = true;

  } catch (err) {
    console.error('Evaluation error:', err);

    // =====   Обработка деления на ноль в смешанной дроби =====
    // Проверяем, является ли ошибка делением на ноль
    const isDivisionByZero = err.message && (
      err.message.includes('Division by zero') ||
      err.message.includes('division by zero')
    );

    // Формируем массив шагов для истории
    let errorStepsArray = [historyDisplayExpr, 'ERROR'];
    if (appState.stepsFraction) {
      errorStepsArray = generateSteps(fromSuperscript(fullExpr));
      if (errorStepsArray[errorStepsArray.length - 1] !== 'ERROR') {
        errorStepsArray.push('ERROR');
      }
    }

    // Записываем ошибку в историю
    appState.historySession.push({
      type: 'fractionSteps',
      steps: errorStepsArray
    });

    // =====  Отображаем ERROR на дисплее =====
    appState.display = 'ERROR';
    appState.expression = '';
    appState.isNewInput = true;
  }
}

// ---- очистка C ----
export function clearFraction() {
  appState.display = '0';
  appState.expression = '';
  appState.isNewInput = true;
  isPowerMode = false;
  powerDepth = 0;
}

// ---- backspace ⌫ ----
/**
 * Обработчик кнопки backspace.
 * Защищает структуру дроби: если expression заканчивается на '÷',
 * удаление происходит только из display (знаменатель).
 * Если display пуст, удаление блокируется.
 * В остальных случаях – стандартное удаление из display.
 */
export function backspaceFraction() {
  // Обработка состояния ошибки
  if (isError()) {
    appState.display = '0';
    appState.isNewInput = true;
    return;
  }

  // ---- Если активен режим степени, обрабатываем удаление специально ----
  if (isPowerMode) {
    // Удаляем последний символ из display
    if (appState.display.length > 1) {
      appState.display = appState.display.slice(0, -1);
    } else {
      appState.display = '';
    }

    // Пересчитываем powerDepth на основе оставшегося показателя
    const lastIndex = appState.display.lastIndexOf('^');
    if (lastIndex === -1) {
      // Если '^' удалён — сбрасываем режим
      isPowerMode = false;
      powerDepth = 0;
      return;
    }

    const afterPower = appState.display.substring(lastIndex + 1);
    // Считаем баланс скобок в показателе
    let depth = 0;
    for (const ch of afterPower) {
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      if (depth < 0) depth = 0; // защита от отрицательной глубины
    }
    powerDepth = depth;

    // Если показатель пуст (после '^' ничего нет) — сбрасываем режим
    if (afterPower === '') {
      isPowerMode = false;
      powerDepth = 0;
    } else {
      // Иначе режим остаётся активным
      isPowerMode = true;
    }
    return;
  }

  // === ЗАЩИТА СТРУКТУРЫ ДРОБИ ===
  // Если expression оканчивается на '÷', значит мы находимся в режиме ввода знаменателя
  if (appState.expression.endsWith('÷')) {
    // Если display пуст (ничего не введено в знаменателе) – блокируем удаление
    if (appState.display === '' || appState.display === '0') {
      return; // ничего не делаем
    }
    // Удаляем символ из display (знаменатель)
    if (appState.display.length > 1) {
      appState.display = appState.display.slice(0, -1);
    } else {
      appState.display = ''; // знаменатель стал пустым, но не ставим '0', чтобы пользователь мог ввести цифры
    }
    return;
  }

  // === СТАНДАРТНОЕ УДАЛЕНИЕ (все остальные случаи) ===
  if (appState.display.length > 1) {
    appState.display = appState.display.slice(0, -1);
  } else {
    appState.display = '';
    appState.isNewInput = true;
  }
}