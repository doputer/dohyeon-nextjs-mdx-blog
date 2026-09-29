export interface Step {
  array: number[];
  active: number[];
  sortedBefore: number;
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

export function* cocktailShakerSort(values: number[]): Generator<Step> {
  const array = [...values];
  const n = array.length;
  let left = 0;
  let right = n - 1;

  while (left < right) {
    for (let i = left; i < right; i++) {
      yield { array: [...array], active: [i, i + 1], sortedBefore: left, sortedFrom: right + 1 };

      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        yield { array: [...array], active: [i, i + 1], sortedBefore: left, sortedFrom: right + 1 };
      }
    }
    right--;

    for (let i = right; i > left; i--) {
      yield { array: [...array], active: [i - 1, i], sortedBefore: left, sortedFrom: right + 1 };

      if (array[i - 1] > array[i]) {
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        yield {
          array: [...array],
          active: [i - 1, i],
          sortedBefore: left,
          sortedFrom: right + 1,
        };
      }
    }
    left++;
  }

  yield { array: [...array], active: [], sortedBefore: n, sortedFrom: n };
}
