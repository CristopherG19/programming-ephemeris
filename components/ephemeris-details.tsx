"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

interface EphemerisDetailsProps {
  detailed_info?: string
  impact?: string
  sources?: string[]
  category?: string
}

export function EphemerisDetails({ 
  detailed_info, 
  impact, 
  sources, 
  category 
}: EphemerisDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!detailed_info && !impact && !sources) {
    return null
  }

  return (
    <div className="mt-4">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        size="sm"
        className="w-full bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="w-4 h-4 mr-2" />
            Ocultar detalles
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-2" />
            Leer más
          </>
        )}
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {detailed_info && (
            <Card className="bg-card border-border p-4">
              <div className="text-accent mb-2 font-mono text-sm">[DETALLES]</div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {detailed_info}
              </p>
            </Card>
          )}

          {impact && (
            <Card className="bg-card border-border p-4">
              <div className="text-accent mb-2 font-mono text-sm">[IMPACTO]</div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {impact}
              </p>
            </Card>
          )}

          {sources && sources.length > 0 && (
            <Card className="bg-card border-border p-4">
              <div className="text-accent mb-2 font-mono text-sm">[FUENTES]</div>
              <div className="space-y-2">
                {sources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 underline text-sm break-all"
                    >
                      {source}
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {category && (
            <Card className="bg-card border-border p-4">
              <div className="text-accent mb-2 font-mono text-sm">[CATEGORÍA]</div>
              <span className="inline-block bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-mono">
                {category}
              </span>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
