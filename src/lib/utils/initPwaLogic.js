/*
Браузер генерирует событие beforeinstallprompt, если приложение «достойно» установки.
Задача: 
Шаг 1. Перехватываем это событие, 
Шаг 2. установить приложение по нажатию на кастомную кнопку или через браузерные три точки, 
Шаг 3. Обработать успешную установку.
*/

import { appStore } from "$lib/store/appStore.svelte";
import { getCurrentISODate } from "./getCurrentISODate";


let deferredPrompt; // переменная для хранения события beforeinstallprompt

/**
 * Инициализация проверки возможности установки.
 * Запускается один раз в src/routes/+layout.svelte при загрузке (через $effect)
 */
export function initPwaLogic() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Доступна установка приложения src/lib/utils/initPwaLogic.js function initPwaLogic')
    e.preventDefault();
    deferredPrompt = e;

    // Если браузер предложил установку, значит приложение точно не установлено 
    // Сбрасываем флаг installed, если он вдруг был true 
    if (appStore.installed) { appStore.installed = false; }

    // Разрешаем показ кнопки в интерфейсе
    appStore.canInstall = true;
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA успешно установлено!');
    deferredPrompt = null;
    appStore.canInstall = false;
    appStore.installed = getCurrentISODate();
  });
}

/**
 * Вызывается при клике на кнопку "Установить"
 */
export async function installPwaAction() {
  if (!deferredPrompt) return;

  // Показываем системное окно
  await deferredPrompt.prompt();

  // Ждем ответа пользователя
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    console.log('Пользователь принял установку');
  } else {
    console.log('Пользователь отклонил установку');
  }

  // Очищаем, так как событие одноразовое
  deferredPrompt = null;
  appStore.canInstall = false;
}