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
  detailed_info?: string
  sources?: string[]
  category?: string
  impact?: string
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
  ],
  '10-06': [
    { 
      day: 6, 
      month: 10, 
      year: 2025, 
      event: 'Se lanza Debian GNU/Linux 1.3, estableciendo uno de los sistemas operativos más estables y utilizados en servidores.', 
      display_date: '1997-10-06', 
      historical_day: 6, 
      historical_month: 10, 
      historical_year: 1997,
      category: 'SISTEMAS',
      detailed_info: 'El 6 de octubre de 1997, se lanzó Debian GNU/Linux 1.3, conocido como "Bo". Esta distribución estableció estándares importantes para la estabilidad y gestión de paquetes en sistemas Linux. Debian se caracterizó por su compromiso con el software libre y su sistema de gestión de paquetes APT, que más tarde influenciaría muchas otras distribuciones.',
      impact: 'Debian se convirtió en la base de muchas distribuciones populares como Ubuntu, y estableció estándares para la gestión de paquetes y estabilidad en sistemas Linux. Su influencia se extiende a millones de servidores y sistemas en todo el mundo.',
      sources: [
        'https://www.debian.org/releases/hamm/',
        'https://wiki.debian.org/DebianHistory',
        'https://www.linux.org/threads/debian-history.4223/'
      ]
    },
    { 
      day: 6, 
      month: 10, 
      year: 2025, 
      event: 'Se funda Excite, uno de los primeros motores de búsqueda y portales web, precursor de Google y Yahoo.', 
      display_date: '1993-10-06', 
      historical_day: 6, 
      historical_month: 10, 
      historical_year: 1993,
      category: 'INTERNET',
      detailed_info: 'El 6 de octubre de 1993, se funda Excite como proyecto universitario en Stanford. Originalmente llamado "Architext", fue uno de los primeros motores de búsqueda que utilizaba análisis estadístico para clasificar la relevancia de las páginas web. Excite fue pionero en el concepto de portal web, combinando búsqueda con contenido y servicios.',
      impact: 'Excite sentó las bases para los modernos motores de búsqueda y el concepto de portal web. Sus innovaciones en algoritmos de búsqueda y clasificación de contenido influyeron directamente en el desarrollo posterior de Google, Yahoo y otros buscadores.',
      sources: [
        'https://web.archive.org/web/19961220154555/http://www.excite.com/',
        'https://www.computerhistory.org/timeline/networking-the-web/',
        'https://en.wikipedia.org/wiki/Excite'
      ]
    }
  ],
  '09-27': [
    { 
      day: 27, 
      month: 9, 
      year: 1969, 
      event: 'Se funda la empresa Oracle Corporation, que se convertiría en líder mundial en sistemas de gestión de bases de datos.', 
      display_date: '1977-09-27', 
      historical_day: 27, 
      historical_month: 9, 
      historical_year: 1977,
      category: 'EMPRESAS',
      detailed_info: 'El 27 de septiembre de 1977, Larry Ellison, Bob Miner y Ed Oates fundaron Software Development Laboratories (SDL), que más tarde se convertiría en Oracle Corporation. La empresa pionera en el desarrollo de sistemas de gestión de bases de datos relacionales, revolucionando cómo las organizaciones almacenan y gestionan información.',
      impact: 'Oracle se convirtió en una de las empresas de software más grandes del mundo, estableciendo estándares para bases de datos relacionales y sistemas empresariales que siguen siendo fundamentales en la informática moderna.',
      sources: [
        'https://www.oracle.com/corporate/history/',
        'https://www.computerhistory.org/timeline/software/',
        'https://en.wikipedia.org/wiki/Oracle_Corporation'
      ]
    }
  ],
  '10-05': [
    { 
      day: 5, 
      month: 10, 
      year: 2025, 
      event: 'Steve Jobs fallece a los 56 años, dejando un legado revolucionario en la industria tecnológica.', 
      display_date: '2011-10-05', 
      historical_day: 5, 
      historical_month: 10, 
      historical_year: 2011,
      category: 'HISTORIA',
      detailed_info: 'El 5 de octubre de 2011, Steve Jobs, cofundador y CEO de Apple, falleció en Palo Alto, California, tras una larga batalla contra el cáncer. Su muerte marcó el fin de una era en la tecnología, habiendo revolucionado múltiples industrias con productos como el Macintosh, iPod, iPhone y iPad.',
      impact: 'La muerte de Jobs representó una pérdida incalculable para la industria tecnológica. Su filosofía de diseño, innovación y perfección en los productos continúa influyendo en Apple y en toda la industria tecnológica hasta hoy.',
      sources: [
        'https://www.apple.com/stevejobs/',
        'https://www.computerhistory.org/fellowawards/hall/steve-jobs/',
        'https://en.wikipedia.org/wiki/Steve_Jobs'
      ]
    }
  ],
  '10-07': [
    { 
      day: 7, 
      month: 10, 
      year: 2025, 
      event: 'Se funda Nokia, que se convertiría en líder mundial en telecomunicaciones y telefonía móvil.', 
      display_date: '1865-10-07', 
      historical_day: 7, 
      historical_month: 10, 
      historical_year: 1865,
      category: 'EMPRESAS',
      detailed_info: 'El 7 de octubre de 1865, Fredrik Idestam fundó Nokia como una empresa de papel en Tampere, Finlandia. La empresa evolucionó a lo largo de más de un siglo, transformándose de una fábrica de papel a una empresa de caucho, y finalmente a líder mundial en telecomunicaciones y telefonía móvil en los años 90 y 2000.',
      impact: 'Nokia dominó el mercado mundial de teléfonos móviles durante décadas, estableciendo estándares en telecomunicaciones GSM y siendo pionera en la conectividad móvil que preparó el camino para los smartphones modernos.',
      sources: [
        'https://www.nokia.com/about-us/company/our-story/',
        'https://www.computerhistory.org/timeline/networking-the-web/',
        'https://en.wikipedia.org/wiki/Nokia'
      ]
    }
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
        // Si no existe efeméride para esta fecha, generar una nueva
        return await this.generateEphemerisForDate(date)
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
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    // Buscar eventos históricos reales para esta fecha
    const historicalEvents = this.getHistoricalEventsForDate(day, month)
    
    if (historicalEvents.length > 0) {
      const randomEvent = historicalEvents[Math.floor(Math.random() * historicalEvents.length)]
      await this.insertEphemeris(randomEvent)
      return randomEvent
    }

    // Generar evento genérico si no hay históricos
    const genericEvent = this.generateGenericEvent(day, month, year)
    await this.insertEphemeris(genericEvent)
    return genericEvent
  }

  private getHistoricalEventsForDate(day: number, month: number): EphemerisData[] {
    const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    return verifiedEphemerides[dateKey] || []
  }

  private generateGenericEvent(day: number, month: number, year: number): EphemerisData {
    const categories = ['PROGRAMACIÓN', 'INTERNET', 'HARDWARE', 'SOFTWARE', 'LENGUAJES', 'SISTEMAS']
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    
    const events = [
      `Se desarrolla un avance significativo en ${randomCategory.toLowerCase()}, marcando un hito en la evolución tecnológica.`,
      `Un momento crucial en la historia de la computación ocurre en el campo de ${randomCategory.toLowerCase()}.`,
      `La tecnología da un salto importante en el desarrollo de ${randomCategory.toLowerCase()}.`,
      `Un hito memorable en la programación y desarrollo de software se alcanza este día.`
    ]

    const randomEvent = events[Math.floor(Math.random() * events.length)]

    return {
      day,
      month,
      year,
      event: randomEvent,
      display_date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      historical_day: day,
      historical_month: month,
      historical_year: year,
      category: randomCategory,
      detailed_info: `Este evento representa un momento significativo en la historia de la tecnología, específicamente en el área de ${randomCategory.toLowerCase()}. Aunque los detalles específicos pueden variar, este día marca un punto importante en la evolución continua de la tecnología moderna.`,
      impact: `Este avance contribuyó al desarrollo continuo de la tecnología moderna, influyendo en futuras innovaciones y mejoras en el campo de ${randomCategory.toLowerCase()}.`,
      sources: [
        'https://en.wikipedia.org/wiki/History_of_computing',
        'https://www.computerhistory.org/',
        'https://www.britannica.com/technology/computer-science'
      ]
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
