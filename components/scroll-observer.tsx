"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollObserverProps {
  children: React.ReactNode;
  className?: string;
  animation?: "reveal-up" | "reveal-left" | "reveal-right";
  delay?: number;
}

export default function ScrollObserver({
  children,
  className = "",
  animation = "reveal-up",
  delay = 0,
}: ScrollObserverProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target); // cleanup after reveal
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${animation} ${isVisible ? "revealed" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
