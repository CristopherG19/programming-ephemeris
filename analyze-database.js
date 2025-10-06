const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function analyzeDatabase() {
  console.log('🔍 ANALIZANDO ESTRUCTURA DE BASE DE DATOS');
  console.log('=========================================\n');

  try {
    // Ver todos los registros existentes
    console.log('1️⃣ REGISTROS EXISTENTES:');
    const { data: allRecords, error: allError } = await supabase
      .from('ephemerides')
      .select('*')
      .order('id', { ascending: true });

    if (allError) {
      console.log(`❌ Error: ${allError.message}`);
    } else {
      console.log(`📊 Total registros: ${allRecords?.length || 0}`);
      if (allRecords && allRecords.length > 0) {
        allRecords.forEach(record => {
          console.log(`ID: ${record.id} | ${record.day}/${record.month}/${record.year} | ${record.event.substring(0, 60)}...`);
        });

        // Mostrar estructura del primer registro
        console.log('\n📋 ESTRUCTURA DEL PRIMER REGISTRO:');
        console.log(Object.keys(allRecords[0]));
      }
    }

    // Intentar insertar con ID específico
    console.log('\n2️⃣ INTENTANDO INSERCIÓN CON ID ESPECÍFICO:');
    const newId = Math.max(...(allRecords?.map(r => r.id) || [0])) + 1;
    
    const ephemerisData = {
      id: newId,
      day: 6,
      month: 10,
      year: 2025,
      event: 'Steve Jobs presenta el iPhone en la Macworld Conference & Expo, revolucionando la computación móvil.',
      display_date: '2007-01-09',
      historical_day: 9,
      historical_month: 1,
      historical_year: 2007
    };

    const { data: inserted, error: insertError } = await supabase
      .from('ephemerides')
      .insert([ephemerisData])
      .select();

    if (insertError) {
      console.log(`❌ Error insertando: ${insertError.message}`);
    } else {
      console.log('✅ Efeméride insertada exitosamente');
      console.log(`📱 ID: ${inserted[0].id} | ${inserted[0].event}`);
    }

  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

analyzeDatabase();