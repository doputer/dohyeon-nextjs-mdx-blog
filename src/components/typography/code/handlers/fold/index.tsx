import InlineFold from '@/components/typography/code/handlers/fold/inline-fold';

import type { AnnotationHandler } from 'codehike/code';

const fold: AnnotationHandler = {
  name: 'fold',
  Inline: InlineFold,
};

export default fold;
