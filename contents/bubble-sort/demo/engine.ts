export interface Step {
  array: number[];
  active: number[];
  sortedFrom: number;
}

export const shuffle = (size: number): number[] => {
  const array = Array.from({ length: size }, (_, i) => i + 1);

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const sleep = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

export function* bubbleSort(values: number[]): Generator<Step> {
  const array = [...values];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...array], active: [j, j + 1], sortedFrom: n - i };

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        yield { array: [...array], active: [j, j + 1], sortedFrom: n - i };
      }
    }
  }

  yield { array: [...array], active: [], sortedFrom: 0 };
}
