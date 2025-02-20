import { animate } from 'motion/react';
import React, { useEffect, useRef } from 'react'

export default function Counter({ value, duration = 1, decimals = 2 }) {
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: duration,
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = latest.toFixed(decimals);
        }
      },
    });
    return () => controls.stop();
  }, [value, duration, decimals]);

  return <span ref={ref} />;
};