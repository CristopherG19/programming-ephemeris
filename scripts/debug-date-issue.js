const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDateIssue() {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    
    console.log('📅 Fecha actual:', today.toISOString());
    console.log('📅 Día:', day, 'Mes:', month);
    
    // Buscar efemérides para hoy
    console.log('\n🔍 Buscando efemérides para hoy...');
    const { data: todayData, error: todayError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', day)
      .eq('month', month);

    if (todayError) {
      console.error('❌ Error buscando efemérides de hoy:', todayError);
    } else {
      console.log('✅ Efemérides para hoy:', todayData);
    }

    // Buscar todas las efemérides disponibles
    console.log('\n🔍 Buscando todas las efemérides...');
    const { data: allData, error: allError } = await supabase
      .from('ephemerides')
      .select('day, month, year, event');

    if (allError) {
      console.error('❌ Error buscando todas las efemérides:', allError);
    } else {
      console.log('✅ Todas las efemérides disponibles:');
      allData.forEach(ephemeris => {
        console.log(`  - ${ephemeris.day}/${ephemeris.month}/${ephemeris.year}: ${ephemeris.event.substring(0, 50)}...`);
      });
    }

    // Buscar efemérides para el 27 de septiembre (que sabemos que existe)
    console.log('\n🔍 Buscando efemérides para 27/9...');
    const { data: sept27Data, error: sept27Error } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', 27)
      .eq('month', 9);

    if (sept27Error) {
      console.error('❌ Error buscando efemérides del 27/9:', sept27Error);
    } else {
      console.log('✅ Efemérides del 27/9:', sept27Data);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugDateIssue();
