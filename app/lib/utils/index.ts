export * from './cards';
export * from './encryption';
export * from './server';

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
