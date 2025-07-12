import type { PropsWithChildren } from 'react';

interface Props {
  className?: string;
}

const Table = (props: PropsWithChildren<Props>) => {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
};

export default Table;
