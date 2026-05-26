/* eslint-disable no-unused-vars */
/**
 * src/lib/services/fractionActions.js
 * Пошаговый образовательный движок вычисления дробей с параллельным попарным приоритетом
 */
import { appState } from '../store/appState.svelte.js';
import { Fraction, gcd, lcm } from './fractionCore.js';

/**
 * Вспомогательная функция: Преобразует сырой линейный ввод пользователя со скобками в маркерный формат
 * Например: "1(1÷4" -> "1⥑1÷4⥏", а "(3÷2" -> "3÷2"
 * Исправленная функция захвата: принудительно берет всё, что после ( 
 * до тех пор, пока не встретит конец строки или следующий символ.
 */
function convertRawInputToMarkers(expr) {
  if (!expr || expr === 'ERROR') return expr;

  // 1. Сценарий со смешанным числом: "Целое(Числитель÷Знаменатель"
  expr = expr.replace(/(-?\d+)\(([^)\s]+)/g, (match, whole, fractionBody) => {
    if (fractionBody.includes('÷')) {
      const cleanBody = fractionBody.replace(')', '');
      return `${whole}\u2951${cleanBody}\u294F`;
    }
    return match;
  });

  // 2. Сценарий с простой дробью без целой части: "(Числитель÷Знаменатель"
  expr = expr.replace(/\(([^)\s]+)/g, (match, fractionBody) => {
    if (fractionBody.includes('÷')) {
      const cleanBody = fractionBody.replace(')', '');
      return cleanBody;
    }
    return match;
  });

  return expr;
}


/**
 * ФОРМАТИРОВАНИЕ ДЛЯ ЭКРАНА (UI)
 * Берёт чистый монолит и расставляет пробелы ТОЛЬКО вокруг внешних линейных операторов.
 * Внутри дробей и скобок пробелов не будет — рендерер не порвёт вёрстку дроби.
 */
function formatDisplayStep(expr) {
  let clean = expr.replace(/\s+/g, ''); // Защита: убираем случайные пробелы
  let result = '';
  let inMarker = 0;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (char === '\u297E') {
      inMarker++;
      result += char;
    } else if (char === '\u297F') {
      inMarker--;
      result += char;
    } else if (inMarker === 0 && ['+', '*', '/'].includes(char)) {
      result += ' ' + char + ' ';
    } else if (inMarker === 0 && char === '-') {
      const trimmed = result.trim();
      const lastChar = trimmed[trimmed.length - 1];
      if (lastChar && (/\d/.test(lastChar) || lastChar === '\u297F' || lastChar === ')')) {
        result += ' - '; // Бинарное вычитание на линейном уровне
      } else {
        result += char; // Знак отрицательного числа
      }
    } else {
      result += char;
    }
  }
  return result.replace(/\s+/g, ' ').trim();
}

/**
 * ПОДГОТОВКА СТРОКИ ДЛЯ ДВИЖКА ТОКЕНИЗАЦИИ
 * Выделяет пробелами операторы на беспробельной строке, чтобы split(' ') отработал идеально.
 */
function addSpacesForEngine(expr) {
  let res = '';
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (['+', '*', '/'].includes(c)) {
      res += ' ' + c + ' ';
    } else if (c === '-') {
      if (i > 0 && /\d/.test(expr[i - 1])) {
        res += ' - ';
      } else {
        res += '-';
      }
    } else {
      res += c;
    }
  }
  return res.replace(/\s+/g, ' ').trim();
}

/**
 * Перевод дроби в плоскую строку (без выделения целой части) для промежуточных шагов
 */
function fractionToFlatString(fr) {
  const simplified = fr.simplify();
  if (simplified.den === 1) {
    return String(simplified.whole * simplified.den + simplified.num);
  }
  const totalNum = simplified.whole * simplified.den + simplified.num;
  return `${totalNum}÷${simplified.den}`;
}

/**
 * Перевод дроби в красивую строку с системными маркерами целой части
 */
function fractionToString(fr) {
  const simplified = fr.simplify();
  const extracted = simplified.extractWhole();

  if (extracted.den === 1) {
    return String(extracted.whole !== 0 ? extracted.whole : extracted.num);
  }
  if (extracted.whole !== 0) {
    return `${extracted.whole}\u2951${extracted.num}÷${extracted.den}\u294F`;
  }
  return `${extracted.num}÷${extracted.den}`;
}

/**
 * Универсальный токенизатор строки по пробелам
 */
function tokenizeSubExpression(subExpr) {
  const rawTokens = subExpr.replace(/\s+/g, ' ').trim().split(' ');
  const tokens = [];

  for (let token of rawTokens) {
    if (!token) continue;
    if (['+', '-', '*', '/'].includes(token)) {
      tokens.push(token);
    } else {
      if (token.includes('\u2951')) {
        const openIdx = token.indexOf('\u2951');
        const closeIdx = token.indexOf('\u294F');
        if (closeIdx !== -1) {
          const whole = parseInt(token.substring(0, openIdx), 10) || 0;
          const subParts = token.substring(openIdx + 1, closeIdx).split('÷');
          if (subParts.length === 2) {
            tokens.push(new Fraction(parseInt(subParts[0], 10), parseInt(subParts[1], 10), whole));
            continue;
          }
        }
      }

      if (token.includes('÷')) {
        const parts = token.split('÷');
        tokens.push(new Fraction(parseInt(parts[0], 10), parseInt(parts[1], 10), 0));
      } else if (token.includes('.')) {
        tokens.push(Fraction.fromDecimal(parseFloat(token)));
      } else {
        tokens.push(new Fraction(parseInt(token, 10), 1, 0));
      }
    }
  }
  return tokens;
}

/**
 * Вычисление простого математического выражения
 */
function evaluateStandardMath(exprStr) {
  let clean = exprStr.replace(/,/g, '.').replace(/\s+/g, '').trim();
  try {
    const fn = new Function(`return ${clean.replace(/÷/g, '/')}`);
    return fn();
  } catch (e) {
    return 0;
  }
}

/**
 * Ввод элементов
 */
export function enterFractionDigit(digit) {
  if (appState.isNewInput) {
    appState.display = digit;
    appState.isNewInput = false;
  } else {
    appState.display = appState.display === '0' ? digit : appState.display + digit;
  }
}

/**
 * Ввод оператора (+, -, *, /)
 */
export function enterFractionOperator(op) {
  if (appState.display === 'ERROR') return;

  const openCount = (appState.display.match(/\(\(/g) || []).length;
  const closeCount = (appState.display.match(/\)\)/g) || []).length;

  if (openCount > closeCount) {
    appState.display += ` ${op} `;
    appState.isNewInput = false;
    return;
  }

  // УДАЛЕНО: Авто-закрытие скобок при вводе оператора.
  // Теперь оператор не будет ломать ввод дроби.

  let currentDisplay = appState.display.trim();

  if (!appState.expression || appState.expression.trim() === '') {
    appState.expression = currentDisplay + ` ${op} `;
  } else {
    appState.expression = appState.expression.trim() + ' ' + currentDisplay + ` ${op} `;
  }

  appState.display = '0';
  appState.isNewInput = true;
}

/**
 * отвечает за ввод открывающей скобки ( в интерфейс калькулятора.
 */
export function executeIdentity(identityType) {
  if (identityType === 'bracket') {
    if (appState.isNewInput || appState.display === '0') {
      appState.display = '(';
      appState.isNewInput = false;
    } else {
      appState.display += '(';
    }
  }
}


/**
 * Кнопка дроби (÷)
 * Теперь она максимально "чистая" и не вмешивается в структуру скобок.
 */
export function handleFractionSlash() {
  if (appState.display === 'ERROR') return;

  let currentDisplay = appState.display.trim();

  if (currentDisplay === '' || currentDisplay === '0') {
    appState.display = '0÷';
  } else {
    // Просто добавляем ÷. Никаких закрытий скобок!
    appState.display = currentDisplay + '÷';
  }

  appState.isNewInput = false;
}

/**
 * ГЛАВНЫЙ ПОШАГОВЫЙ ДВИЖОК ВЫЧИСЛЕНИЙ (РАБОТАЕТ НА БЕСПРОБЕЛЬНОМ СТРИМЕ)
 * 
 * 
 * 
 * 
 */


export function clearFractionAll() {
  appState.display = '0';
  appState.expression = '';
  appState.isNewInput = true;
}

export function backspaceFraction() {
  if (appState.isNewInput || appState.display === '0' || appState.display === 'ERROR') {
    appState.display = '0';
    appState.isNewInput = true;
  } else {
    appState.display = appState.display.trim().slice(0, -1) || '0';
  }
}


export function fractionToDecimal() {
  let currentDisplay = convertRawInputToMarkers(appState.display.trim());
  if (currentDisplay === '0' || currentDisplay === 'ERROR') return;

  try {
    const tokens = tokenizeSubExpression(currentDisplay);
    if (!tokens || tokens.length === 0) return;
    const fraction = tokens[0];

    const decimalValue = fraction.toDecimal();
    const resultStr = String(parseFloat(decimalValue.toFixed(6)));

    appState.historySession.push(`${appState.display.trim()} = ${resultStr}`);
    appState.display = resultStr;
    appState.isNewInput = true;
  } catch (e) {
    appState.display = 'ERROR';
  }
}

export function decimalToFraction() {
  let currentDisplay = appState.display.trim();
  if (currentDisplay === '0' || currentDisplay === 'ERROR' || currentDisplay.includes('÷') || currentDisplay.includes('(')) return;

  try {
    const decimalNum = parseFloat(currentDisplay);
    if (isNaN(decimalNum)) return;

    const whole = Math.trunc(decimalNum);
    const fractionPart = Math.abs(decimalNum - whole);

    let resultStr = '';
    if (fractionPart !== 0) {
      const fraction = Fraction.fromDecimal(fractionPart);
      if (whole !== 0) {
        resultStr = `${whole}\u2951${fraction.num}÷${fraction.den}\u294F`;
      } else {
        const sign = decimalNum < 0 ? '-' : '';
        resultStr = `${sign}${fraction.num}÷${fraction.den}`;
      }
    } else {
      resultStr = `${whole}`;
    }

    appState.historySession.push(`${currentDisplay} = ${resultStr}`);
    appState.display = resultStr;
    appState.isNewInput = true;
  } catch (e) {
    appState.display = 'ERROR';
  }
}