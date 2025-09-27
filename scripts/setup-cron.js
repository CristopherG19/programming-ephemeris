// Script para configurar el cron job diario
// Este script debe ejecutarse en el servidor donde esté desplegada la aplicación

const cron = require('node-cron')

// Función para generar efemérides diarias
async function generateDailyEphemeris() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cron/generate-daily-ephemeris`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Efemérides generadas exitosamente:', data.message)
    } else {
      console.error('❌ Error generando efemérides:', response.statusText)
    }
  } catch (error) {
    console.error('❌ Error en cron job:', error)
  }
}

// Configurar cron job para ejecutarse todos los días a las 00:01
// Esto asegura que siempre tengamos la efeméride del día siguiente
cron.schedule('1 0 * * *', () => {
  console.log('🕐 Ejecutando generación diaria de efemérides...')
  generateDailyEphemeris()
}, {
  timezone: "America/Mexico_City" // Ajustar según tu zona horaria
})

console.log('🚀 Cron job configurado para ejecutarse diariamente a las 00:01')

// Para Vercel, usar Vercel Cron Jobs
// Agregar en vercel.json:
/*
{
  "crons": [
    {
      "path": "/api/cron/generate-daily-ephemeris",
      "schedule": "1 0 * * *"
    }
  ]
}
*/
