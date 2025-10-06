const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertTodayEphemeris() {
  console.log('📅 INSERTANDO EFEMÉRIDE DEL 6 DE OCTUBRE');
  console.log('=========================================\n');

  const ephemerisData = {
    day: 6,
    month: 10,
    year: 2025,
    event: 'Steve Jobs presenta el iPhone en la Macworld Conference & Expo, revolucionando la computación móvil.',
    display_date: '2007-01-09',
    historical_day: 9,
    historical_month: 1,
    historical_year: 2007,
    category: 'HARDWARE',
    detailed_info: 'Steve Jobs presentó el iPhone como "tres productos revolucionarios en uno": un iPod con pantalla táctil, un teléfono móvil revolucionario y un dispositivo de comunicación por Internet. Esta presentación cambió para siempre la industria de los smartphones y estableció a Apple como líder en innovación móvil.',
    impact: 'El iPhone redefinió lo que significaba un teléfono inteligente, estableciendo nuevos estándares para interfaces táctiles, aplicaciones móviles y conectividad, influenciando toda la industria tecnológica y cambiando la forma en que interactuamos con la tecnología.',
    sources: JSON.stringify([
      'https://www.apple.com/newsroom/',
      'https://www.macworld.com/',
      'https://www.computerhistory.org/'
    ])
  };

  try {
    // Primero verificar si ya existe
    const { data: existing, error: checkError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', 6)
      .eq('month', 10)
      .eq('year', 2025);

    if (checkError) {
      console.log(`❌ Error verificando datos existentes: ${checkError.message}`);
      return;
    }

    if (existing && existing.length > 0) {
      console.log('⚠️  Ya existe una efeméride para el 6 de octubre de 2025');
      console.log(`📝 Evento actual: ${existing[0].event.substring(0, 100)}...`);
      
      // Actualizar con los nuevos datos
      const { data: updated, error: updateError } = await supabase
        .from('ephemerides')
        .update(ephemerisData)
        .eq('day', 6)
        .eq('month', 10)
        .eq('year', 2025)
        .select();

      if (updateError) {
        console.log(`❌ Error actualizando: ${updateError.message}`);
      } else {
        console.log('✅ Efeméride actualizada exitosamente');
        console.log(`📱 Nuevo evento: ${ephemerisData.event}`);
      }
    } else {
      // Insertar nuevo registro
      const { data: inserted, error: insertError } = await supabase
        .from('ephemerides')
        .insert(ephemerisData)
        .select();

      if (insertError) {
        console.log(`❌ Error insertando: ${insertError.message}`);
      } else {
        console.log('✅ Efeméride insertada exitosamente');
        console.log(`📱 Evento: ${ephemerisData.event}`);
      }
    }

    // Verificar que la API funciona ahora
    console.log('\n🔍 PROBANDO API...');
    try {
      const response = await fetch('https://programming-ephemeris.vercel.app/api/generate-ephemeris');
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ API funcionando correctamente');
        console.log(`📅 Efeméride devuelta: ${result.data.event.substring(0, 100)}...`);
      } else {
        console.log('❌ API devolvió error:', result.error);
      }
    } catch (error) {
      console.log(`❌ Error llamando API: ${error.message}`);
    }

  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

insertTodayEphemeris();