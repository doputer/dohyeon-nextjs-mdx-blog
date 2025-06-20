import type { AnnotationHandler } from 'codehike/code';

import Collapse from '@/components/Typography/Code/handlers/Collapse/Collapse';

const collapse: AnnotationHandler = {
  name: 'collapse',
  Block: Collapse,
};

export default collapse;
