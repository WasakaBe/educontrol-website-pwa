const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Aquí puedes agregar eventos personalizados si es necesario
    },
    baseUrl: 'http://localhost:5173', // Ajusta el puerto si es necesario
    supportFile: false, // Desactiva el archivo de soporte si no necesitas configuraciones avanzadas
  },
})
