import { useCallback, useEffect, useRef, useState } from 'react';

type UseClockParams = {
  fromSeconds?: number;
  fromMinutes?: number;
  fromHours?: number;
  down?: boolean;
};

const useClock = ({
  fromSeconds = 0,
  fromMinutes = 0,
  fromHours = 0,
  down = false
}: UseClockParams): [
  string,
  string,
  string,
  () => void,
  () => void,
  (toSeconds?: number, toMinutes?: number, toHours?: number) => void,
  boolean
] => {
  const [secondCounter, setSecondCounter] = useState(fromSeconds);
  const [minuteCounter, setMinuteCounter] = useState(fromMinutes);
  const [hourCounter, setHourCounter] = useState(fromHours);
  const [isRunning, setIsRunning] = useState(false);

  const intervalId = useRef<any>();
  const start: () => void = () => {
    setIsRunning(true);
  };
  const pause: () => void = () => setIsRunning(false);
  const reset: (toSeconds?: number, toMinutes?: number, toHours?: number) => void = useCallback(
    (toSeconds?: number, toMinutes?: number, toHours?: number) => {
      clearInterval(intervalId.current);
      setSecondCounter(toSeconds ? toSeconds : fromSeconds);
      setMinuteCounter(toMinutes ? toMinutes : fromMinutes);
      setMinuteCounter(toHours ? toHours : fromHours);
    },
    [fromSeconds]
  );

  useEffect(() => {
    intervalId.current = setInterval(() => {
      isRunning && setSecondCounter(down ? secondCounter - 1 : secondCounter + 1);
    }, 1000);
    return () => clearInterval(intervalId.current);
  }, [isRunning, secondCounter, down, reset]);

  useEffect(() => {
    if (down ? secondCounter === 0 : secondCounter === 59) {
      setSecondCounter(down ? 59 : 0);
      setMinuteCounter(down ? minuteCounter - 1 : minuteCounter + 1);
    }
  }, [secondCounter]);

  useEffect(() => {
    if (down ? minuteCounter === 0 : minuteCounter === 59) {
      setMinuteCounter(down ? 59 : 0);
      setHourCounter(down ? hourCounter - 1 : hourCounter + 1);
    }
  }, [minuteCounter]);

  return [
    secondCounter < 10 ? '0' + secondCounter : '' + secondCounter,
    minuteCounter < 10 ? '0' + minuteCounter : '' + minuteCounter,
    hourCounter < 10 ? '0' + hourCounter : '' + hourCounter,
    start,
    pause,
    reset,
    isRunning
  ];
};

export default useClock;
