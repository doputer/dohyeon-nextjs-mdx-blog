import type { AnnotationHandler } from 'codehike/code';

import InlineFold from '@/components/typography/code/handlers/fold/inline-fold';

const fold: AnnotationHandler = {
  name: 'fold',
  Inline: InlineFold,
};

export default fold;
