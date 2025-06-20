import type { AnnotationHandler } from 'codehike/code';

import Collapse from '@/components/typography/code/handlers/collapse/collapse';

const collapse: AnnotationHandler = {
  name: 'collapse',
  Block: Collapse,
};

export default collapse;
