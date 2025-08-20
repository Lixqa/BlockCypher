export { createBlockCypherClient } from './client';
export * from './typings/types';

if (!process.env.DEBUG) console.debug = () => {};
