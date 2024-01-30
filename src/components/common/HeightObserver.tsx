import { useEffect, useRef } from 'react';

type Props = {
  children: JSX.Element;
  onHeightChange: (newHeight: number) => void;
};

const HeightObserver = ({ children, onHeightChange }: Props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { clientHeight } = entry.target;
        onHeightChange && onHeightChange(clientHeight);
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onHeightChange]);

  return <div ref={containerRef}>{children}</div>;
};

export default HeightObserver;
