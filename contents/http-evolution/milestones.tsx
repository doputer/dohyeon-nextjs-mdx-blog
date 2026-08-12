import { cn } from '@/utils/cn';

const MILESTONES = [
  { year: '1991', version: 'HTTP/0.9', note: '한 줄 요청' },
  { year: '1996', version: 'HTTP/1.0', note: '헤더·상태 코드' },
  { year: '1997', version: 'HTTP/1.1', note: 'keep-alive' },
  { year: '2015', version: 'HTTP/2', note: '멀티플렉싱' },
  { year: '2022', version: 'HTTP/3', note: 'QUIC' },
];

const ROW_SIZE = 3;

const Milestones = () => (
  <section className="my-8 rounded border border-line bg-surface px-4 py-6">
    <ol className="grid grid-cols-6 gap-y-7 sm:grid-cols-5">
      {MILESTONES.map((milestone, index) => {
        const rowStart = index % ROW_SIZE === 0;
        const rowEnd = index % ROW_SIZE === ROW_SIZE - 1;

        return (
          <li
            key={milestone.version}
            className={cn(
              'flex flex-col items-center text-center sm:col-span-1',
              index < ROW_SIZE ? 'col-span-2' : 'col-span-3'
            )}
          >
            <span className="font-mono text-xs text-soft">{milestone.year}</span>

            <div className="relative my-2.5 flex h-3 w-full items-center justify-center">
              <span
                className={cn(
                  'absolute top-1/2 left-0 h-px bg-line',
                  rowStart && 'max-sm:hidden',
                  index === 0 && 'hidden'
                )}
                style={{ right: '50%' }}
              />
              <span
                className={cn(
                  'absolute top-1/2 right-0 h-px bg-line',
                  rowEnd && 'max-sm:hidden',
                  index === MILESTONES.length - 1 && 'hidden'
                )}
                style={{ left: '50%' }}
              />
              <span className="relative z-10 h-3 w-3 rounded-full border-2 border-background bg-main" />
            </div>

            <span className="font-mono text-sm font-medium text-main">{milestone.version}</span>
            <span className="mt-1 text-xs text-muted">{milestone.note}</span>
          </li>
        );
      })}
    </ol>
  </section>
);

export default Milestones;
