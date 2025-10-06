const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanAndFixDatabase() {
  console.log('🧹 LIMPIANDO Y ARREGLANDO BASE DE DATOS');
  console.log('=====================================\n');

  try {
    // 1. Limpiar eventos genéricos del 6 de octubre de 2025
    console.log('1️⃣ LIMPIANDO EVENTOS GENÉRICOS DEL 6 DE OCTUBRE 2025...');
    const { error: deleteError } = await supabase
      .from('ephemerides')
      .delete()
      .eq('day', 6)
      .eq('month', 10)
      .eq('year', 2025);

    if (deleteError) {
      console.log(`❌ Error eliminando: ${deleteError.message}`);
    } else {
      console.log('✅ Eventos genéricos eliminados');
    }

    // 2. Insertar el evento histórico correcto para hoy
    console.log('\n2️⃣ INSERTANDO EVENTO HISTÓRICO PARA HOY...');
    const todayEphemeris = {
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

    const { data: inserted, error: insertError } = await supabase
      .from('ephemerides')
      .insert(todayEphemeris)
      .select();

    if (insertError) {
      console.log(`❌ Error insertando: ${insertError.message}`);
    } else {
      console.log('✅ Evento histórico insertado');
      console.log(`📱 ${todayEphemeris.event}`);
    }

    // 3. Verificar el resultado
    console.log('\n3️⃣ VERIFICANDO DATOS ACTUALES...');
    const { data: current, error: selectError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', 6)
      .eq('month', 10);

    if (selectError) {
      console.log(`❌ Error consultando: ${selectError.message}`);
    } else {
      console.log(`📊 Eventos para el 6 de octubre: ${current?.length || 0}`);
      if (current && current.length > 0) {
        current.forEach((record, index) => {
          console.log(`${index + 1}. ${record.year} - ${record.event.substring(0, 80)}...`);
        });
      }
    }

    // 4. Probar API local
    console.log('\n4️⃣ PROBANDO GENERACIÓN LOCAL...');
    const { ephemerisGenerator } = require('./lib/ai-ephemeris-generator.ts');
    const today = new Date();
    const localResult = await ephemerisGenerator.getTodayEphemeris();
    
    if (localResult) {
      console.log('✅ Generación local funcionando');
      console.log(`📅 Evento: ${localResult.event.substring(0, 80)}...`);
    } else {
      console.log('❌ Error en generación local');
    }

  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }

  console.log('\n📋 PRÓXIMOS PASOS:');
  console.log('1. Hacer deploy de los cambios: git add . && git commit -m "Fix ephemeris generation" && git push');
  console.log('2. Esperar a que Vercel despliegue los cambios');
  console.log('3. Probar la API nuevamente');
}

cleanAndFixDatabase();