import '@testing-library/jest-dom';
// Polyfill TextEncoder/TextDecoder in Jest environment (Node/jsdom)
// Some Node/Jest environments don't provide these globally.
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

// @ts-ignore: attach polyfills to global
if (typeof (global as any).TextEncoder === 'undefined') {
  // @ts-ignore
  (global as any).TextEncoder = NodeTextEncoder;
}

// @ts-ignore: attach polyfills to global
if (typeof (global as any).TextDecoder === 'undefined') {
  // @ts-ignore
  (global as any).TextDecoder = NodeTextDecoder as any;
}
