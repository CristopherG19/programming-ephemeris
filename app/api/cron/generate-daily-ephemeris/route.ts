import { NextRequest, NextResponse } from 'next/server'
import { ephemerisGenerator } from '@/lib/ai-ephemeris-generator'

export async function GET(request: NextRequest) {
  try {
    // Verificar que la request viene de un cron job válido
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'default-secret'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    console.log('Iniciando generación diaria de efemérides...')

    // Generar efeméride para mañana
    const tomorrowEphemeris = await ephemerisGenerator.generateTomorrowEphemeris()
    
    if (!tomorrowEphemeris) {
      return NextResponse.json(
        { error: 'No se pudo generar la efeméride de mañana' },
        { status: 500 }
      )
    }

    console.log('Efeméride de mañana generada:', tomorrowEphemeris.event)

    // También verificar que tenemos la efeméride de hoy
    const todayEphemeris = await ephemerisGenerator.getTodayEphemeris()
    
    if (!todayEphemeris) {
      console.log('Generando efeméride para hoy...')
      const generatedToday = await ephemerisGenerator.generateEphemerisForDate(new Date())
      if (generatedToday) {
        console.log('Efeméride de hoy generada:', generatedToday.event)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Efemérides generadas exitosamente',
      data: {
        tomorrow: tomorrowEphemeris,
        today: todayEphemeris
      }
    })

  } catch (error) {
    console.error('Error en cron job de efemérides:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// También permitir POST para testing
export async function POST(request: NextRequest) {
  return GET(request)
}
