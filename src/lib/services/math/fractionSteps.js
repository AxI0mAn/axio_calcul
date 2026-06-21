/**
 * src/lib/services/math/fractionSteps.js
 * Модуль пошагового декодирования и генерации подробного решения дробных выражений.
 */

import { evaluateFractionExpression } from './fractionCore.js';
import { MARKERS, parseExpressionToTokens } from './fractionVisualParser.js';

function stepLcm(a, b) {
  const gcd = (x, y) => {
    x = Math.abs(x); y = Math.abs(y);
    while (y !== 0) { const t = y; y = x % y; x = t; }
    return x;
  };
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Преобразует массив токенов обратно в валидную математическую строку
 */
function tokensToExpr(tokens) {
  return tokens.map(t => {
    if (t.type === 'fraction') {
      if (t.whole) return `${t.whole}${MARKERS.WHOLE_START}${t.num}${MARKERS.DIV}${t.den}${MARKERS.WHOLE_END}`;
      return `${t.num}${MARKERS.DIV}${t.den}`;
    }
    return t.value;
  }).join('');
}

export function generateSteps(expression, resultFraction) {
  const steps = [];

  if (!expression || expression.trim() === '' || expression === '0') {
    return ['0'];
  }

  try {
    let currentExpr = expression.trim();
    steps.push(currentExpr);

    // --- Шаг 1. Схлопывание скобок изнутри наружу ---
    // --- Шаг 1. Схлопывание скобок изнутри наружу с защитой структуры ---
    let hasBrackets = true;
    let bracketGuard = 0;
    while (hasBrackets && bracketGuard < 15) {
      const openIdx = currentExpr.lastIndexOf('(');
      if (openIdx !== -1) {
        const closeIdx = currentExpr.indexOf(')', openIdx);
        if (closeIdx !== -1) {
          const subExpr = currentExpr.substring(openIdx + 1, closeIdx);
          if (subExpr.trim() !== '') {
            const subResult = evaluateFractionExpression(subExpr);
            const mixedResultStr = subResult.toMixedString();

            // ИСКУССТВЕННАЯ ЗАЩИТА: Если результат — это дробь (содержит ÷),
            // мы сохраняем её в родительских скобках для визуальной безопасности: (50÷87)
            const replacement = mixedResultStr.includes(MARKERS.DIV)
              ? `(${mixedResultStr})`
              : mixedResultStr;

            currentExpr = currentExpr.substring(0, openIdx) + replacement + currentExpr.substring(closeIdx + 1);
            steps.push(currentExpr);
          } else {
            currentExpr = currentExpr.substring(0, openIdx) + currentExpr.substring(closeIdx + 1);
          }
        } else {
          // Автозакрытие незавершенных скобок
          const subExpr = currentExpr.substring(openIdx + 1);
          const subResult = evaluateFractionExpression(subExpr);
          const mixedResultStr = subResult.toMixedString();

          const replacement = mixedResultStr.includes(MARKERS.DIV) ? `(${mixedResultStr})` : mixedResultStr;
          currentExpr = currentExpr.substring(0, openIdx) + replacement;
          steps.push(currentExpr);
        }
      } else {
        hasBrackets = false;
      }
      bracketGuard++;
    }

    // --- Шаг 2. Избавление от целых частей (перенос в числитель) ---
    if (currentExpr.includes(MARKERS.WHOLE_START)) {
      let tokens = parseExpressionToTokens(currentExpr);
      let transformed = false;
      let nextExprParts = [];

      for (let tok of tokens) {
        if (tok.type === 'fraction' && tok.whole && tok.whole !== '0') {
          const w = parseInt(tok.whole, 10);
          const n = parseInt(tok.num, 10);
          const d = parseInt(tok.den, 10);
          let sign = w < 0 ? '-' : '';
          let absW = Math.abs(w);

          nextExprParts.push(`${sign}(${absW}*${d}+${n})÷${d}`);
          transformed = true;
        } else if (tok.type === 'fraction') {
          nextExprParts.push(`${tok.num}÷${tok.den}`);
        } else {
          nextExprParts.push(tok.value);
        }
      }

      if (transformed) {
        currentExpr = nextExprParts.join('');
        steps.push(currentExpr);

        let cleanTokens = parseExpressionToTokens(currentExpr);
        let evaluatedParts = [];
        for (let tok of cleanTokens) {
          if (tok.type === 'fraction') {
            const f = evaluateFractionExpression(`${tok.num}÷${tok.den}`);
            evaluatedParts.push(`${f.num}÷${f.den}`);
          } else {
            evaluatedParts.push(tok.value);
          }
        }
        currentExpr = evaluatedParts.join('');
        steps.push(currentExpr);
      }
    }

    // --- Шаг 3. Итеративный расчет бинарных операций слева направо по приоритетам ---
    let calcGuard = 0;
    while (calcGuard < 20) {
      let tokens = parseExpressionToTokens(currentExpr);

      // Ищем операторы
      const hasMulDiv = tokens.some(t => t.value === '*' || t.value === '÷');
      const hasPlusMinus = tokens.some(t => t.value === '+' || t.value === '-');

      if (!hasMulDiv && !hasPlusMinus) break; // Выражение полностью вычислено

      // Определяем индекс оператора с учетом приоритета (мультипликативные первее)
      let targetOpIdx = -1;
      if (hasMulDiv) {
        targetOpIdx = tokens.findIndex(t => t.value === '*' || t.value === '÷');
      } else {
        targetOpIdx = tokens.findIndex(t => t.value === '+' || t.value === '-');
      }

      if (targetOpIdx <= 0 || targetOpIdx >= tokens.length - 1) break;

      const left = tokens[targetOpIdx - 1];
      const op = tokens[targetOpIdx].value;
      const right = tokens[targetOpIdx + 1];

      if (left.type === 'fraction' && right.type === 'fraction') {
        if (op === '÷') {
          // Шаг переворачивания: 1÷1 ÷ 50÷87 -> 1÷1 * 87÷50
          let reverseExpr = `${left.num}÷${left.den}*${right.den}÷${right.num}`;
          tokens.splice(targetOpIdx - 1, 3, { type: 'text', value: reverseExpr });
          currentExpr = tokensToExpr(tokens);
          steps.push(currentExpr);

          // Сразу делаем шаг перемножения, чтобы избавиться от созданного знака '*'
          let freshTokens = parseExpressionToTokens(currentExpr);
          let starIdx = freshTokens.findIndex(t => t.value === '*');
          if (starIdx !== -1) {
            const lF = freshTokens[starIdx - 1];
            const rF = freshTokens[starIdx + 1];
            const calcFrac = evaluateFractionExpression(`${lF.num}÷${lF.den}*${rF.num}÷${rF.den}`);
            freshTokens.splice(starIdx - 1, 3, { type: 'fraction', num: String(calcFrac.num), den: String(calcFrac.den) });
            currentExpr = tokensToExpr(freshTokens);
            steps.push(currentExpr);
          }
          continue;
        }

        if (op === '*') {
          const calcFrac = evaluateFractionExpression(`${left.num}÷${left.den}*${right.num}÷${right.den}`);
          tokens.splice(targetOpIdx - 1, 3, { type: 'fraction', num: String(calcFrac.num), den: String(calcFrac.den) });
          currentExpr = tokensToExpr(tokens);
          steps.push(currentExpr);
          continue;
        }

        if (op === '+' || op === '-') {
          // Перед вычислением приводим пару к общему знаменателю для наглядности шагов
          const d1 = parseInt(left.den, 10);
          const d2 = parseInt(right.den, 10);

          if (d1 !== d2) {
            const commonDen = stepLcm(d1, d2);
            const n1 = parseInt(left.num, 10) * (commonDen / d1);
            const n2 = parseInt(right.num, 10) * (commonDen / d2);

            // Шаг приведения к общему знаменателю
            let commonParts = [...tokens];
            commonParts[targetOpIdx - 1] = { type: 'fraction', num: String(n1), den: String(commonDen) };
            commonParts[targetOpIdx + 1] = { type: 'fraction', num: String(n2), den: String(commonDen) };
            steps.push(tokensToExpr(commonParts));

            // Шаг объединения под общий числитель: (N1 ± N2)÷Common
            commonParts.splice(targetOpIdx - 1, 3, { type: 'text', value: `(${n1}${op}${n2})÷${commonDen}` });
            steps.push(tokensToExpr(commonParts));
          } else {
            // Знаменатели уже одинаковые, сразу объединяем числители
            let commonParts = [...tokens];
            commonParts.splice(targetOpIdx - 1, 3, { type: 'text', value: `(${left.num}${op}${right.num})÷${left.den}` });
            steps.push(tokensToExpr(commonParts));
          }

          // Финальный расчет этой бинарной пары
          const calcFrac = evaluateFractionExpression(`${left.num}÷${left.den}${op}${right.num}÷${right.den}`);
          tokens.splice(targetOpIdx - 1, 3, { type: 'fraction', num: String(calcFrac.num), den: String(calcFrac.den) });
          currentExpr = tokensToExpr(tokens);
          steps.push(currentExpr);
          continue;
        }
      }
      calcGuard++;
    }

    // --- Шаг 4. Финализация и форматирование результата ---
    if (!resultFraction) {
      resultFraction = evaluateFractionExpression(currentExpr);
    }

    const rawResultStr = `${resultFraction.num}÷${resultFraction.den}`;
    if (steps[steps.length - 1] !== rawResultStr) {
      steps.push(rawResultStr);
    }

    const mixedStr = resultFraction.toMixedString();
    if (steps[steps.length - 1] !== mixedStr) {
      steps.push(mixedStr);
    }

    return steps.filter((step, idx) => steps.indexOf(step) === idx);

  } catch (error) {
    console.error('[Steps Generator Error]:', error);
    steps.push('ERROR');
    return steps;
  }
}