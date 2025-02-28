import React, { useRef, useState, useEffect } from "react";
import ScrollBar from "./ScrollBar"; 
import "./ScrollBarHolder.css";
interface ScrollBarHolderProps {
  children: React.ReactNode;
}

const ScrollBarHolder: React.FC<ScrollBarHolderProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0); //height of bar, should scale with page?
  const [visibleHeight, setVisibleHeight] = useState(0); //visible height of scrollbar
  const [scrollTop, setScrollTop] = useState(0); //is NOT the height of the scrollbar - is the HEIGHT OF THE SCROLLTHUMB itself!!!!

  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      setScrollHeight(content.scrollHeight);
      setVisibleHeight(content.clientHeight);
    }
  }, []);

  const handleScroll = () => { //update SB pos
    if (contentRef.current) {
      setScrollTop(contentRef.current.scrollTop);
    }
  };

  const handleScrollBarMove = (newScrollTop: number) => {
    if (contentRef.current) {
      contentRef.current.scrollTop = newScrollTop;
    }
  };

  return ( //see ScrollBar documentation for info on these flags - https://www.npmjs.com/package/react-scrollbars-custom
    <div className="relative w-full h-64 overflow-hidden"> 
      <div
        ref={contentRef}
        className="w-full h-full overflow-y-scroll scrollbar-hide"
        onScroll={handleScroll}
      >
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
