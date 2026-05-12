/**
 * src/lib/utils/keyboardHandler.js
 * 
 * Универсальный обработчик клавиш для калькуляторов.
 * @param {KeyboardEvent} e - Событие клавиатуры
 * @param {Object} actions - Объект с функциями калькулятора
 */
export function handleCalculatorKey(e, actions) {
  // Игнорируем системные сочетания
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const { addDigit, addOperator, addDecimal, backspace, clear, performCalculation, percentage, toPower, bigFactorial } = actions;
  const key = e.key;

  //  КОМАНДЫ
  if (key === 'Backspace') {
    e.preventDefault();
    backspace?.();
    return;
  }

  if (key === 'Escape' || key === 'Delete') {
    e.preventDefault();
    clear?.();
    return;
  }

  if (key === 'Enter' || key === '=' || key === ' ') {
    e.preventDefault();
    performCalculation?.();
    return;
  }

  //  %
  if (key === '%') {
    e.preventDefault();
    percentage?.();
    return;
  }

  //  ^
  if (key === '^') {
    e.preventDefault();
    toPower?.();
    return;
  }

  //  !
  if (key === '!') {
    e.preventDefault();
    bigFactorial?.();
    return;
  }

  //  ТОЧКА / ЗАПЯТАЯ
  if (key === '.' || key === ',') {
    e.preventDefault();
    addDecimal?.();
    return;
  }


  //  ЦИФРЫ
  const digits = '0123456789';
  if (digits.includes(key)) {
    e.preventDefault();
    addDigit?.(key);
    return;
  }

  // 4. ОПЕРАТОРЫ
  const operators = {
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '/'
  };

  if (operators[key]) {
    e.preventDefault();
    addOperator?.(operators[key]);
  }
}