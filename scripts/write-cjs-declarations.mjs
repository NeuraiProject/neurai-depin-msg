// CommonJS declarations for the `require` entry (dist/neurai-depin-msg.cjs).
//
// index.d.ts is written by hand, self-contained, and describes both bundles:
// the CommonJS one exports the same values as the ESM one. In a
// "type": "module" package that file is read as ESM, which a CommonJS consumer
// resolving with moduleResolution node16 cannot use (TS1471). The
// same declarations are written next to the bundle as
// dist/neurai-depin-msg.d.cts, which TypeScript reads as CommonJS; that also
// types the legacy deep import of dist/neurai-depin-msg.cjs.
import { copyFileSync } from 'node:fs';

copyFileSync(
  new URL('../index.d.ts', import.meta.url),
  new URL('../dist/neurai-depin-msg.d.cts', import.meta.url)
);
