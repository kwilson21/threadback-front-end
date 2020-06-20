import { useState, useEffect } from "react";

export default function useScrollPast(yOffset) {
  const isClient = typeof window === "object";

  const [scroll, setScrolling] = useState(false);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    const handleScroll = (e) => {
      if (window.pageYOffset > yOffset) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return scroll;
}
