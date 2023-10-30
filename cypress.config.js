const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://api.github.com",
    env: {
      token: 'Bearer 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',
      ownerGit: 'rangelbombonatto'
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
