export * from './cards';
export * from './encryption';

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
