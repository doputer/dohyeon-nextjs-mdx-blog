import type { ComponentProps } from 'react';

const Table = (props: ComponentProps<'table'>) => (
  <div className="overflow-x-auto">
    <table {...props} />
  </div>
);

export default Table;
