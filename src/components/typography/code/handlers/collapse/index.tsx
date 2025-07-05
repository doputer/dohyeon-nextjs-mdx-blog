import Collapse from '@/components/typography/code/handlers/collapse/collapse';

import type { AnnotationHandler } from 'codehike/code';

const collapse: AnnotationHandler = {
  name: 'collapse',
  Block: Collapse,
};

export default collapse;
