/* eslint-disable no-unused-vars */
/**
 * src/lib/services/fractionActions.js
 * Сервис действий для страницы вычисления дробей (Линейный ввод через скобки)
 */
import { appState } from '../store/appState.svelte.js';
import { Fraction, gcd, lcm } from './fractionCore.js';

/**
 * Вспомогательная функция: Преобразует сырой линейный ввод пользователя со скобками в маркерный формат
 * Например: "1(1÷4" -> "1⥑1÷4⥏", а "(3÷2" -> "3÷2"
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
 * Превращает объект Fraction обратно в строковый вид с системными маркерами
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
 * Превращает дробь в плоскую строку (числитель÷знаменатель) без выделения целой части.
 * Используется только для промежуточных шагов вычислений.
 */
function fractionToFlatString(fr) {
  const simplified = fr.simplify();
  // Если знаменатель равен 1, возвращаем просто число
  if (simplified.den === 1) {
    return String(simplified.whole * simplified.den + simplified.num);
  }
  // Иначе возвращаем сквозной числитель и знаменатель
  const totalNum = simplified.whole * simplified.den + simplified.num;
  return `${totalNum}÷${simplified.den}`;
}

/**
 * Новый неубиваемый токенизатор выражения (работает строго по пробелам)
 */
function tokenizeSubExpression(subExpr) {
  // Заменяем множественные пробелы на один и бьем на массив токенов
  const rawTokens = subExpr.replace(/\s+/g, ' ').trim().split(' ');
  const tokens = [];

  for (let token of rawTokens) {
    if (!token) continue;

    if (['+', '-', '*', '/'].includes(token)) {
      tokens.push(token);
    } else {
      // Если токен содержит маркеры смешанного числа
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

      // Если это простая дробь
      if (token.includes('÷')) {
        const parts = token.split('÷');
        const den = parseInt(parts[1], 10);
        if (den === 0) return null;
        tokens.push(new Fraction(parseInt(parts[0], 10), den, 0));
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
 * Вспомогательная функция быстрого вычисления атомарных подвыражений
 */
function evaluateSubExpression(subExpr) {
  const tokens = tokenizeSubExpression(subExpr);
  if (!tokens || tokens.length === 0) return null;

  // 1. Умножение и деление
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    if (op === '*' || op === '/') {
      const prev = tokens[i - 1];
      const next = tokens[i + 1];
      if (next.den === 0 || (op === '/' && next.num === 0)) return null;

      const pNum = prev.whole * prev.den + prev.num;
      const nNum = next.whole * next.den + next.num;

      let res;
      if (op === '*') {
        res = new Fraction(pNum * nNum, prev.den * next.den, 0);
      } else {
        res = new Fraction(pNum * next.den, prev.den * nNum, 0);
      }
      tokens.splice(i - 1, 3, res);
      i -= 2;
    }
  }

  // 2. Сложение и вычитание
  let finalFraction = tokens[0];
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i];
    const next = tokens[i + 1];
    if (next.den === 0) return null;

    const fNum = finalFraction.whole * finalFraction.den + finalFraction.num;
    const nNum = next.whole * next.den + next.num;

    if (finalFraction.den === next.den) {
      const newNum = op === '+' ? fNum + nNum : fNum - nNum;
      finalFraction = new Fraction(newNum, finalFraction.den, 0);
    } else {
      const commonDen = lcm(finalFraction.den, next.den);
      const factor1 = commonDen / finalFraction.den;
      const factor2 = commonDen / next.den;
      const newNum = op === '+'
        ? (fNum * factor1) + (nNum * factor2)
        : (fNum * factor1) - (nNum * factor2);
      finalFraction = new Fraction(newNum, commonDen, 0);
    }
  }

  return finalFraction.simplify();
}

/**
 * 1. Ввод цифр (0-9) на странице дробей (Чисто на главный дисплей)
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
 * 2. Ввод операторов (+, -, *, /) с автоконвертацией накопленной структуры
 */
export function enterFractionOperator(op) {
  if (appState.display === 'ERROR') return;

  // На лету превращаем сырой ввод текущего дисплея (например "1(1÷4") в маркеры
  let currentDisplay = convertRawInputToMarkers(appState.display.trim());

  if (currentDisplay === '0' && appState.expression) {
    let currentExpr = appState.expression.trim();
    const lastChar = currentExpr.at(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      appState.expression = currentExpr.slice(0, -1) + op + ' ';
      return;
    }
  }

  if (!appState.expression || appState.expression.trim() === '') {
    appState.expression = currentDisplay + ' ' + op + ' ';
  } else {
    appState.expression = appState.expression.trim() + ' ' + currentDisplay + ' ' + op + ' ';
  }

  appState.display = '0';
  appState.isNewInput = true;
}

/**
 * 3. Обработка кнопки дробной черты [÷]
 */
export function handleFractionSlash() {
  if (appState.isNewInput) {
    appState.display = '0÷';
    appState.isNewInput = false;
  } else {
    if (!appState.display.includes('÷')) {
      appState.display = appState.display + '÷';
    }
  }
}

/**
 * Обработка ввода скобки (Используется как разделитель целой части линейно)
 */
export function executeIdentity(identityType) {
  if (identityType === 'bracket') {
    if (appState.isNewInput || appState.display === '0' || appState.display === 'ERROR') {
      appState.display = '(';
      appState.isNewInput = false;
    } else {
      appState.display += '(';
    }
  }
}

/**
 * ГЛАВНАЯ ФУНКЦИЯ ВЫЧИСЛЕНИЯ ВЫРАЖЕНИЯ [=]
 */
export function calculateFractionResult() {
  let cleanDisplay = convertRawInputToMarkers(appState.display.trim());

  let rawExpression = appState.expression.trim();
  if (rawExpression) {
    rawExpression += ' ' + cleanDisplay;
  } else {
    rawExpression = cleanDisplay;
  }

  if (!rawExpression || rawExpression === '0') return;

  // 1. Предварительная очистка: убираем лишние пробелы вокруг маркеров
  let currentExpr = rawExpression.replace(/(-?\d+)\s*\u2951/g, '$1\u2951');

  // 2. Изолируем операторы пробелами БЕЗ лишних экранирований (линтер доволен)
  currentExpr = currentExpr.replace(/\u294F([+\-*/])/g, '\u294F $1 ');
  currentExpr = currentExpr.replace(/([+\-*/])/g, ' $1 ');
  currentExpr = currentExpr.replace(/\s+/g, ' ').trim();

  let stepsSequence = currentExpr;

  const addStep = (nextStep) => {
    const formattedNext = nextStep.replace(/\s+/g, ' ').trim();
    if (stepsSequence.includes(' = ')) {
      const parts = stepsSequence.split(' = ');
      if (parts[parts.length - 1].trim() !== formattedNext) {
        stepsSequence += ` = ${formattedNext}`;
      }
    } else {
      if (stepsSequence.trim() !== formattedNext) {
        stepsSequence += ` = ${formattedNext}`;
      }
    }
  };

  try {
    // === ЧАСТЬ А: НАДЁЖНО РАСКРЫВАЕМ СМЕШАННЫЕ ЧИСЛА С МАРКЕРАМИ ===
    const mixedFractionRegex = /(-?\d+)\u2951(\d+)÷(\d+)\u294F/;

    let safetyCounter = 0;
    while (mixedFractionRegex.test(currentExpr) && safetyCounter < 40) {
      safetyCounter++;

      currentExpr = currentExpr.replace(mixedFractionRegex, (match, wholeStr, numStr, denStr) => {
        const whole = parseInt(wholeStr, 10);
        const num = parseInt(numStr, 10);
        const den = parseInt(denStr, 10);

        if (den === 0) throw new Error("Division by zero in mixed fraction");

        const sign = whole < 0 ? -1 : 1;
        const combinedNum = whole * den + (sign * num);

        const combinedFraction = new Fraction(combinedNum, den, 0);

        // Используем ТОЛЬКО плоскую строку, чтобы гарантированно уничтожить маркеры в цикле!
        return fractionToFlatString(combinedFraction);
      });

      addStep(currentExpr);
    }

    if (safetyCounter >= 40) throw new Error("Invalid Mixed Fraction Loop");
    // === ЧАСТЬ Б: РАСКРЫВАЕМ МАТЕМАТИЧЕСКИЕ КРУГЛЫЕ СКОБКИ ===
    safetyCounter = 0;
    while (currentExpr.includes('(') && safetyCounter < 40) {
      safetyCounter++;

      const openIdx = currentExpr.lastIndexOf('(');
      let closeIdx = currentExpr.indexOf(')', openIdx);

      if (closeIdx === -1) {
        currentExpr += ')';
        closeIdx = currentExpr.length - 1;
      }

      const subBody = currentExpr.substring(openIdx + 1, closeIdx);
      const subResultFraction = evaluateSubExpression(subBody);
      if (!subResultFraction) throw new Error("Sub-expression error");

      const replacementStr = fractionToString(subResultFraction);
      currentExpr = currentExpr.substring(0, openIdx) + ' ' + replacementStr + ' ' + currentExpr.substring(closeIdx + 1);
      currentExpr = currentExpr.replace(/\s+/g, ' ').trim();
      addStep(currentExpr);
    }

    // === ЧАСТЬ В: ЛИНЕЙНОЕ ВЫЧИСЛЕНИЕ ВЫРАЖЕНИЯ ===
    let tokens = tokenizeSubExpression(currentExpr);
    if (!tokens || tokens.length === 0) throw new Error("Tokens parsing error");

    // 1. Умножение и деление
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      if (op === '*' || op === '/') {
        const prev = tokens[i - 1];
        const next = tokens[i + 1];
        const pNum = prev.whole * prev.den + prev.num;
        const nNum = next.whole * next.den + next.num;

        if (next.den === 0 || (op === '/' && nNum === 0)) throw new Error("Division by zero");

        let res = op === '*'
          ? new Fraction(pNum * nNum, prev.den * next.den, 0)
          : new Fraction(pNum * next.den, prev.den * nNum, 0);

        const currentStepView = `${fractionToString(prev)} ${op} ${fractionToString(next)}`;
        currentExpr = currentExpr.replace(currentStepView, fractionToString(res));
        addStep(currentExpr);

        tokens.splice(i - 1, 3, res);
        i -= 2;
      }
    }

    // 2. Сложение и вычитание
    let finalFraction = tokens[0];
    for (let i = 1; i < tokens.length; i += 2) {
      const op = tokens[i];
      const next = tokens[i + 1];

      const fNum = finalFraction.whole * finalFraction.den + finalFraction.num;
      const nNum = next.whole * next.den + next.num;
      const currentStepView = `${fractionToString(finalFraction)} ${op} ${fractionToString(next)}`;

      if (finalFraction.den === next.den) {
        const newNum = op === '+' ? fNum + nNum : fNum - nNum;
        finalFraction = new Fraction(newNum, finalFraction.den, 0);
      } else {
        const commonDen = lcm(finalFraction.den, next.den);
        const factor1 = commonDen / finalFraction.den;
        const factor2 = commonDen / next.den;
        const newNum = op === '+' ? (fNum * factor1) + (nNum * factor2) : (fNum * factor1) - (nNum * factor2);
        finalFraction = new Fraction(newNum, commonDen, 0);
      }

      currentExpr = currentExpr.replace(currentStepView, fractionToString(finalFraction));
      addStep(currentExpr);
      tokens[i + 1] = finalFraction;
    }

    const finalRawStr = fractionToString(finalFraction);
    appState.historySession.push(stepsSequence);
    appState.display = finalRawStr;
    appState.expression = '';
    appState.isNewInput = true;

  } catch (err) {
    console.error("Критическая ошибка расчёта:", err);
    appState.historySession.push(`${stepsSequence} = ERROR`);
    appState.display = 'ERROR';
    appState.expression = '';
  }
}

/**
 * Очистка дисплея и накопленного выражения дробей
 */
export function clearFractionAll() {
  appState.display = '0';
  appState.expression = '';
  appState.isNewInput = true;
}

/**
 * Метод Backspace для линейного дисплея дробей
 */
export function backspaceFraction() {
  if (appState.isNewInput || appState.display === '0' || appState.display === 'ERROR') {
    appState.display = '0';
    appState.isNewInput = true;
  } else {
    let current = appState.display.trim();
    current = current.slice(0, -1);
    appState.display = current === '' || current === '-' ? '0' : current;
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