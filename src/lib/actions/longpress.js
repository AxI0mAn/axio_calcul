// src/lib/actions/longpress.js
export function longpress(node, threshold = 500) {
  let timer;

  // const handleStart = () => {
  //   timer = setTimeout(() => {
  //     node.dispatchEvent(new CustomEvent('longpress'));
  //   }, threshold);
  // };

  const handleStart = () => {
    timer = setTimeout(() => {
      node.dispatchEvent(new CustomEvent('longpress', {
        bubbles: true,
        detail: { originalEvent: true }
      }));
    }, threshold);
    // === -📝=TODO=📝- ===
    console.log("Longpress triggered!")
  };

  const handleCancel = () => {
    clearTimeout(timer);
  };

  node.addEventListener('mousedown', handleStart);
  node.addEventListener('mouseup', handleCancel);
  node.addEventListener('mouseleave', handleCancel);
  node.addEventListener('touchstart', handleStart, { passive: true });
  node.addEventListener('touchend', handleCancel);
  node.addEventListener('touchcancel', handleCancel); // Добавили для мобилок

  return {
    destroy() {
      node.removeEventListener('mousedown', handleStart);
      node.removeEventListener('mouseup', handleCancel);
      node.removeEventListener('mouseleave', handleCancel);
      node.removeEventListener('touchstart', handleStart);
      node.removeEventListener('touchend', handleCancel);
      node.removeEventListener('touchcancel', handleCancel);
    }
  };
}