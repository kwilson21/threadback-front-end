import { useState, useEffect } from "react";

export default function useWindowLocation() {
  const isClient = typeof window === "object";

  function getWindowLocation() {
    return isClient ? window.location.href : undefined;
  }

  const [windowLocation, setWindowLocation] = useState(getWindowLocation);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    setWindowLocation(getWindowLocation());
  }, []);
  return windowLocation;
}
