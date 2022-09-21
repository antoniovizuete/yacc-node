const preset = "atom";

module.exports = {
  branches: [
    "main",
    {
      name: "beta",
      prerelease: true,
    },
  ],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset,
        releaseRules: [
          { emoji: ":tada:", release: "major" },
          { emoji: ":boom:", release: "major" },
          { emoji: ":sparkles:", release: "minor" },
          { emoji: ":bug:", release: "patch" },
          { emoji: ":ambulance:", release: "patch" },
          { emoji: ":art:", release: "patch" },
          { emoji: ":recycle:", release: "patch" },
          { emoji: ":fire:", release: "patch" },
          { emoji: ":construction_worker:", release: "patch" },
          { emoji: ":rocket:", release: "patch" },
          { emoji: ":arrow_up:", release: "patch" },
          { emoji: ":wheel_of_dharma:", release: "patch" },
          { emoji: ":zap:", release: "patch" },
        ],
      },
    ],
    ["@semantic-release/npm", { npmPublish: true }],
    ["@semantic-release/release-notes-generator", { preset }],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    ["@semantic-release/github"],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: ":bookmark: Release ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
