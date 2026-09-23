import { useRef, useEffect } from 'react';

export function useDraggableScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    const handleMouseDown = (e: MouseEvent) => {
      // Support left click (0) and right click (2)
      if (e.button !== 0 && e.button !== 2) return;

      isDown = true;
      startX = e.clientX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
      hasDragged = false;

      element.style.cursor = 'grabbing';
    };

    const handleMouseLeaveOrUp = () => {
      if (!isDown) return;
      isDown = false;
      element.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;

      const x = e.clientX - element.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag sensitivity multiplier

      if (Math.abs(walk) > 6) {
        hasDragged = true;
      }

      element.scrollLeft = scrollLeft - walk;
    };

    const handleContextMenu = (e: MouseEvent) => {
      // Suppress right-click context menu if user dragged
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    };

    const handleClickCapture = (e: MouseEvent) => {
      // Prevent child click navigation if the action was a drag
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
        hasDragged = false;
      }
    };

    element.style.cursor = 'grab';
    element.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseLeaveOrUp);
    element.addEventListener('mouseleave', handleMouseLeaveOrUp);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('contextmenu', handleContextMenu);
    element.addEventListener('click', handleClickCapture, true);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseLeaveOrUp);
      element.removeEventListener('mouseleave', handleMouseLeaveOrUp);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('contextmenu', handleContextMenu);
      element.removeEventListener('click', handleClickCapture, true);
    };
  }, []);

  return ref;
}
