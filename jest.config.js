const config = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    //...presets.transform,
  },
  modulePathIgnorePatterns: ["/build/"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
};

module.exports = config;
