const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Puedes agregar más eventos aquí si es necesario
    },
    baseUrl: 'http://localhost:50013/api/', // Ajusta la URL a la de tu aplicación
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
