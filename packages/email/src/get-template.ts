import { emailTemplates } from './constants';
import { EmailType } from './types';

export const getTemplate = (type: EmailType) => {
  return emailTemplates[type];
};
