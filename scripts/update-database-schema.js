const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dsvzpfbsrsyrffbirqrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdnpwZmJzcnN5cmZmYmlycXJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk4NzQ0NiwiZXhwIjoyMDc0NTYzNDQ2fQ.adnLfYYr3fwKEiY2RExfu_c5obSuEeXDbbsDBuFYKYI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateDatabaseSchema() {
  try {
    console.log('🔄 Actualizando efeméride con información expandida...')

    // Primero, verificar si la tabla tiene las columnas necesarias
    const { data: tableInfo, error: tableError } = await supabase
      .from('ephemerides')
      .select('*')
      .limit(1)

    if (tableError) {
      console.error('❌ Error accediendo a la tabla:', tableError)
      return
    }

    console.log('📋 Estructura actual de la tabla:', Object.keys(tableInfo[0] || {}))

    // Intentar actualizar la efeméride existente con información expandida
    const { data: updateData, error: updateError } = await supabase
      .from('ephemerides')
      .update({
        detailed_info: 'El 29 de octubre de 1969, a las 22:30 horas, el estudiante de UCLA Charley Kline intentó enviar el mensaje "LOGIN" a la computadora de Stanford. Aunque solo se transmitieron las letras "LO" antes de que el sistema se colapsara, este momento histórico marcó el nacimiento de la red que eventualmente se convertiría en Internet. ARPANET (Advanced Research Projects Agency Network) fue desarrollada por el Departamento de Defensa de Estados Unidos como una red de comunicación descentralizada que pudiera sobrevivir a ataques nucleares.',
        impact: 'Este evento sentó las bases para la revolución digital del siglo XXI, permitiendo la comunicación global instantánea, el comercio electrónico, las redes sociales y la transformación de prácticamente todos los aspectos de la vida moderna.',
        sources: [
          'https://www.darpa.mil/about-us/timeline/arpanet',
          'https://www.internethalloffame.org/internet-history/birth-internet',
          'https://www.computerhistory.org/internethistory/1960s/'
        ],
        category: 'INTERNET'
      })
      .eq('id', 1)

    if (updateError) {
      console.error('❌ Error actualizando efeméride:', updateError)
      console.log('💡 Nota: Es posible que necesites agregar las columnas manualmente en Supabase')
    } else {
      console.log('✅ Efeméride actualizada con información expandida')
    }

  } catch (err) {
    console.error('❌ Error general:', err)
  }
}

updateDatabaseSchema()
