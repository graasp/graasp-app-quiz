import { useTransition } from '@react-spring/web';

import { useState } from 'react';
import { animated } from 'react-spring';

const ANIMATION_DURATION_MS = 350;

type DataElementType = { elementType: number };

export type TransitionData<T extends DataElementType> = {
  key: string;
  height?: number;
  marginBottom: number;
  y?: number;
  data: T;
};

type Props<T extends DataElementType> = {
  isAnimating: boolean;
  elements: TransitionData<T>[];
  renderElement: (
    item: TransitionData<T>,
    onHeightChange: (key: string, height: number) => void
  ) => JSX.Element;
};

export const ReorderAnimation = <T extends DataElementType>({
  isAnimating,
  elements,
  renderElement,
}: Props<T>) => {
  const [totalHeight, setTotalHeight] = useState<number>(0);
  // Tracks the heights of each element to recompute totalHeight when heights changed.
  // That means, if a element's height changed, the map is updated and he totalHeight 
  // recomputed with all the heights, including the updated one.
  const elementHeights = new Map<string, number>();
  // this variable is used to set the next element to the good y
  let transitionHeight = 0;
  const transitionAnimation = isAnimating
    ? {
        from: { height: 0, opacity: 0 },
        leave: { height: 0, opacity: 0 },
        enter: ({ y, height }: { y: number; height: number }) => ({
          y,
          height,
          opacity: 1,
        }),
        update: ({ y, height }: { y: number; height: number }) => ({
          y,
          height,
        }),
      }
    : {
        from: (_item: TransitionData<T>, _: number) => ({
          opacity: 0,
        }),
        enter: { opacity: 1 },
      };

  const transitions = useTransition(
    elements.map((e) => {
      transitionHeight += e.marginBottom;
      return {
        ...e,
        y: transitionHeight - e.marginBottom,
      };
    }),
    {
      // the key must be unique and not change to keep the same component for the animation.
      key: (item: TransitionData<T>) => `${item.key}`,
      ...transitionAnimation,
      config: { duration: ANIMATION_DURATION_MS },
    }
  );

  const handleElementHeight = (key: string, height: number) => {
    elementHeights.set(key, height);
    const element = elements.find((e) => e.key === key);
    if (element) {
      element.height = height;
    }
    setTotalHeight(
      Array.from(elementHeights.entries()).reduce(
        (acc, [k, h]) =>
          acc + h + (elements.find((e) => e.key === k)?.marginBottom ?? 0),
        0
      )
    );
  };

  return (
    <div
      style={{
        height: totalHeight,
        transition: `height ${isAnimating ? ANIMATION_DURATION_MS : 0}ms`,
      }}
    >
      {transitions(
        (style, item, _t, index) =>
          item.key && (
            <animated.div
              style={{
                zIndex: elements.length - index,
                // Do not add style when not animated to be sure to reset
                // transform on existing div when changing question to another
                // multiple choice. This solves bad position problems.
                ...(isAnimating ? style : {}),
                opacity: style.opacity,
                height: item.height,
                marginBottom: isAnimating ? 0 : item.marginBottom,
              }}
            >
              {renderElement(item, handleElementHeight)}
            </animated.div>
          )
      )}
    </div>
  );
};

export default ReorderAnimation;
