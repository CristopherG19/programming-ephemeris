import { NextRequest, NextResponse } from 'next/server'
import { ephemerisGenerator } from '@/lib/ai-ephemeris-generator'

export async function POST(request: NextRequest) {
  try {
    const { action, date } = await request.json()

    let result

    switch (action) {
      case 'tomorrow':
        result = await ephemerisGenerator.generateTomorrowEphemeris()
        break
      case 'today':
        result = await ephemerisGenerator.getTodayEphemeris()
        break
      case 'specific':
        if (!date) {
          return NextResponse.json(
            { error: 'Fecha requerida para acción específica' },
            { status: 400 }
          )
        }
        const targetDate = new Date(date)
        result = await ephemerisGenerator.generateEphemerisForDate(targetDate)
        break
      default:
        return NextResponse.json(
          { error: 'Acción no válida. Use: tomorrow, today, o specific' },
          { status: 400 }
        )
    }

    if (!result) {
      return NextResponse.json(
        { error: 'No se pudo generar la efeméride' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Efeméride generada exitosamente'
    })

  } catch (error) {
    console.error('Error en API generate-ephemeris:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const result = await ephemerisGenerator.getTodayEphemeris()
    
    if (!result) {
      return NextResponse.json(
        { error: 'No se encontró efeméride para hoy' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error en API generate-ephemeris GET:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
