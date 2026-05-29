/**
 * src/lib/utils/keyboardHandler.js
 * 
 * Универсальный обработчик клавиш физической клавиатуры для калькуляторов.
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

/** Применение на странице
 * // обрабатываем ввод с клавиатуры ПК - только для desktop

  import { onMount } from 'svelte';
  import { handleCalculatorKey } from '$lib/utils/keyboardHandler.js';
  import { addDigit, addOperator, performCalculation } from '$lib/services/math/mathActions.svelte';
  import { addDecimal, backspace, clear } from '$lib/services/math/mathBaseBtn';
  import { percentage, toPower, bigFactorial } from '$lib/services/math/opBtnBasic';

  // поддержка ввода с клавиатуры на ПК
  onMount(() => {
    // 1. Проверка на десктоп
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // 2. Создаем замыкание обработчика
    const onKeyDown = (e) =>
      handleCalculatorKey(e, {
        addDigit,
        addOperator,
        addDecimal,
        backspace,
        clear,
        performCalculation,
        percentage,
        toPower,
        bigFactorial
      });

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });
 * 
 * */