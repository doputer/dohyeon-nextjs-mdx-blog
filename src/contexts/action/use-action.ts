import { use } from 'react';

import { ActionContext } from '@/contexts/action';

export const useAction = () => {
  const context = use(ActionContext);
  if (!context) throw new Error('ActionProvider가 없습니다.');

  return context;
};
