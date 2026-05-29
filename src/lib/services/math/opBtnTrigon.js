/**
 * src/lib/services/math/trigon.js
 */
import { appState } from "$lib/store/appState.svelte";

function applyTrig(funcName) {
  const val = String(appState.display);

  // Если на экране 0 или флаг нового ввода (после "="), начинаем новую функцию
  if (val === '0' || appState.isNewInput) {
    appState.display = `${funcName}(`;
  }
  // Если на экране уже есть число (например, "10"), оборачиваем его с текущим юнитом
  else {
    appState.display = `${funcName}(${val}${appState.corner})`;
  }

  appState.isNewInput = false;
}

export const sinFunc = () => applyTrig('sin');
export const sinhFunc = () => applyTrig('sinh');
export const asinFunc = () => applyTrig('asin');
export const asinhFunc = () => applyTrig('asinh');
export const cosFunc = () => applyTrig('cos');
export const coshFunc = () => applyTrig('cosh');
export const acosFunc = () => applyTrig('acos');
export const acoshFunc = () => applyTrig('acosh');
export const tanFunc = () => applyTrig('tan');
export const tanhFunc = () => applyTrig('tanh');
export const atanFunc = () => applyTrig('atan');
export const atanhFunc = () => applyTrig('atanh');
export const cotFunc = () => applyTrig('cot');
export const cothFunc = () => applyTrig('coth');
export const acotFunc = () => applyTrig('acot');
export const acothFunc = () => applyTrig('acoth');