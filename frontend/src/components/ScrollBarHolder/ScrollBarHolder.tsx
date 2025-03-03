import React, { useRef, useState, useEffect, useCallback } from "react";
import ScrollBar from "./ScrollBar"; 
import "./ScrollBarHolder.css";

interface ScrollBarHolderProps {
  children: React.ReactNode;
}

const ScrollBarHolder: React.FC<ScrollBarHolderProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [visibleHeight, setVisibleHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const updateScrollMetrics = useCallback(() => {
    if (contentRef.current) {
      setScrollHeight(contentRef.current.scrollHeight);
      setVisibleHeight(contentRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener("resize", updateScrollMetrics);
    return () => window.removeEventListener("resize", updateScrollMetrics);
  }, [updateScrollMetrics]);

  const handleScroll = () => {
    if (contentRef.current) {
      setScrollTop(contentRef.current.scrollTop);
    }
  };

  const handleScrollBarMove = (newScrollTop: number) => {
    if (contentRef.current) {
      contentRef.current.scrollTop = newScrollTop;
    }
  };

  return (
    <div className="scrollbar-container">
      <div ref={contentRef} className="scroll-content" onScroll={handleScroll}>
        {children}
      </div>
      <ScrollBar
        scrollHeight={scrollHeight}
        visibleHeight={visibleHeight}
        scrollTop={scrollTop}
        onScroll={handleScrollBarMove}
      />
    </div>
  );
};

export default ScrollBarHolder;
