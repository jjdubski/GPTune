import React, { useState, useEffect, useRef } from "react";

interface ScrollbarProps {
  scrollHeight: number;
  visibleHeight: number;
  scrollTop: number;
  onScroll: (newScrollTop: number) => void;
}

const Scrollbar: React.FC<ScrollbarProps> = ({
  scrollHeight,
  visibleHeight,
  scrollTop,
  onScroll,
}) => {
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false); //false to begin, toggled when click and hold
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setStartY(e.clientY);
    setStartScrollTop(scrollTop);
    document.addEventListener("mousemove", handleMouseMove); //makes scroll thumb move with mouse itself
    document.addEventListener("mouseup", handleMouseUp); //same, but for upwards
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const deltaY = e.clientY - startY;
      const maxScrollTop = scrollHeight - visibleHeight;
      const newScrollTop = Math.min(
        maxScrollTop,
        Math.max(0, startScrollTop + (deltaY * maxScrollTop) / visibleHeight)
      );
      onScroll(newScrollTop);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const scrollbarHeight =
    scrollHeight > visibleHeight
      ? (visibleHeight / scrollHeight) * visibleHeight
      : visibleHeight;

  const scrollbarTop =
    scrollHeight > visibleHeight
      ? (scrollTop / (scrollHeight - visibleHeight)) * (visibleHeight - scrollbarHeight)
      : 0;

  return ( //see documentation for info on these flags - https://www.npmjs.com/package/react-scrollbars-custom
    <div className="absolute top-0 right-1 w-2 h-full bg-gray-300 rounded"> 
      <div
        ref={scrollbarRef}
        className="w-full bg-gray-600 rounded cursor-pointer"
        style={{ height: scrollbarHeight, top: scrollbarTop, position: "relative" }}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default Scrollbar;
