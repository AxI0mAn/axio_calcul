/*

src/lib/services/math/fractionSteps.js - Генерация пошагового решения для дробных выражений.

Алгоритм для пояснения вычислений. 
Любой из шагов алгоритма может отсутствовать, если он не нужен.  
Определение необходимости следующего шага, происходит только после завершения предыдущего.

Шаг 1. Условие - вводим дробь. Записываем в массив для истории.
Шаг 1.1. Анализируем условие из Шаг 1. Если есть, то делаем вычисление степеней и корня квадратного. Результат записываем в массив для истории.
Шаг 2. Анализируем результат из Шаг 1.1. Если в числителе и/или знаменателе есть выражение заключённое в скобки, то вычисляем эти выражения в скобках числителя и/или знаменателя для каждой дроби. Результат записываем в массив для истории.
Шаг 3. Анализируем результат из Шаг 2. Если у дробей есть целые части, то переносим их в числитель. Результат записываем в массив для истории.
Шаг 4. Анализируем результат из Шаг 3. Если есть операции деления для дробей, то перевернуть дробь (в соответствии с математическими правилам) и заменить деление на произведение. Результат записываем в массив для истории.
Шаг 5. Делаем все произведения дробей, если такие есть. Если есть * то перемножить числители и перемножить знаменатели. Результат записываем в массив для истории.
Шаг 6. Анализируем результат из Шаг 5. Если знаменатели разные, то приводим все дроби к общему знаменателю, если дробей несколько. Результат записываем в массив для истории.
Шаг 7. Анализируем результат из Шаг 6. Все дроби без целых чисел и с одинаковыми знаменателями. Выполняем сложение и вычитание дробей с общим знаменателем.  Если оператор + или - то знаменатель общий, а в числителе показываем строку, которую будем вычислять. Результат записываем в массив для истории.
Шаг 8. Анализируем результат из Шаг 7. Полученная дробь имеющая только числитель и знаменатель. Проверяем возможность сокращения дроби и выделяем целую часть из дроби если это возможно.
Шаг 9. Показываем Результат.
*/

/*
src/lib/services/math/fractionSteps.js
Генерация пошагового решения для дробных выражений.
Использует те же функции, что и evaluateFraction(), но применяет их пошагово.
*/

// eslint-disable-next-line no-unused-vars
import { evaluateFractionExpression, Fraction } from './fractionCore.js';
import { MARKERS } from './fractionVisualParser.js';
import {
  insertImplicitMultiplication,
  transformMixedNumberWithoutDivision,
  transformNegativeMixedNumber,
  transformMixedNumberWithComplexBrackets,
  transformMixedFractionWithDivision
} from './fractionActions.js';

// ============================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (только то, чего нет в других файлах)
// ============================================================

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function normalizeExpr(expr) {
  if (!expr) return expr;
  let result = expr;
  result = result.replace(/\((\d+)\)/g, '$1');
  result = result.replace(/\((\d+÷\d+)\)/g, '$1');
  result = result.replace(/\(\)/g, '');
  return result;
}

function formatFraction(num, den) {
  if (den === 1) return String(num);
  return `${num}÷${den}`;
}

function splitByPlusMinus(expr) {
  if (!expr) return [];
  const terms = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(') { depth++; current += ch; continue; }
    if (ch === ')') { depth--; current += ch; continue; }
    if ((ch === '+' || ch === '-') && depth === 0) {
      if (current.trim()) {
        terms.push(current.trim());
        current = '';
      }
      current = ch;
      continue;
    }
    current += ch;
  }
  if (current.trim()) terms.push(current.trim());

  // Очищаем первый терм от ведущего '+'
  if (terms.length > 0 && terms[0].startsWith('+')) {
    terms[0] = terms[0].slice(1).trim();
  }

  return terms;
}

function extractNumerator(term) {
  if (!term) return 0;
  const clean = term.replace(/\s/g, '');
  const parts = clean.split('÷');
  if (parts.length === 2) {
    const num = parseInt(parts[0], 10);
    return isNaN(num) ? 0 : num;
  }
  const num = parseInt(parts[0], 10);
  return isNaN(num) ? 0 : num;
}

function extractDenominator(term) {
  if (!term) return 1;
  const clean = term.replace(/\s/g, '');
  const parts = clean.split('÷');
  if (parts.length === 2) {
    const den = parseInt(parts[1], 10);
    return isNaN(den) ? 1 : den;
  }
  return 1;
}

function isFraction(str) {
  return str && str.includes('÷');
}

function extractOperand(expr, opIdx, side) {
  if (!expr) return '';

  if (side === 'left') {
    let start = opIdx - 1;
    while (start >= 0 && expr[start] === ' ') start--;
    if (start < 0) return '';

    if (expr[start] === ')') {
      let depth = 1;
      let pos = start - 1;
      while (pos >= 0 && depth > 0) {
        if (expr[pos] === ')') depth++;
        else if (expr[pos] === '(') depth--;
        pos--;
      }
      start = pos + 1;
    } else {
      while (start >= 0 && !'+-*/÷^√()'.includes(expr[start])) {
        start--;
      }
      start++;
    }
    return expr.slice(start, opIdx).trim();
  } else {
    let end = opIdx + 1;
    while (end < expr.length && expr[end] === ' ') end++;
    if (end >= expr.length) return '';

    if (expr[end] === '(') {
      let depth = 1;
      let pos = end + 1;
      while (pos < expr.length && depth > 0) {
        if (expr[pos] === '(') depth++;
        else if (expr[pos] === ')') depth--;
        pos++;
      }
      end = pos;
    } else {
      while (end < expr.length && !'+-*/÷^√()'.includes(expr[end])) {
        end++;
      }
    }
    return expr.slice(opIdx + 1, end).trim();
  }
}

function evaluateSubExpression(expr) {
  if (!expr || expr.trim() === '') return 'ERROR';
  try {
    const frac = evaluateFractionExpression(expr);
    if (frac.den === 0) return 'ERROR';
    return formatFraction(frac.num, frac.den);
  } catch {
    return 'ERROR';
  }
}

// ============================================================
// ФУНКЦИИ ПРОВЕРКИ НЕОБХОДИМОСТИ ШАГОВ
// ============================================================

function hasPowersOrRoots(expr) {
  if (!expr) return false;
  return /[\^√]/.test(expr);
}

function hasComplexBrackets(expr) {
  if (!expr) return false;
  let depth = 0;
  let hasInnerOp = false;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(') { depth++; hasInnerOp = false; continue; }
    if (ch === ')') {
      if (depth > 0 && hasInnerOp) return true;
      depth--;
      hasInnerOp = false;
      continue;
    }
    if (depth > 0 && /[+\-*/÷^√]/.test(ch)) {
      hasInnerOp = true;
    }
  }
  return false;
}

function hasMixedFractions(expr) {
  if (!expr) return false;
  return expr.includes(MARKERS.WHOLE_START) || /\d+\([^)]*÷[^)]*\)/.test(expr);
}

function hasDivision(expr) {
  if (!expr) return false;
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (depth === 0 && ch === '÷') {
      const left = extractOperand(expr, i, 'left');
      const right = extractOperand(expr, i, 'right');
      if (isFraction(left) && isFraction(right)) return true;
    }
  }
  return false;
}

function hasMultiplication(expr) {
  if (!expr) return false;
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (depth === 0 && ch === '*') {
      const left = extractOperand(expr, i, 'left');
      const right = extractOperand(expr, i, 'right');
      if (isFraction(left) && isFraction(right)) return true;
    }
  }
  return false;
}

function needCommonDenominator(expr) {
  if (!expr) return false;
  const terms = splitByPlusMinus(expr);
  if (terms.length < 2) return false;
  const dens = terms.map(t => extractDenominator(t));
  const first = dens[0];
  return dens.some(d => d !== first && d !== 1);
}

// ============================================================
// ФУНКЦИИ ДЛЯ КАЖДОГО ШАГА
// ============================================================

/**
 * ШАГ 1.1: Вычисление степеней и корней.
 * Вычисляет все ^ и √ на верхнем уровне.
 */
function stepPowersAndRoots(expr) {
  if (!expr || !hasPowersOrRoots(expr)) {
    return expr;
  }

  let result = expr;
  let changed = true;
  let guard = 0;

  while (changed && guard < 20) {
    changed = false;
    guard++;

    // Ищем ^ или √ на верхнем уровне
    let depth = 0;
    for (let i = 0; i < result.length; i++) {
      const ch = result[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (depth === 0 && (ch === '^' || ch === '√')) {

        if (ch === '^') {
          const left = extractOperand(result, i, 'left');
          const right = extractOperand(result, i, 'right');

          if (left && right) {
            try {
              const leftFrac = evaluateFractionExpression(left);
              const rightFrac = evaluateFractionExpression(right);
              const resultFrac = leftFrac.pow(rightFrac);
              const resultStr = formatFraction(resultFrac.num, resultFrac.den);

              const leftStart = result.indexOf(left, i - left.length);
              if (leftStart !== -1) {
                const rightEnd = i + 1 + right.length;
                result = result.slice(0, leftStart) + resultStr + result.slice(rightEnd);
                changed = true;
                break;
              }
            } catch (e) {
              console.error('  Ошибка при вычислении ^:', e);
            }
          }
        } else if (ch === '√') {
          const right = extractOperand(result, i, 'right');

          if (right) {
            try {
              const rightVal = evaluateSubExpression(right);
              if (rightVal === 'ERROR') return 'ERROR';
              const value = evaluateFractionExpression(`√(${rightVal})`);
              const resultStr = value.toMixedString();

              const rightStart = result.indexOf(right, i + 1);
              if (rightStart !== -1) {
                const rightEnd = rightStart + right.length;
                result = result.slice(0, i) + resultStr + result.slice(rightEnd);
                changed = true;
                break;
              }
            } catch (e) {
              console.error(' Ошибка при вычислении √:', e);
            }
          }
        }
      }
    }
  }

  return result;
}

/**
 * ШАГ 2: Вычисление выражений в скобках.
 */
function stepBrackets(expr) {
  if (!expr || !hasComplexBrackets(expr)) {
    return expr;
  }

  let result = expr;
  let changed = true;
  let guard = 0;

  while (changed && guard < 20) {
    changed = false;
    guard++;

    let openIdx = result.lastIndexOf('(');
    if (openIdx === -1) break;

    let depth = 0;
    let closeIdx = -1;
    for (let i = openIdx; i < result.length; i++) {
      if (result[i] === '(') depth++;
      else if (result[i] === ')') depth--;
      if (depth === 0) { closeIdx = i; break; }
    }
    if (closeIdx === -1) break;

    const inner = result.slice(openIdx + 1, closeIdx);

    const resultStr = evaluateSubExpression(inner);
    if (resultStr === 'ERROR') return 'ERROR';

    result = result.slice(0, openIdx) + resultStr + result.slice(closeIdx + 1);
    result = normalizeExpr(result);
    changed = true;
  }

  return result;
}

/**
 * ШАГ 3: Преобразование смешанных дробей в неправильные.
 * Использует функции из fractionActions.js
 */
function stepMixedToImproper(expr) {
  if (!expr || !hasMixedFractions(expr)) {
    return expr;
  }

  let result = expr;

  // Используем существующие функции из fractionActions
  result = transformMixedNumberWithoutDivision(result);
  result = transformNegativeMixedNumber(result);
  result = transformMixedNumberWithComplexBrackets(result);
  result = transformMixedFractionWithDivision(result);

  // Дополнительная обработка для паттерна число(дробь)
  result = result.replace(/(\d+)\((\d+)÷(\d+)\)/g, (match, whole, num, den) => {
    const improperNum = parseInt(whole) * parseInt(den) + parseInt(num);
    const newExpr = `${improperNum}÷${den}`;
    return newExpr;
  });

  // Обработка отрицательных смешанных дробей
  result = result.replace(/-(\d+)\((\d+)÷(\d+)\)/g, (match, whole, num, den) => {
    const improperNum = parseInt(whole) * parseInt(den) + parseInt(num);
    const newExpr = `-(${improperNum}÷${den})`;
    return newExpr;
  });

  result = normalizeExpr(result);
  return result;
}

/**
 * ШАГ 4: Замена деления на умножение (переворот дроби).
 */
function stepDivisionToMultiplication(expr) {
  if (!expr || !hasDivision(expr)) {
    return expr;
  }

  let result = expr;
  let changed = true;
  let guard = 0;

  while (changed && guard < 20) {
    changed = false;
    guard++;

    let depth = 0;
    for (let i = 0; i < result.length; i++) {
      const ch = result[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (depth === 0 && ch === '÷') {
        const left = extractOperand(result, i, 'left');
        const right = extractOperand(result, i, 'right');

        if (isFraction(left) && isFraction(right)) {
          const rightParts = right.split('÷');
          if (rightParts.length === 2) {
            const flipped = `${rightParts[1]}÷${rightParts[0]}`;
            const newExpr = result.slice(0, i - left.length) + left + '*' + flipped + result.slice(i + 1 + right.length);
            result = normalizeExpr(newExpr);
            changed = true;
            break;
          }
        }
      }
    }
  }

  return result;
}

/**
 * ШАГ 5: Умножение дробей.
 */
function stepMultiplyFractions(expr) {
  if (!expr || !hasMultiplication(expr)) {
    return expr;
  }

  let result = expr;
  let changed = true;
  let guard = 0;

  while (changed && guard < 20) {
    changed = false;
    guard++;

    let depth = 0;
    for (let i = 0; i < result.length; i++) {
      const ch = result[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (depth === 0 && ch === '*') {
        const left = extractOperand(result, i, 'left');
        const right = extractOperand(result, i, 'right');

        if (isFraction(left) && isFraction(right)) {
          const leftParts = left.split('÷');
          const rightParts = right.split('÷');

          if (leftParts.length === 2 && rightParts.length === 2) {
            const newNum = parseInt(leftParts[0], 10) * parseInt(rightParts[0], 10);
            const newDen = parseInt(leftParts[1], 10) * parseInt(rightParts[1], 10);
            const newFrac = formatFraction(newNum, newDen);
            const newExpr = result.slice(0, i - left.length) + newFrac + result.slice(i + 1 + right.length);
            result = normalizeExpr(newExpr);
            changed = true;
            break;
          }
        }
      }
    }
  }

  return result;
}

/**
 * ШАГ 6: Приведение к общему знаменателю.
 */
function stepCommonDenominator(expr) {
  if (!expr || !needCommonDenominator(expr)) {
    return expr;
  }

  const terms = splitByPlusMinus(expr);

  if (terms.length < 2) return expr;

  const fractions = terms.map(t => {
    const num = extractNumerator(t);
    const den = extractDenominator(t);
    return { num, den, raw: t };
  });

  let commonDen = 1;
  for (const f of fractions) {
    if (f.den > 1) {
      commonDen = lcm(commonDen, f.den);
    }
  }

  if (commonDen === 1) return expr;

  const newTerms = fractions.map(f => {
    const factor = commonDen / (f.den || 1);
    const newNum = f.num * factor;
    return { num: newNum, den: commonDen, raw: f.raw };
  });

  let result = '';
  for (let i = 0; i < newTerms.length; i++) {
    const term = newTerms[i];

    if (i > 0) {
      let foundOp = '+';
      let temp = expr;
      let idx = temp.indexOf(term.raw);
      if (idx > 0) {
        let pos = idx - 1;
        while (pos >= 0 && temp[pos] === ' ') pos--;
        if (pos >= 0 && (temp[pos] === '+' || temp[pos] === '-')) {
          foundOp = temp[pos];
        }
      }

      const absNum = Math.abs(term.num);

      if (term.num < 0 && foundOp === '+') {
        result += ` - ${absNum}÷${term.den}`;
      } else if (term.num < 0 && foundOp === '-') {
        result += ` - ${absNum}÷${term.den}`;
      } else if (term.num >= 0 && foundOp === '-') {
        result += ` - ${term.num}÷${term.den}`;
      } else {
        result += ` + ${term.num}÷${term.den}`;
      }
    } else {
      result += `${term.num}÷${term.den}`;
    }
  }

  result = normalizeExpr(result);
  return result;
}

/**
 * ШАГ 7: Объединение числителей.
 */
function stepCombineNumerators(expr) {
  if (!expr) return expr;

  const terms = splitByPlusMinus(expr);

  if (terms.length < 2) return expr;

  const dens = terms.map(t => extractDenominator(t));
  const firstDen = dens[0];
  const allSame = dens.every(d => d === firstDen);

  if (!allSame || firstDen === 1) return expr;

  let numeratorStr = '';

  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    const num = extractNumerator(term);

    let op = '+';
    if (i > 0) {
      const trimmed = term.trim();
      if (trimmed.startsWith('+')) {
        op = '+';
      } else if (trimmed.startsWith('-')) {
        op = '-';
      } else {
        let temp = expr;
        let idx = temp.indexOf(term);
        if (idx > 0) {
          let pos = idx - 1;
          while (pos >= 0 && temp[pos] === ' ') pos--;
          if (pos >= 0 && (temp[pos] === '+' || temp[pos] === '-')) {
            op = temp[pos];
          }
        }
      }
    }

    const absNum = Math.abs(num);

    if (i === 0) {
      numeratorStr = String(num);
    } else {
      if (num < 0 && op === '+') {
        numeratorStr += ` - ${absNum}`;
      } else if (num < 0 && op === '-') {
        numeratorStr += ` - ${absNum}`;
      } else if (num >= 0 && op === '-') {
        numeratorStr += ` - ${num}`;
      } else {
        numeratorStr += ` + ${num}`;
      }
    }
  }

  const result = `(${numeratorStr})÷${firstDen}`;
  return result;
}

/**
 * ШАГ 8: Сокращение и выделение целой части.
 */
function stepReduceAndExtract(expr) {
  if (!expr) return expr;

  let result = expr;
  const parts = result.split('÷');
  if (parts.length === 2) {
    let num = parseInt(parts[0], 10);
    let den = parseInt(parts[1], 10);

    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      const g = gcd(Math.abs(num), Math.abs(den));
      if (g > 1) {
        num /= g;
        den /= g;
        result = formatFraction(num, den);
      }

      if (den !== 1) {
        const whole = Math.floor(num / den);
        const remainder = num % den;
        if (whole > 0 && remainder !== 0) {
          result = `${whole}${MARKERS.WHOLE_START}${remainder}÷${den}${MARKERS.WHOLE_END}`;
        } else if (whole > 0) {
          result = `${whole}`;
        }
      } else {
        result = `${num}`;
      }
    }
  }
  return result;
}

// ============================================================
// ОСНОВНАЯ ФУНКЦИЯ generateSteps
// ============================================================

/**
 * Генерирует пошаговое решение дробного выражения.
 * @param {string} expression - исходное выражение
 * @param {Fraction} [resultFraction] - заранее вычисленный результат
 * @returns {string[]} массив шагов
 */
export function generateSteps(expression, resultFraction) {
  if (!expression || expression.trim() === '' || expression === '0') {
    return ['0'];
  }

  // ===== ШАГ 1: Исходное выражение =====
  // Очищаем от маркеров и добавляем неявные операторы
  let currentExpr = expression.trim();
  // Заменяем маркеры на обычные скобки для отображения
  currentExpr = currentExpr.replace(/⥾/g, '(').replace(/⥿/g, ')');
  currentExpr = currentExpr.replace(/⥑/g, '(').replace(/⥏/g, ')');

  // Добавляем неявные операторы для читаемости
  currentExpr = insertImplicitMultiplication(currentExpr);

  const steps = [currentExpr];

  try {
    // ===== ШАГ 1.1: Степени и корни =====
    const step1_1 = stepPowersAndRoots(currentExpr);
    if (step1_1 === 'ERROR') {
      steps.push('ERROR');
      return steps;
    }
    if (step1_1 !== currentExpr) {
      currentExpr = step1_1;
      steps.push(currentExpr);
    }

    // ===== ШАГ 2: Вычисление скобок =====
    const step2 = stepBrackets(currentExpr);
    if (step2 === 'ERROR') {
      steps.push('ERROR');
      return steps;
    }
    if (step2 !== currentExpr) {
      currentExpr = step2;
      steps.push(currentExpr);
    }

    // ===== ШАГ 3: Смешанные дроби → неправильные =====
    const step3 = stepMixedToImproper(currentExpr);
    if (step3 === 'ERROR') {
      steps.push('ERROR');
      return steps;
    }
    if (step3 !== currentExpr) {
      currentExpr = step3;
      steps.push(currentExpr);
    }

    // ===== ШАГ 4: Деление → умножение =====
    const step4 = stepDivisionToMultiplication(currentExpr);
    if (step4 === 'ERROR') {
      steps.push('ERROR');
      return steps;
    }
    if (step4 !== currentExpr) {
      currentExpr = step4;
      steps.push(currentExpr);
    }

    // ===== ШАГ 5: Умножение дробей =====
    const step5 = stepMultiplyFractions(currentExpr);
    if (step5 === 'ERROR') {
      steps.push('ERROR');
      return steps;
    }
    if (step5 !== currentExpr) {
      currentExpr = step5;
      steps.push(currentExpr);
    }

    // ===== ШАГ 6: Общий знаменатель =====
    const step6 = stepCommonDenominator(currentExpr);
    if (step6 === 'ERROR') {
      steps.push('ERROR');
      return steps;
    }
    if (step6 !== currentExpr) {
      currentExpr = step6;
      steps.push(currentExpr);
    }

    // ===== ШАГ 7: Объединение числителей =====
    if (currentExpr.includes('+') || currentExpr.includes('-')) {
      const terms = splitByPlusMinus(currentExpr);
      if (terms.length > 1) {
        const dens = terms.map(t => extractDenominator(t));
        const allSame = dens.every(d => d === dens[0]);
        if (allSame && dens[0] > 1) {
          const step7 = stepCombineNumerators(currentExpr);
          if (step7 === 'ERROR') {
            steps.push('ERROR');
            return steps;
          }
          if (step7 !== currentExpr) {
            currentExpr = step7;
            steps.push(currentExpr);
          }
        }
      }
    }

    // ===== ШАГ 8: Вычисление числителя =====
    // Вычисляем результат, если его нет
    if (!resultFraction) {
      resultFraction = evaluateFractionExpression(currentExpr);
    }

    // Показываем промежуточный результат (числитель÷знаменатель)
    const rawResult = formatFraction(resultFraction.num, resultFraction.den);
    if (rawResult !== currentExpr && steps[steps.length - 1] !== rawResult) {
      steps.push(rawResult);
      currentExpr = rawResult;
    }

    const reduced = stepReduceAndExtract(currentExpr);
    if (reduced !== currentExpr && reduced !== rawResult) {
      steps.push(reduced);
      currentExpr = reduced;
    }

    // ===== ШАГ 9: Результат (выделение целой части) =====
    const finalResult = resultFraction.toMixedString();
    if (steps[steps.length - 1] !== finalResult) {
      steps.push(finalResult);
    }

    // ===== УДАЛЯЕМ ЛИШНИЕ ШАГИ =====
    const meaningfulSteps = [];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Пропускаем дубликаты
      if (meaningfulSteps.length > 0 && meaningfulSteps[meaningfulSteps.length - 1] === step) {
        continue;
      }

      // Пропускаем шаги, которые являются промежуточными вычислениями
      // Например, если шаг - это сокращение одной дроби, а не всего выражения
      if (step.includes('÷') && !step.includes('+') && !step.includes('-') && !step.includes('*')) {
        // Проверяем, является ли это финальным результатом
        if (step !== finalResult) {
          // Проверяем, не является ли это промежуточным сокращением
          const nextStep = steps[i + 1] || '';
          if (nextStep && nextStep.includes('÷') && !nextStep.includes('+') && !nextStep.includes('-')) {
            // Если следующий шаг - тоже одна дробь, пропускаем текущий
            continue;
          }
        }
      }

      meaningfulSteps.push(step);
    }

    // Убеждаемся, что последний шаг - это результат
    if (meaningfulSteps.length > 0 && meaningfulSteps[meaningfulSteps.length - 1] !== finalResult) {
      meaningfulSteps.push(finalResult);
    }

    return meaningfulSteps;

  } catch (error) {
    console.error('[Steps Generator Error]:', error);
    steps.push('ERROR');
    return steps;
  }
}