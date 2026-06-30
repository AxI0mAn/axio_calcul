import { evaluateFractionExpression } from './fractionCore.js';
import { MARKERS, parseExpressionToTokens } from './fractionVisualParser.js';
import {
  transformMixedFractionWithDivision,
  insertImplicitMultiplication,
  transformMixedNumberWithoutDivision,
  transformNegativeMixedNumber,
  transformMixedNumberWithComplexBrackets
} from './fractionActions.js';

// ---- Вспомогательные функции (не дублируем, только необходимое) ----

function stepLcm(a, b) {
  const gcd = (x, y) => {
    x = Math.abs(x); y = Math.abs(y);
    while (y !== 0) { const t = y; y = x % y; x = t; }
    return x;
  };
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function tokensToExpr(tokens) {
  return tokens.map(t => {
    if (t.type === 'fraction') {
      if (t.whole) return `${t.whole}${MARKERS.WHOLE_START}${t.num}${MARKERS.DIV}${t.den}${MARKERS.WHOLE_END}`;
      return `${t.num}${MARKERS.DIV}${t.den}`;
    }
    return t.value;
  }).join('');
}

function evaluateSubExpression(expr) {
  if (!expr || expr.trim() === '') return 'ERROR';
  try {
    const frac = evaluateFractionExpression(expr);
    if (frac.den === 1) return String(frac.num);
    return `${frac.num}÷${frac.den}`;
  } catch {
    return 'ERROR';
  }
}

function normalizeParentheses(expr) {
  if (!expr || expr.trim() === '') return expr;
  let result = expr;
  let changed = true;
  let guard = 0;
  while (changed && guard < 20) {
    changed = false;
    guard++;
    let openIdx = result.lastIndexOf('(');
    if (openIdx === -1) break;
    let balance = 0, closeIdx = -1;
    for (let i = openIdx; i < result.length; i++) {
      if (result[i] === '(') balance++;
      else if (result[i] === ')') balance--;
      if (balance === 0) { closeIdx = i; break; }
    }
    if (closeIdx === -1) break;
    const inner = result.slice(openIdx + 1, closeIdx);
    const tokens = parseExpressionToTokens(inner);
    if (tokens.length === 1) {
      const token = tokens[0];
      if (token.type === 'text' || token.type === 'fraction' || token.type === 'superscript') {
        result = result.slice(0, openIdx) + inner + result.slice(closeIdx + 1);
        changed = true;
      }
    }
  }
  result = result.replace(/\(\)/g, '');
  return result;
}

// ---- Функции проверки необходимости шагов (оставлены) ----

function hasTopLevelOperator(str) {
  let balance = 0;
  for (const ch of str) {
    if (ch === '(') balance++;
    else if (ch === ')') balance--;
    else if (balance === 0 && ['+', '-', '*', '/', '^', '√'].includes(ch)) return true;
  }
  return false;
}

function needStep2(expr) {
  if (!expr) return false;
  let balance = 0;
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === '(') balance++;
    else if (expr[i] === ')') balance--;
    else if (balance > 0 && ['+', '-', '*', '/', '^', '√'].includes(expr[i])) return true;
  }
  return false;
}

function needStep3(expr) {
  return expr ? expr.includes(MARKERS.WHOLE_START) : false;
}

function needStep4(expr) {
  if (!expr) return false;
  let balance = 0;
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === '(') balance++;
    else if (expr[i] === ')') balance--;
    else if (expr[i] === '/' && balance === 0) {
      // используем функцию из fractionActions, но она только преобразует, а нам нужно проверить
      // упростим: проверим наличие дроби слева и справа
      let left = extractOperand(expr, i, 'left');
      let right = extractOperand(expr, i, 'right');
      if (left.includes('÷') && right.includes('÷')) return true;
    }
    i++;
  }
  return false;
}

function needStep5(expr) {
  if (!expr) return false;
  let balance = 0;
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === '(') balance++;
    else if (expr[i] === ')') balance--;
    else if (expr[i] === '*' && balance === 0) {
      let left = extractOperand(expr, i, 'left');
      let right = extractOperand(expr, i, 'right');
      if (left.includes('÷') && right.includes('÷')) return true;
    }
    i++;
  }
  return false;
}

function needStep6(expr) {
  if (!expr) return false;
  const terms = splitByPlusMinus(expr);
  if (terms.length < 2) return false;
  const dens = terms.map(t => extractDenominator(t));
  const first = dens[0];
  return dens.some(d => d !== first);
}

function needStep7(expr) {
  if (!expr) return false;
  const terms = splitByPlusMinus(expr);
  if (terms.length < 2) return false;
  for (let i = 0; i < terms.length - 1; i++) {
    if (terms[i].includes('÷') && terms[i + 1].includes('÷')) return true;
  }
  return false;
}

function needStep8(expr) {
  if (!expr) return false;
  const parts = expr.split('÷');
  if (parts.length !== 2) return false;
  const num = parseInt(parts[0], 10);
  const den = parseInt(parts[1], 10);
  if (isNaN(num) || isNaN(den) || den === 0) return false;
  const g = gcd(num, den);
  return g > 1;
}

// ---- Вспомогательные для извлечения операндов (используются в needStep) ----

function extractOperand(expr, opIdx, side) {
  if (side === 'left') {
    let start = opIdx - 1;
    if (expr[start] === ')') {
      let balance = 1;
      let pos = start - 1;
      while (pos >= 0 && balance > 0) {
        if (expr[pos] === ')') balance++;
        else if (expr[pos] === '(') balance--;
        pos--;
      }
      start = pos + 1;
    } else {
      while (start >= 0 && !'+-*/^√('.includes(expr[start])) start--;
      start++;
    }
    return expr.slice(start, opIdx).trim();
  } else {
    let end = opIdx + 1;
    if (expr[end] === '(') {
      let balance = 1;
      let pos = end + 1;
      while (pos < expr.length && balance > 0) {
        if (expr[pos] === '(') balance++;
        else if (expr[pos] === ')') balance--;
        pos++;
      }
      end = pos;
    } else {
      while (end < expr.length && !'+-*/^√)('.includes(expr[end])) end++;
    }
    return expr.slice(opIdx + 1, end).trim();
  }
}

function splitByPlusMinus(expr) {
  const terms = [];
  let current = '';
  let balance = 0;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '(') { balance++; current += ch; continue; }
    if (ch === ')') { balance--; current += ch; continue; }
    if ((ch === '+' || ch === '-') && balance === 0) {
      const prev = current.length > 0 ? current[current.length - 1] : '';
      if (prev.match(/\d/) || prev === ')') {
        if (current.trim()) terms.push(current.trim());
        current = '';
        continue;
      }
    }
    current += ch;
  }
  if (current.trim()) terms.push(current.trim());
  return terms;
}

function extractDenominator(term) {
  const parts = term.split('÷');
  if (parts.length === 2) {
    const den = parseInt(parts[1], 10);
    return isNaN(den) ? 1 : den;
  }
  return 1;
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = b; b = a % b; a = t; }
  return a;
}

// ---- Функции преобразований (используют импортированные из fractionActions) ----

function convertMixedToImproper(expr) {
  // Используем готовые трансформации из fractionActions
  let result = expr;
  // transformMixedNumberWithoutDivision и другие уже есть
  // Но они работают со всеми случаями, поэтому применим их все
  result = transformMixedNumberWithoutDivision(result);
  result = transformNegativeMixedNumber(result);
  result = transformMixedNumberWithComplexBrackets(result);
  result = transformMixedFractionWithDivision(result);
  return result;
}

function replaceDivisionWithMultiply(expr) {
  // Здесь мы можем просто вызвать функцию из fractionActions? 
  // В fractionActions есть transformMixedFractionWithDivision, но не отдельная для /
  // Оставим свою простую замену
  let result = '';
  let i = 0;
  let balance = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === '(') balance++;
    else if (ch === ')') balance--;
    else if (ch === '/' && balance === 0) {
      const left = extractOperand(expr, i, 'left');
      const right = extractOperand(expr, i, 'right');
      if (left.includes('÷') && right.includes('÷')) {
        const rParts = right.split('÷');
        if (rParts.length === 2) {
          const flipped = rParts[1] + '÷' + rParts[0];
          result += expr.slice(0, i - left.length) + left + '*' + flipped;
          i += left.length + 1 + right.length + 1;
          continue;
        }
      }
    }
    result += ch;
    i++;
  }
  return result;
}

function collapseMultiplications(expr) {
  let result = '';
  let i = 0;
  let balance = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === '(') balance++;
    else if (ch === ')') balance--;
    else if (ch === '*' && balance === 0) {
      const left = extractOperand(expr, i, 'left');
      const right = extractOperand(expr, i, 'right');
      if (left.includes('÷') && right.includes('÷')) {
        const lParts = left.split('÷');
        const rParts = right.split('÷');
        if (lParts.length === 2 && rParts.length === 2) {
          const newNum = parseInt(lParts[0], 10) * parseInt(rParts[0], 10);
          const newDen = parseInt(lParts[1], 10) * parseInt(rParts[1], 10);
          const newFrac = `${newNum}÷${newDen}`;
          result += expr.slice(0, i - left.length) + newFrac;
          i += left.length + 1 + right.length + 1;
          continue;
        }
      }
    }
    result += ch;
    i++;
  }
  return result;
}

function commonDenominator(expr) {
  const terms = splitByPlusMinus(expr);
  if (terms.length < 2) return expr;
  const dens = terms.map(t => extractDenominator(t));
  let common = dens[0];
  for (let d of dens) common = stepLcm(common, d);
  const newTerms = terms.map(term => {
    let num = 0, den = 1;
    const parts = term.split('÷');
    if (parts.length === 2) {
      num = parseInt(parts[0], 10);
      den = parseInt(parts[1], 10);
    } else {
      num = parseInt(parts[0], 10);
    }
    const factor = common / den;
    return (num * factor) + '÷' + common;
  });
  let result = '';
  for (let i = 0; i < newTerms.length; i++) {
    if (i > 0) {
      // восстанавливаем оператор
      let op = '+';
      // поищем в исходном выражении
      let temp = expr;
      let idx = temp.indexOf(terms[i]);
      if (idx > 0) {
        let ch = temp[idx - 1];
        while (ch === ' ') ch = temp[--idx];
        if (ch === '+' || ch === '-') op = ch;
      }
      result += ' ' + op + ' ';
    }
    result += newTerms[i];
  }
  return result;
}

function combineNumerators(expr) {
  const terms = splitByPlusMinus(expr);
  if (terms.length < 2) return expr;
  const ops = [];
  let temp = expr;
  for (let i = 1; i < terms.length; i++) {
    let idx = temp.indexOf(terms[i]);
    if (idx > 0) {
      let ch = temp[idx - 1];
      while (ch === ' ') ch = temp[--idx];
      ops.push(ch === '+' ? '+' : '-');
    } else ops.push('+');
  }
  const fractions = terms.map(t => {
    const parts = t.split('÷');
    if (parts.length === 2) {
      return { num: parseInt(parts[0], 10), den: parseInt(parts[1], 10) };
    } else {
      return { num: parseInt(parts[0], 10), den: 1 };
    }
  });
  let common = fractions[0].den;
  for (let f of fractions) common = stepLcm(common, f.den);
  let total = 0;
  for (let i = 0; i < fractions.length; i++) {
    const val = fractions[i].num * (common / fractions[i].den);
    total += (i === 0 ? val : (ops[i - 1] === '+' ? val : -val));
  }
  return `(${total})÷${common}`;
}

function reduceFraction(expr) {
  const parts = expr.split('÷');
  if (parts.length !== 2) return expr;
  let num = parseInt(parts[0], 10);
  let den = parseInt(parts[1], 10);
  if (isNaN(num) || isNaN(den) || den === 0) return expr;
  const g = gcd(num, den);
  if (g > 1) {
    num /= g;
    den /= g;
    return `${num}÷${den}`;
  }
  return expr;
}

// ---- Основная функция generateSteps ----

export function generateSteps(expression, resultFraction) {
  if (!expression || expression.trim() === '' || expression === '0') {
    return ['0'];
  }

  let currentExpr = insertImplicitMultiplication(expression.trim());
  const steps = [currentExpr];

  try {
    // ШАГ 2: Вычисление скобок
    if (needStep2(currentExpr)) {
      let changed = true;
      let guard = 0;
      while (changed && guard < 20) {
        changed = false;
        guard++;
        let openIdx = currentExpr.lastIndexOf('(');
        if (openIdx === -1) break;
        let balance = 0, closeIdx = -1;
        for (let i = openIdx; i < currentExpr.length; i++) {
          if (currentExpr[i] === '(') balance++;
          else if (currentExpr[i] === ')') balance--;
          if (balance === 0) { closeIdx = i; break; }
        }
        if (closeIdx === -1) break;
        const inner = currentExpr.slice(openIdx + 1, closeIdx);
        if (hasTopLevelOperator(inner)) {
          const result = evaluateSubExpression(inner);
          if (result === 'ERROR') { steps.push('ERROR'); return steps; }
          const replacement = result.includes('÷') ? `(${result})` : result;
          currentExpr = currentExpr.slice(0, openIdx) + replacement + currentExpr.slice(closeIdx + 1);
          currentExpr = normalizeParentheses(currentExpr);
          currentExpr = insertImplicitMultiplication(currentExpr);
          steps.push(currentExpr);
          changed = true;
        }
      }
    }

    // ШАГ 3: Смешанные дроби → неправильные
    if (needStep3(currentExpr)) {
      const newExpr = convertMixedToImproper(currentExpr);
      if (newExpr !== currentExpr) {
        currentExpr = normalizeParentheses(newExpr);
        currentExpr = insertImplicitMultiplication(currentExpr);
        steps.push(currentExpr);
      }
    }

    // ШАГ 4: Замена / на * с переворотом
    if (needStep4(currentExpr)) {
      const newExpr = replaceDivisionWithMultiply(currentExpr);
      if (newExpr !== currentExpr) {
        currentExpr = normalizeParentheses(newExpr);
        currentExpr = insertImplicitMultiplication(currentExpr);
        steps.push(currentExpr);
      }
    }

    // ШАГ 5: Сворачивание умножений
    if (needStep5(currentExpr)) {
      const newExpr = collapseMultiplications(currentExpr);
      if (newExpr !== currentExpr) {
        currentExpr = normalizeParentheses(newExpr);
        currentExpr = insertImplicitMultiplication(currentExpr);
        steps.push(currentExpr);
      }
    }

    // ШАГ 6: Общий знаменатель
    if (needStep6(currentExpr)) {
      const newExpr = commonDenominator(currentExpr);
      if (newExpr !== currentExpr) {
        currentExpr = normalizeParentheses(newExpr);
        currentExpr = insertImplicitMultiplication(currentExpr);
        steps.push(currentExpr);
      }
    }

    // ШАГ 7: Объединение числителей
    if (needStep7(currentExpr)) {
      const newExpr = combineNumerators(currentExpr);
      if (newExpr !== currentExpr) {
        currentExpr = normalizeParentheses(newExpr);
        currentExpr = insertImplicitMultiplication(currentExpr);
        steps.push(currentExpr);
      }
    }

    // ШАГ 8: Сокращение
    if (needStep8(currentExpr)) {
      const newExpr = reduceFraction(currentExpr);
      if (newExpr !== currentExpr) {
        currentExpr = normalizeParentheses(newExpr);
        currentExpr = insertImplicitMultiplication(currentExpr);
        steps.push(currentExpr);
      }
    }

    // ---- Обработка степеней (добавлена как отдельный проход, если не были обработаны) ----
    // Но мы также добавим итеративный цикл для обработки оставшихся операций, как в старой версии,
    // чтобы гарантировать все шаги. Включим его после всех needStep, чтобы не пропустить операции.
    let calcGuard = 0;
    while (calcGuard < 20) {
      let tokens = parseExpressionToTokens(currentExpr);
      let changed = false;

      // Сначала степени
      let powerIdx = tokens.findIndex(t => t.value === '^');
      if (powerIdx !== -1) {
        const left = tokens[powerIdx - 1];
        const right = tokens[powerIdx + 1];
        if (left && right) {
          let leftStr = left.type === 'fraction' ? `${left.num}÷${left.den}` : left.value;
          let rightStr = right.type === 'fraction' ? `${right.num}÷${right.den}` : right.value;
          const powerExpr = `${leftStr}^${rightStr}`;
          const result = evaluateSubExpression(powerExpr);
          if (result === 'ERROR') { steps.push('ERROR'); return steps; }
          tokens.splice(powerIdx - 1, 3, { type: 'text', value: result });
          currentExpr = tokensToExpr(tokens);
          currentExpr = normalizeParentheses(currentExpr);
          currentExpr = insertImplicitMultiplication(currentExpr);
          steps.push(currentExpr);
          changed = true;
          continue;
        }
      }

      // Затем умножение/деление
      const hasMulDiv = tokens.some(t => t.value === '*' || t.value === '÷');
      const hasPlusMinus = tokens.some(t => t.value === '+' || t.value === '-');
      if (!hasMulDiv && !hasPlusMinus) break;

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
          let reverseExpr = `${left.num}÷${left.den}*${right.den}÷${right.num}`;
          tokens.splice(targetOpIdx - 1, 3, { type: 'text', value: reverseExpr });
          currentExpr = tokensToExpr(tokens);
          currentExpr = normalizeParentheses(currentExpr);
          currentExpr = insertImplicitMultiplication(currentExpr);
          steps.push(currentExpr);
          changed = true;
          continue;
        }
        if (op === '*') {
          const calcFrac = evaluateFractionExpression(`${left.num}÷${left.den}*${right.num}÷${right.den}`);
          tokens.splice(targetOpIdx - 1, 3, { type: 'fraction', num: String(calcFrac.num), den: String(calcFrac.den) });
          currentExpr = tokensToExpr(tokens);
          currentExpr = normalizeParentheses(currentExpr);
          currentExpr = insertImplicitMultiplication(currentExpr);
          steps.push(currentExpr);
          changed = true;
          continue;
        }
        if (op === '+' || op === '-') {
          const d1 = parseInt(left.den, 10);
          const d2 = parseInt(right.den, 10);
          if (d1 !== d2) {
            const commonDen = stepLcm(d1, d2);
            const n1 = parseInt(left.num, 10) * (commonDen / d1);
            const n2 = parseInt(right.num, 10) * (commonDen / d2);
            let commonParts = [...tokens];
            commonParts[targetOpIdx - 1] = { type: 'fraction', num: String(n1), den: String(commonDen) };
            commonParts[targetOpIdx + 1] = { type: 'fraction', num: String(n2), den: String(commonDen) };
            currentExpr = tokensToExpr(commonParts);
            currentExpr = normalizeParentheses(currentExpr);
            currentExpr = insertImplicitMultiplication(currentExpr);
            steps.push(currentExpr);
            commonParts.splice(targetOpIdx - 1, 3, { type: 'text', value: `(${n1}${op}${n2})÷${commonDen}` });
            currentExpr = tokensToExpr(commonParts);
            currentExpr = normalizeParentheses(currentExpr);
            currentExpr = insertImplicitMultiplication(currentExpr);
            steps.push(currentExpr);
          } else {
            let commonParts = [...tokens];
            commonParts.splice(targetOpIdx - 1, 3, { type: 'text', value: `(${left.num}${op}${right.num})÷${left.den}` });
            currentExpr = tokensToExpr(commonParts);
            currentExpr = normalizeParentheses(currentExpr);
            currentExpr = insertImplicitMultiplication(currentExpr);
            steps.push(currentExpr);
          }
          const calcFrac = evaluateFractionExpression(`${left.num}÷${left.den}${op}${right.num}÷${right.den}`);
          tokens.splice(targetOpIdx - 1, 3, { type: 'fraction', num: String(calcFrac.num), den: String(calcFrac.den) });
          currentExpr = tokensToExpr(tokens);
          currentExpr = normalizeParentheses(currentExpr);
          currentExpr = insertImplicitMultiplication(currentExpr);
          steps.push(currentExpr);
          changed = true;
          continue;
        }
      }
      calcGuard++;
      if (!changed) break;
    }

    // ФИНАЛ: результат
    if (!resultFraction) {
      resultFraction = evaluateFractionExpression(currentExpr);
    }
    const raw = `${resultFraction.num}÷${resultFraction.den}`;
    if (steps[steps.length - 1] !== raw) steps.push(raw);
    const mixed = resultFraction.toMixedString();
    if (steps[steps.length - 1] !== mixed) steps.push(mixed);

    // Удаляем дубликаты
    const unique = [];
    for (let s of steps) {
      if (unique.length === 0 || unique[unique.length - 1] !== s) {
        unique.push(s);
      }
    }
    return unique;

  } catch (error) {
    console.error('[Steps Generator Error]:', error);
    steps.push('ERROR');
    return steps;
  }
}

// ВРЕМЕННО: для ручного тестирования (удалить после проверки)
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.generateSteps = generateSteps;
}