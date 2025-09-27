const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dsvzpfbsrsyrffbirqrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdnpwZmJzcnN5cmZmYmlycXJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk4NzQ0NiwiZXhwIjoyMDc0NTYzNDQ2fQ.adnLfYYr3fwKEiY2RExfu_c5obSuEeXDbbsDBuFYKYI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixSourcesFormat() {
  try {
    console.log('🔄 Corrigiendo formato de sources...')

    // Actualizar la efeméride con sources como array
    const { data, error } = await supabase
      .from('ephemerides')
      .update({
        sources: [
          'https://www.darpa.mil/about-us/timeline/arpanet',
          'https://www.internethalloffame.org/internet-history/birth-internet',
          'https://www.computerhistory.org/internethistory/1960s/'
        ]
      })
      .eq('id', 1)

    if (error) {
      console.error('❌ Error actualizando sources:', error)
    } else {
      console.log('✅ Sources actualizado como array correctamente')
    }

  } catch (err) {
    console.error('❌ Error general:', err)
  }
}

fixSourcesFormat()
