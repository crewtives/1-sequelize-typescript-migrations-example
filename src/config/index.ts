import * as dotenv from 'dotenv';
dotenv.config();

import * as config from 'config';

// The relative path here resolves to `config/constraint.ts`
import { EnvironmentType, IConfigApp } from './config.constraint';

// Augment type definition for node-config.
// It helps TypeScript to learn about uor new method we're going to add to our prototype.

// @ts-ignore
declare module 'config' {
  interface IConfig {
    // This method accepts only first-level keys of our IConfigApp interface (e.g. 'cat').
    // TypeScript compiler is going to fail for anything else.
    getTyped: <T extends keyof IConfigApp>(key: T) => IConfigApp[T];
    environment: EnvironmentType;
  }
}

const prototype: config.IConfig = Object.getPrototypeOf(config);
// Yep. It's still the same `config.get`. The real trick here was with augmenting the type definition for `config`.
prototype.getTyped = config.get;
prototype.environment = process.env.NODE_ENV as EnvironmentType;

/**
 * Here we are exporting our server configuration
 * The configuration is chosen on startup of the server via `NODE_ENV` in the .env file
 * */

export const SERVER_CONFIG = config;
