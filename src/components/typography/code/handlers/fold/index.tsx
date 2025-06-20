import type { AnnotationHandler } from 'codehike/code';

import InlineFold from '@/components/Typography/Code/handlers/Fold/InlineFold';

const fold: AnnotationHandler = {
  name: 'fold',
  Inline: InlineFold,
};

export default fold;
