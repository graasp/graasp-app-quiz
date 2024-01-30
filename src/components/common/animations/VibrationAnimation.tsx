import { useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

const RANGE_INCREMENT = 0.1;
const ROTATION_AMPLITUDE = 0.35;

export const createVibrationsRange = (
  inputIncrement: number,
  rotation: number
) => {
  const MAX_RANGE = 1;
  const MIN_RANGE = 0;
  const MAX_DIGITS = 3;

  if (inputIncrement < MIN_RANGE || inputIncrement > MAX_RANGE) {
    throw new Error(
      `The input increment ${inputIncrement} is not valid. It should be between [${MIN_RANGE}, ${MAX_RANGE}].`
    );
  }

  const range = [];
  const output = [];

  let isNegative = true;

  for (
    let i = inputIncrement;
    i + inputIncrement < MAX_RANGE;
    i += inputIncrement
  ) {
    range.push(parseFloat(i.toFixed(MAX_DIGITS)));
    const parsedRotation = parseFloat(rotation.toFixed(MAX_DIGITS));
    output.push(isNegative ? -parsedRotation : parsedRotation);
    isNegative = !isNegative;
  }

  return {
    range: [MIN_RANGE, ...range, MAX_RANGE],
    output: [MIN_RANGE, ...output, 0],
  };
};

type Props = {
  animate: boolean;
  children: JSX.Element | JSX.Element[];
  onAnimationEnd: () => void;
};

const VibrationAnimation = ({
  animate,
  children,
  onAnimationEnd,
}: Props): JSX.Element => {
  const [rotationStyle, rotationApi] = useSpring(() => ({
    rotate: 0,
    config: { duration: 500 },
    onRest: () => {
      rotationApi.set({ rotate: 0 });
      onAnimationEnd();
    },
  }));

  useEffect(() => {
    if (animate) {
      rotationApi.start({
        rotate: 1,
      });
    }
  }, [animate, rotationApi]);

  return (
    <animated.div
      style={{
        rotate: rotationStyle.rotate.to(
          createVibrationsRange(RANGE_INCREMENT, ROTATION_AMPLITUDE)
        ),
        width: '100%',
      }}
    >
      {children}
    </animated.div>
  );
};

export default VibrationAnimation;
