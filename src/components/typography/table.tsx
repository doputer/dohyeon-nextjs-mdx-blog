import type { ComponentProps } from 'react';

const Table = (props: ComponentProps<'table'>) => (
  <div role="region" aria-label="표" tabIndex={0} className="overflow-x-auto">
    <table {...props} />
  </div>
);

export default Table;
