export interface Step {
  array: number[];
  candidate: number;
  probe: number | null;
  sortedTo: number;
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

export function* selectionSort(values: number[]): Generator<Step> {
  const array = [...values];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let candidate = i;
    yield { array: [...array], candidate, probe: null, sortedTo: i };

    for (let j = i + 1; j < n; j++) {
      yield { array: [...array], candidate, probe: j, sortedTo: i };

      if (array[j] < array[candidate]) {
        candidate = j;
        yield { array: [...array], candidate, probe: j, sortedTo: i };
      }
    }

    if (candidate !== i) {
      [array[i], array[candidate]] = [array[candidate], array[i]];
    }
    yield { array: [...array], candidate: i, probe: null, sortedTo: i + 1 };
  }

  yield { array: [...array], candidate: -1, probe: null, sortedTo: n };
}
