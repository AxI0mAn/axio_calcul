// src/lib/components/testFraction/calculatorEngineTest.js

import { testMatrix56 } from "./testMatrix56.js";
import { evaluateFraction } from "$lib/services/math/fractionActions.js";
import { appState } from "$lib/store/appState.svelte.js";

/**
 * Создает глубокую копию состояния для изолированного теста
 */
function cloneState(state) {
  return {
    display: state.display,
    expression: state.expression,
    isNewInput: state.isNewInput,
    historySession: [...state.historySession],
    stepsFraction: state.stepsFraction,
    now_mode: state.now_mode
  };
}

/**
 * Выполняет один тест в изолированной среде
 */
export function runSingleTest(input) {
  // Сохраняем оригинальное состояние
  const originalState = cloneState(appState);

  try {
    // Устанавливаем тестовое состояние
    appState.display = input;
    appState.expression = '';
    appState.isNewInput = true;
    appState.historySession = [];

    // Выполняем вычисление
    evaluateFraction();

    // Получаем результат
    const result = appState.display;

    // Восстанавливаем состояние
    Object.assign(appState, originalState);

    return result;
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // Восстанавливаем состояние в случае ошибки
    Object.assign(appState, originalState);
    return 'ERROR';
  }
}

/**
 * Прогоняет все тесты из матрицы
 */
export function runAllTests() {
  const results = [];

  for (const test of testMatrix56) {
    const startTime = performance.now();
    const result = runSingleTest(test.input);
    const endTime = performance.now();

    results.push({
      id: test.id,
      input: test.input,
      expected: test.expected,
      actual: result,
      passed: result === test.expected,
      duration: Math.round(endTime - startTime)
    });
  }

  return results;
}

/**
 * Проверяет регрессию между двумя наборами результатов
 */
export function checkRegression(previousResults, currentResults) {
  const regression = {
    newFails: [],
    newPasses: [],
    unchanged: []
  };

  for (const current of currentResults) {
    const previous = previousResults.find(p => p.id === current.id);
    if (previous) {
      if (previous.passed && !current.passed) {
        regression.newFails.push(current);
      } else if (!previous.passed && current.passed) {
        regression.newPasses.push(current);
      } else {
        regression.unchanged.push(current);
      }
    }
  }

  return regression;
}