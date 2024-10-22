const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Aquí puedes agregar eventos personalizados si es necesario
    },
    baseUrl: 'http://localhost:5173', // Ajusta el puerto si es necesario
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Define el patrón para encontrar tus pruebas
    supportFile: false, // Desactiva el archivo de soporte si no necesitas configuraciones avanzadas
  },
})
