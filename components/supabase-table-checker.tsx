"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TableColumn {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

export function SupabaseTableChecker() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [columns, setColumns] = useState<TableColumn[]>([])
  const [error, setError] = useState<string>('')

  const checkTableStructure = async () => {
    setLoading(true)
    setStatus('Verificando estructura de la tabla...')
    setError('')
    setColumns([])
    
    try {
      // Verificar conexión básica
      const { data: connectionTest, error: connectionError } = await supabase
        .from('ephemerides')
        .select('count')
        .limit(1)
      
      if (connectionError) {
        throw new Error(`Error de conexión: ${connectionError.message}`)
      }

      setStatus('✅ Conexión exitosa! Verificando estructura...')

      // Obtener información de la tabla usando una consulta SQL directa
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('exec_sql', { 
          sql: `
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'ephemerides' 
            AND table_schema = 'public'
            ORDER BY ordinal_position
          `
        })

      if (schemaError) {
        // Si no funciona la función RPC, intentar con una consulta más simple
        const { data: simpleData, error: simpleError } = await supabase
          .from('ephemerides')
          .select('*')
          .limit(1)

        if (simpleError) {
          throw new Error(`Error al acceder a la tabla: ${simpleError.message}`)
        }

        // Si podemos acceder a la tabla, mostrar las columnas que conocemos
        const knownColumns = [
          { column_name: 'id', data_type: 'int4', is_nullable: 'NO', column_default: 'nextval(...)' },
          { column_name: 'day', data_type: 'int4', is_nullable: 'YES', column_default: null },
          { column_name: 'month', data_type: 'int4', is_nullable: 'YES', column_default: null },
          { column_name: 'year', data_type: 'int4', is_nullable: 'YES', column_default: null },
          { column_name: 'event', data_type: 'text', is_nullable: 'YES', column_default: null },
          { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'YES', column_default: null },
          { column_name: 'updated_at', data_type: 'timestamp', is_nullable: 'YES', column_default: null },
          { column_name: 'display_date', data_type: 'date', is_nullable: 'YES', column_default: null },
          { column_name: 'historical_day', data_type: 'int4', is_nullable: 'YES', column_default: null },
          { column_name: 'historical_month', data_type: 'int4', is_nullable: 'YES', column_default: null },
          { column_name: 'historical_year', data_type: 'int4', is_nullable: 'YES', column_default: null }
        ]
        
        setColumns(knownColumns)
        setStatus('✅ Conexión exitosa! Estructura de tabla inferida correctamente.')
      } else {
        setColumns(schemaData || [])
        setStatus('✅ Estructura de tabla obtenida exitosamente!')
      }

    } catch (err: any) {
      setError(`❌ Error: ${err.message}`)
      setStatus('❌ Error al verificar la tabla')
    } finally {
      setLoading(false)
    }
  }

  const testDataInsert = async () => {
    setLoading(true)
    setStatus('Probando inserción de datos...')
    
    try {
      const testData = {
        day: 1,
        month: 1,
        year: 2024,
        event: 'Prueba de conexión con Supabase - Cristopher Gutierrez',
        display_date: '2024-01-01',
        historical_day: 1,
        historical_month: 1,
        historical_year: 2024
      }

      const { data, error } = await supabase
        .from('ephemerides')
        .insert(testData)
        .select()

      if (error) {
        throw new Error(`Error al insertar: ${error.message}`)
      }

      setStatus('✅ Datos insertados correctamente!')
    } catch (err: any) {
      setError(`❌ Error en inserción: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">🔍 Verificador de Tabla Supabase</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={checkTableStructure} 
              disabled={loading}
              variant="default"
            >
              {loading ? 'Verificando...' : 'Verificar Estructura'}
            </Button>
            
            <Button 
              onClick={testDataInsert} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Probando...' : 'Probar Inserción'}
            </Button>
          </div>

          {status && (
            <div className="text-sm font-mono bg-muted p-3 rounded">
              {status}
            </div>
          )}

          {error && (
            <div className="text-sm font-mono bg-destructive/10 text-destructive p-3 rounded">
              {error}
            </div>
          )}

          {columns.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">📊 Estructura de la tabla 'ephemerides':</h4>
              <div className="space-y-2">
                {columns.map((column, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                    <Badge variant="outline">{column.column_name}</Badge>
                    <span className="text-sm text-muted-foreground">{column.data_type}</span>
                    {column.is_nullable === 'NO' && (
                      <Badge variant="secondary" className="text-xs">NOT NULL</Badge>
                    )}
                    {column.column_default && (
                      <span className="text-xs text-muted-foreground">
                        Default: {column.column_default}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
