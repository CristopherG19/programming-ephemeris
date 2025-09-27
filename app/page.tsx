"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface EphemerisData {
  id: number
  day: number
  month: number
  year: number
  event: string
  display_date: string
  historical_day: number
  historical_month: number
  historical_year: number
  created_at: string
  updated_at: string
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState("")
  const [todayEphemeris, setTodayEphemeris] = useState<EphemerisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Actualizar tiempo cada segundo
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      setCurrentTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    // Cargar efeméride del día
    loadTodayEphemeris()

    return () => clearInterval(interval)
  }, [])

  const loadTodayEphemeris = async () => {
    try {
      setLoading(true)
      setError(null) // Limpiar errores previos
      
      const response = await fetch('/api/generate-ephemeris')
      
      if (!response.ok) {
        throw new Error('Error cargando efeméride')
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        setTodayEphemeris(data.data)
        setError(null) // Sin errores si se carga correctamente
      } else {
        // Si no hay efeméride en la base de datos, usar una por defecto
        setTodayEphemeris({
          id: 0,
          day: 27,
          month: 9,
          year: 1969,
          event: "Se envía el primer mensaje a través de ARPANET entre UCLA y Stanford, marcando el nacimiento de Internet.",
          display_date: "1969-09-27",
          historical_day: 27,
          historical_month: 9,
          historical_year: 1969,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        setError(null) // No es un error, es el modo offline
      }
    } catch (err) {
      console.error('Error cargando efeméride:', err)
      setError('Modo offline - Usando efeméride de respaldo')
      
      // Efeméride de respaldo
      setTodayEphemeris({
        id: 0,
        day: 27,
        month: 9,
        year: 1969,
        event: "Se envía el primer mensaje a través de ARPANET entre UCLA y Stanford, marcando el nacimiento de Internet.",
        display_date: "1969-09-27",
        historical_day: 27,
        historical_month: 9,
        historical_year: 1969,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }


  const getCategoryColor = (event: string) => {
    if (event.includes('Internet') || event.includes('ARPANET')) return 'INTERNET'
    if (event.includes('Apple') || event.includes('iPhone') || event.includes('Mac')) return 'EMPRESAS'
    if (event.includes('Google') || event.includes('buscador')) return 'WEB'
    if (event.includes('programación') || event.includes('código')) return 'LENGUAJES'
    if (event.includes('sistema') || event.includes('Unix')) return 'SISTEMAS'
    return 'HISTORIA'
  }

  const getMonthName = (month: number) => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    return months[month - 1]
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-green-400 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-mono mb-4">Inicializando sistema...</div>
            <div className="text-lg font-mono">Cargando efeméride del día...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-green-400 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-2xl font-mono mb-2">
            Inicializando sistema de hechos históricos...
          </div>
          <div className="text-lg font-mono text-gray-400">
            {currentTime} | Sistema de efemérides diarias
          </div>
        </div>

        {/* Efeméride del día */}
        {todayEphemeris && (
          <Card className="bg-black border-green-500 p-8 mb-8 terminal-container">
            <div className="text-center">
              <div className="text-green-400 text-lg font-mono mb-4">
                [{getCategoryColor(todayEphemeris.event)}] {todayEphemeris.historical_day} DE {getMonthName(todayEphemeris.historical_month).toUpperCase()}
              </div>
              <div className="text-6xl font-bold text-white mb-6">
                {todayEphemeris.historical_year}
              </div>
              <div className="text-xl text-gray-300 mb-6 leading-relaxed">
                {todayEphemeris.event}
              </div>
              <div className="text-sm text-gray-500 font-mono">
                {">"} Presiona F5 para actualizar o espera hasta mañana para la siguiente efeméride
              </div>
            </div>
          </Card>
        )}

        {/* Información del sistema */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
          <Card className="bg-card border-border p-4 terminal-container">
            <div className="text-accent mb-2 relative z-10">[SISTEMA]</div>
            <div className="text-muted-foreground relative z-10">
              Terminal v2.0
              <br />
              Uptime: {Math.floor(Date.now() / 1000 / 60 / 60 / 24)} días
            </div>
          </Card>

          <Card className="bg-card border-border p-4 terminal-container">
            <div className="text-accent mb-2 relative z-10">[DATOS]</div>
            <div className="text-muted-foreground relative z-10">
              Base: Supabase
              <br />
              IA: Generación automática
            </div>
          </Card>

          <Card className="bg-card border-border p-4 terminal-container">
            <div className="text-accent mb-2 relative z-10">[ESTADO]</div>
            <div className="text-primary relative z-10">
              {error ? '● OFFLINE' : '● ONLINE'}
              <br />
              {error || 'Sincronizado'}
            </div>
          </Card>
        </div>


        {/* Footer */}
        <div className="mt-8 text-center text-muted-foreground font-mono text-xs">
          <div className="mb-2">{">"} Desarrollado con ❤️ por <a href="https://github.com/CristopherG19" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">Cristopher Gutierrez</a></div>
          <div>Sistema de efemérides diarias • Generación automática con IA</div>
          <div className="mt-1">© 2024 Cristopher Gutierrez • <a href="mailto:cgch_1996@hotmail.com" className="text-green-400 hover:text-green-300 underline">cgch_1996@hotmail.com</a></div>
        </div>
      </div>
    </main>
  )
}
