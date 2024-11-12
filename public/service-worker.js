self.addEventListener('push', function(event) {
  let data;
  try {
    data = event.data.json();
  } catch (error) {
    console.error("Error al convertir el payload a JSON:", error);
    return; // Salir si el JSON es inválido
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
