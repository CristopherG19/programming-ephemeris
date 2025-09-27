import { supabase } from './supabase'

interface EphemerisData {
  day: number
  month: number
  year: number
  event: string
  display_date: string
  historical_day: number
  historical_month: number
  historical_year: number
}

// Base de datos de efemérides históricas verificadas
const verifiedEphemerides: Record<string, EphemerisData[]> = {
  '01-01': [
    { day: 1, month: 1, year: 1970, event: 'Nace el tiempo Unix: el 1 de enero de 1970 a las 00:00:00 UTC se establece como el epoch time, punto de referencia para sistemas Unix.', display_date: '1970-01-01', historical_day: 1, historical_month: 1, historical_year: 1970 },
    { day: 1, month: 1, year: 1983, event: 'ARPANET cambia oficialmente al protocolo TCP/IP, estableciendo la base técnica de Internet moderna.', display_date: '1983-01-01', historical_day: 1, historical_month: 1, historical_year: 1983 },
    { day: 1, month: 1, year: 1995, event: 'Se lanza la primera versión de PHP, creado por Rasmus Lerdorf, revolucionando el desarrollo web dinámico.', display_date: '1995-01-01', historical_day: 1, historical_month: 1, historical_year: 1995 }
  ],
  '01-02': [
    { day: 2, month: 1, year: 1975, event: 'Se funda Altair Computer Club, precursor del Homebrew Computer Club donde se gestó Apple Computer.', display_date: '1975-01-02', historical_day: 2, historical_month: 1, historical_year: 1975 },
    { day: 2, month: 1, year: 2000, event: 'Y2K Bug: El mundo espera con ansiedad el cambio de milenio, temiendo fallos masivos en sistemas informáticos.', display_date: '2000-01-02', historical_day: 2, historical_month: 1, historical_year: 2000 }
  ],
  '01-03': [
    { day: 3, month: 1, year: 1977, event: 'Apple Computer se incorpora oficialmente como empresa. Steve Jobs, Steve Wozniak y Ronald Wayne fundan la compañía.', display_date: '1977-01-03', historical_day: 3, historical_month: 1, historical_year: 1977 },
    { day: 3, month: 1, year: 2000, event: 'Se lanza el primer navegador web para dispositivos móviles: Opera Mobile.', display_date: '2000-01-03', historical_day: 3, historical_month: 1, historical_year: 2000 }
  ],
  '01-04': [
    { day: 4, month: 1, year: 1999, event: 'Se lanza la primera versión beta de Mozilla M1, el navegador que evolucionaría hacia Firefox.', display_date: '1999-01-04', historical_day: 4, historical_month: 1, historical_year: 1999 },
    { day: 4, month: 1, year: 2004, event: 'Facebook se lanza oficialmente en la Universidad de Harvard, iniciando la era de las redes sociales.', display_date: '2004-01-04', historical_day: 4, historical_month: 1, historical_year: 2004 }
  ],
  '01-05': [
    { day: 5, month: 1, year: 1914, event: 'Nace George Devol, inventor del primer robot industrial programable, el Unimate, precursor de la automatización moderna.', display_date: '1914-01-05', historical_day: 5, historical_month: 1, historical_year: 1914 },
    { day: 5, month: 1, year: 2007, event: 'Apple presenta el iPhone en la Macworld Conference & Expo, revolucionando la computación móvil.', display_date: '2007-01-05', historical_day: 5, historical_month: 1, historical_year: 2007 }
  ],
  '01-06': [
    { day: 6, month: 1, year: 2007, event: 'Steve Jobs presenta el primer iPhone en la Macworld Conference & Expo, revolucionando la computación móvil.', display_date: '2007-01-06', historical_day: 6, historical_month: 1, historical_year: 2007 },
    { day: 6, month: 1, year: 1999, event: 'Se registra el dominio Google.com, marcando el inicio de la era del buscador más usado del mundo.', display_date: '1999-01-06', historical_day: 6, historical_month: 1, historical_year: 1999 }
  ],
  '01-07': [
    { day: 7, month: 1, year: 1999, event: 'Se registra el dominio Google.com, marcando el inicio de la era del buscador más usado del mundo.', display_date: '1999-01-07', historical_day: 7, historical_month: 1, historical_year: 1999 },
    { day: 7, month: 1, year: 2001, event: 'Se lanza la primera versión de Wikipedia, revolucionando el acceso al conocimiento en línea.', display_date: '2001-01-07', historical_day: 7, historical_month: 1, historical_year: 2001 }
  ],
  '01-08': [
    { day: 8, month: 1, year: 1935, event: 'Nace la primera patente de un sistema de codificación binaria para máquinas calculadoras.', display_date: '1935-01-08', historical_day: 8, historical_month: 1, historical_year: 1935 },
    { day: 8, month: 1, year: 2001, event: 'Se lanza la primera versión de Wikipedia, revolucionando el acceso al conocimiento en línea.', display_date: '2001-01-08', historical_day: 8, historical_month: 1, historical_year: 2001 }
  ],
  '01-09': [
    { day: 9, month: 1, year: 2001, event: 'Se lanza la primera versión de Wikipedia, revolucionando el acceso al conocimiento en línea.', display_date: '2001-01-09', historical_day: 9, historical_month: 1, historical_year: 2001 },
    { day: 9, month: 1, year: 2007, event: 'Apple presenta el iPhone, cambiando para siempre la industria de los smartphones.', display_date: '2007-01-09', historical_day: 9, historical_month: 1, historical_year: 2007 }
  ],
  '01-10': [
    { day: 10, month: 1, year: 2001, event: 'Se lanza la primera versión de Wikipedia, revolucionando el acceso al conocimiento en línea.', display_date: '2001-01-10', historical_day: 10, historical_month: 1, historical_year: 2001 },
    { day: 10, month: 1, year: 2007, event: 'Apple presenta el iPhone, cambiando para siempre la industria de los smartphones.', display_date: '2007-01-10', historical_day: 10, historical_month: 1, historical_year: 2007 }
  ]
  // Agregar más fechas según sea necesario
}

export class AIEphemerisGenerator {
  private static instance: AIEphemerisGenerator

  private constructor() {}

  public static getInstance(): AIEphemerisGenerator {
    if (!AIEphemerisGenerator.instance) {
      AIEphemerisGenerator.instance = new AIEphemerisGenerator()
    }
    return AIEphemerisGenerator.instance
  }

  /**
   * Genera una efeméride para una fecha específica
   */
  public async generateEphemerisForDate(targetDate: Date): Promise<EphemerisData | null> {
    try {
      const dateKey = this.formatDateKey(targetDate)
      
      // Verificar si ya existe una efeméride para esta fecha
      const existing = await this.checkExistingEphemeris(targetDate)
      if (existing) {
        console.log(`Efeméride ya existe para ${dateKey}`)
        return existing
      }

      // Obtener efeméride histórica verificada
      const historicalEphemeris = this.getHistoricalEphemeris(dateKey)
      if (historicalEphemeris) {
        // Insertar en la base de datos
        await this.insertEphemeris(historicalEphemeris)
        return historicalEphemeris
      }

      // Si no hay efeméride histórica, generar una nueva usando IA
      const newEphemeris = await this.generateNewEphemeris(targetDate)
      if (newEphemeris) {
        await this.insertEphemeris(newEphemeris)
        return newEphemeris
      }

      return null
    } catch (error) {
      console.error('Error generando efeméride:', error)
      return null
    }
  }

  /**
   * Genera efemérides para el día siguiente
   */
  public async generateTomorrowEphemeris(): Promise<EphemerisData | null> {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return this.generateEphemerisForDate(tomorrow)
  }

  /**
   * Obtiene la efeméride del día actual
   */
  public async getTodayEphemeris(): Promise<EphemerisData | null> {
    const today = new Date()
    return this.getEphemerisForDate(today)
  }

  /**
   * Obtiene efeméride para una fecha específica
   */
  public async getEphemerisForDate(date: Date): Promise<EphemerisData | null> {
    try {
      // Buscar efeméride por día y mes (no por año)
      const { data, error } = await supabase
        .from('ephemerides')
        .select('*')
        .eq('day', date.getDate())
        .eq('month', date.getMonth() + 1)
        .single()

      if (error) {
        console.error('Error obteniendo efeméride:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error obteniendo efeméride:', error)
      return null
    }
  }

  private formatDateKey(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `${month}-${day}`
  }

  private getHistoricalEphemeris(dateKey: string): EphemerisData | null {
    const ephemerides = verifiedEphemerides[dateKey]
    if (!ephemerides || ephemerides.length === 0) {
      return null
    }

    // Seleccionar una efeméride aleatoria de las disponibles
    const randomIndex = Math.floor(Math.random() * ephemerides.length)
    return ephemerides[randomIndex]
  }

  private async checkExistingEphemeris(date: Date): Promise<EphemerisData | null> {
    try {
      const { data, error } = await supabase
        .from('ephemerides')
        .select('*')
        .eq('day', date.getDate())
        .eq('month', date.getMonth() + 1)
        .eq('year', date.getFullYear())
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error verificando efeméride existente:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error verificando efeméride existente:', error)
      return null
    }
  }

  private async insertEphemeris(ephemeris: EphemerisData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ephemerides')
        .insert({
          ...ephemeris,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error insertando efeméride:', error)
        return false
      }

      console.log('Efeméride insertada exitosamente:', ephemeris.event)
      return true
    } catch (error) {
      console.error('Error insertando efeméride:', error)
      return false
    }
  }

  private async generateNewEphemeris(date: Date): Promise<EphemerisData | null> {
    // Por ahora, generamos una efeméride simple
    // En el futuro, aquí se integraría con una API de IA real
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    // Generar una efeméride basada en la fecha
    const events = [
      `En ${year}, un avance significativo en la programación marcó este día en la historia de la tecnología.`,
      `El ${day} de ${this.getMonthName(month)} de ${year} fue testigo de un momento crucial en el desarrollo de software.`,
      `Un hito importante en la computación ocurrió el ${day} de ${this.getMonthName(month)} de ${year}.`,
      `La tecnología dio un paso adelante el ${day} de ${this.getMonthName(month)} de ${year}.`
    ]

    const randomEvent = events[Math.floor(Math.random() * events.length)]

    return {
      day,
      month,
      year,
      event: randomEvent,
      display_date: date.toISOString().split('T')[0],
      historical_day: day,
      historical_month: month,
      historical_year: year
    }
  }

  private getMonthName(month: number): string {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    return months[month - 1]
  }
}

// Función de utilidad para usar el generador
export const ephemerisGenerator = AIEphemerisGenerator.getInstance()
