"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Eye, TrendingUp, Globe } from "lucide-react"

interface VisitorStats {
  totalVisitors: number
  todayVisitors: number
  uniqueVisitors: number
  pageViews: number
  topCountries: Array<{ country: string; visitors: number }>
  topPages: Array<{ page: string; views: number }>
}

export function VisitorAnalytics() {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    // Simular datos de analytics (en producción esto vendría de Vercel Analytics)
    const mockStats: VisitorStats = {
      totalVisitors: 1247,
      todayVisitors: 23,
      uniqueVisitors: 892,
      pageViews: 3456,
      topCountries: [
        { country: "México", visitors: 456 },
        { country: "Estados Unidos", visitors: 234 },
        { country: "España", visitors: 123 },
        { country: "Colombia", visitors: 89 },
        { country: "Argentina", visitors: 67 }
      ],
      topPages: [
        { page: "/", views: 2345 },
        { page: "/api/generate-ephemeris", views: 1111 }
      ]
    }

    // Simular carga
    setTimeout(() => {
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <Card className="bg-card border-border p-4 terminal-container">
        <div className="text-accent mb-2 font-mono text-sm">[ANALYTICS]</div>
        <div className="text-muted-foreground text-sm">
          Cargando estadísticas...
        </div>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card className="bg-card border-border p-4 terminal-container">
      <div className="flex items-center justify-between mb-2">
        <div className="text-accent font-mono text-sm">[ANALYTICS]</div>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
          size="sm"
          className="text-xs h-6 px-2"
        >
          {isExpanded ? "Ocultar" : "Ver más"}
        </Button>
      </div>
      
      <div className="text-muted-foreground text-sm space-y-1">
        <div className="flex items-center space-x-2">
          <Users className="w-3 h-3" />
          <span>Hoy: {stats.todayVisitors} visitantes</span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-3 h-3" />
          <span>Total: {stats.totalVisitors.toLocaleString()}</span>
        </div>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-3 h-3" />
              <span>Únicos: {stats.uniqueVisitors.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-3 h-3" />
              <span>Páginas: {stats.pageViews.toLocaleString()}</span>
            </div>
            
            <div className="mt-3">
              <div className="text-xs text-accent mb-1">Top países:</div>
              {stats.topCountries.slice(0, 3).map((country, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {country.country}: {country.visitors}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
