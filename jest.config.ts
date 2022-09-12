import type { Config } from "@jest/types";
import { defaults as presets } from "ts-jest/presets";
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    //"^.+\\.tsx?$": "ts-jest",
    ...presets.transform,
  },
  modulePathIgnorePatterns: ["/build/", "/dist/"],
  //testMatch: ["**/__tests__/**/*.spec.ts", "**/__tests__/**/*.test.ts"],
  testRegex: "(/__tests__/.*|(\\.|/)(spec))\\.ts?$",
};
export default config;
