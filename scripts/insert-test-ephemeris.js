const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dsvzpfbsrsyrffbirqrb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzdnpwZmJzcnN5cmZmYmlycXJiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk4NzQ0NiwiZXhwIjoyMDc0NTYzNDQ2fQ.adnLfYYr3fwKEiY2RExfu_c5obSuEeXDbbsDBuFYKYI'

const supabase = createClient(supabaseUrl, supabaseKey)

async function insertTestEphemeris() {
  try {
    const { data, error } = await supabase
      .from('ephemerides')
      .insert({
        id: 1,
        day: 27,
        month: 9,
        year: 1969,
        event: 'Se envía el primer mensaje a través de ARPANET entre UCLA y Stanford, marcando el nacimiento de Internet.',
        display_date: '1969-09-27',
        historical_day: 27,
        historical_month: 9,
        historical_year: 1969
      })
      .select()

    if (error) {
      console.error('Error insertando efeméride:', error)
    } else {
      console.log('✅ Efeméride insertada exitosamente:', data)
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

insertTestEphemeris()
