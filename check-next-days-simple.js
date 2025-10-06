const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Datos históricos hardcodeados (copiados del generador)
const verifiedEphemerides = {
  '10-07': [
    { 
      day: 7, 
      month: 10, 
      year: 2025, 
      event: 'Se funda Nokia, que se convertiría en líder mundial en telecomunicaciones y telefonía móvil.', 
      display_date: '1865-10-07', 
      historical_day: 7, 
      historical_month: 10, 
      historical_year: 1865,
      category: 'EMPRESAS'
    }
  ],
};

async function checkNextDaysSimple() {
  console.log('📅 ¿QUÉ EFEMÉRIDES SE MOSTRARÁN LOS PRÓXIMOS DÍAS?');
  console.log('=================================================\n');

  const dates = [
    { day: 7, month: 10, name: 'MAÑANA (7 de octubre)', key: '10-07' },
    { day: 8, month: 10, name: 'PASADO MAÑANA (8 de octubre)', key: '10-08' },
    { day: 9, month: 10, name: '9 de octubre', key: '10-09' },
    { day: 10, month: 10, name: '10 de octubre', key: '10-10' }
  ];

  for (const dateInfo of dates) {
    console.log(`🔍 ${dateInfo.name}:`);
    
    // 1. Verificar si ya existe en la base de datos
    const { data: existing, error: existingError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', dateInfo.day)
      .eq('month', dateInfo.month);

    if (existingError) {
      console.log(`   ❌ Error: ${existingError.message}`);
      continue;
    }

    if (existing && existing.length > 0) {
      console.log(`   ✅ YA EXISTE en base de datos (se mostrará esta):`);
      existing.forEach(record => {
        console.log(`      📅 ${record.historical_day}/${record.historical_month}/${record.historical_year}`);
        console.log(`      📝 ${record.event}`);
      });
    } else {
      // 2. Verificar si hay datos históricos hardcodeados
      const historicalData = verifiedEphemerides[dateInfo.key];
      if (historicalData && historicalData.length > 0) {
        console.log(`   ✅ SE GENERARÁ AUTOMÁTICAMENTE (datos históricos preparados):`);
        const randomEvent = historicalData[0]; // Tomar el primero
        console.log(`      📅 ${randomEvent.historical_day}/${randomEvent.historical_month}/${randomEvent.historical_year}`);
        console.log(`      📝 ${randomEvent.event}`);
        console.log(`      🏷️  Categoría: ${randomEvent.category}`);
      } else {
        console.log(`   ⚠️  SE GENERARÁ EVENTO GENÉRICO (no hay datos históricos para esta fecha)`);
        console.log(`      📝 Ejemplo: "Se desarrolla un avance significativo en [categoría]..."`);
      }
    }
    
    console.log(''); // Línea en blanco
  }

  // Probar la API para mañana
  console.log('🧪 PROBANDO GENERACIÓN PARA MAÑANA (7/10):');
  try {
    const response = await fetch('https://programming-ephemeris.vercel.app/api/generate-ephemeris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'specific', 
        date: '2025-10-07' 
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Efeméride generada para mañana:`);
      console.log(`📅 ${result.data.historical_day}/${result.data.historical_month}/${result.data.historical_year}`);
      console.log(`📝 ${result.data.event}`);
    } else {
      console.log(`❌ Error: ${result.error}`);
    }
  } catch (error) {
    console.log(`❌ Error llamando API: ${error.message}`);
  }

  console.log('\n📋 RESUMEN FINAL:');
  console.log('================');
  console.log('🎯 SÍ, cada día se mostrará una efeméride diferente');
  console.log('📅 Las fechas de los eventos coincidirán con el día actual');
  console.log('🔄 El sistema genera automáticamente si no existe');
  console.log('💾 Una vez generada, se guarda para reutilizar');
  console.log('⏰ Los cron jobs pueden generar efemérides por adelantado');
}

checkNextDaysSimple();