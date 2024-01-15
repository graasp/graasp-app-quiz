import { useTransition } from '@react-spring/web';

import { animated } from 'react-spring';

const ANIMATION_TRANSITION_DURATION_MS = 350;
const ANIMATION_EXPAND_DURATION_MS = 500;
const DEFAULT_ELEMENT_HEIGHT = 45;

type DataElementType = { elementType: number };

export type TransitionData<T extends DataElementType> = {
  key: string;
  height: number;
  defaultHeight: number;
  y: number;
  data: T;
};

type Props<T extends DataElementType> = {
  isAnimating: boolean;
  elements: TransitionData<T>[];
  elementHeight?: number;
  renderElement: (item: TransitionData<T>) => JSX.Element;
};

export const ReorderAnimation = <T extends DataElementType>({
  isAnimating,
  elements,
  elementHeight,
  renderElement,
}: Props<T>) => {
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
        from: (item: TransitionData<T>, _: number) => ({
          height: item.defaultHeight,
          opacity: 0,
        }),
        enter: { opacity: 1 },
      };

  const transitions = useTransition(
    elements.map((e) => ({
      ...e,
      y: (transitionHeight += e.height) - e.height,
    })),
    {
      key: (item: TransitionData<T>) => item.key,
      ...transitionAnimation,
      config: { duration: ANIMATION_TRANSITION_DURATION_MS },
    }
  );

  return (
    <div
      style={{
        height: elements.length * (elementHeight ?? DEFAULT_ELEMENT_HEIGHT),
        transition: `height ${
          isAnimating ? ANIMATION_EXPAND_DURATION_MS : 0
        }ms`,
      }}
    >
      {transitions(
        (style, item, _t, index) =>
          item.key && (
            <animated.div style={{ zIndex: elements.length - index, ...style }}>
              {renderElement(item)}
            </animated.div>
          )
      )}
    </div>
  );
};

export default ReorderAnimation;
