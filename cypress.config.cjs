// cypress.config.cjs

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Puedes agregar eventos aquí si es necesario
    },
    baseUrl: 'http://localhost:50013/api/', // Ajusta la URL a la de tu aplicación
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false, // Desactiva el archivo de soporte
  },
});
