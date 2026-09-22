import { type ChangeEvent, useEffect, useRef, useState } from 'react';

const STEPS = ['', 'ㄱ', '거', '검', '검ㅅ', '검새', '검색'];

const KEY_DELAY = 170;

const KEY_JITTER = 120;

const SYLLABLE_DELAY = 90;

const START_DELAY = 900;

const HOLD_DELAY = 2600;

const IDLE_DELAY = 3000;

const startsSyllable = (step: number) => STEPS[step].length < STEPS[step + 1].length;

const toDelay = (step: number) => {
  if (step === 0) return START_DELAY;
  if (step === STEPS.length - 1) return HOLD_DELAY;

  return KEY_DELAY + Math.random() * KEY_JITTER + (startsSyllable(step) ? SYLLABLE_DELAY : 0);
};

const useTyping = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState<string | null>(null);

  const autoplay = typed === null;

  useEffect(() => {
    if (!autoplay) return;

    if (ref.current) ref.current.value = STEPS[step];

    const timer = setTimeout(
      () => setStep((previous) => (previous + 1) % STEPS.length),
      toDelay(step)
    );

    return () => clearTimeout(timer);
  }, [autoplay, step]);

  useEffect(() => {
    if (typed !== '') return;

    const timer = setTimeout(() => {
      setStep(0);
      setTyped(null);
    }, IDLE_DELAY);

    return () => clearTimeout(timer);
  }, [typed]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => setTyped(event.target.value);

  return { ref, query: typed ?? STEPS[step], onChange };
};

export default useTyping;
