"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function SupabaseTest() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Probando conexión...')
    
    try {
      // Probar conexión básica
      const { data, error } = await supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1)
      
      if (error) {
        setStatus(`❌ Error de conexión: ${error.message}`)
      } else {
        setStatus('✅ Conexión exitosa con Supabase!')
      }
    } catch (err) {
      setStatus(`❌ Error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Prueba de Conexión Supabase</h3>
      <Button 
        onClick={testConnection} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Probando...' : 'Probar Conexión'}
      </Button>
      {status && (
        <div className="text-sm font-mono bg-muted p-3 rounded">
          {status}
        </div>
      )}
    </Card>
  )
}
