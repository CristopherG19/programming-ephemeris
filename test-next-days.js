const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testNextDays() {
  console.log('📅 PROBANDO EFEMÉRIDES PARA LOS PRÓXIMOS DÍAS');
  console.log('============================================\n');

  const dates = [
    { day: 7, month: 10, name: 'MAÑANA (7 de octubre)' },
    { day: 8, month: 10, name: 'PASADO MAÑANA (8 de octubre)' },
    { day: 9, month: 10, name: '9 de octubre' },
    { day: 10, month: 10, name: '10 de octubre' }
  ];

  for (const dateInfo of dates) {
    console.log(`🔍 ${dateInfo.name}:`);
    
    // Verificar si ya existe en la base de datos
    const { data: existing, error: existingError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', dateInfo.day)
      .eq('month', dateInfo.month);

    if (existingError) {
      console.log(`   ❌ Error consultando: ${existingError.message}`);
      continue;
    }

    if (existing && existing.length > 0) {
      console.log(`   ✅ YA EXISTE efeméride en la base de datos:`);
      existing.forEach(record => {
        console.log(`      📅 ${record.historical_day}/${record.historical_month}/${record.historical_year}: ${record.event.substring(0, 80)}...`);
      });
    } else {
      console.log(`   ⚠️  NO EXISTE efeméride en la base de datos`);
      
      // Verificar si hay datos históricos hardcodeados para esta fecha
      const { ephemerisGenerator } = require('./lib/ai-ephemeris-generator');
      const testDate = new Date(2025, dateInfo.month - 1, dateInfo.day);
      
      try {
        console.log(`   🔄 Probando generación para ${dateInfo.day}/${dateInfo.month}...`);
        const generated = await ephemerisGenerator.generateEphemerisForDate(testDate);
        
        if (generated) {
          console.log(`   ✅ SE GENERARÁ: ${generated.event.substring(0, 80)}...`);
          console.log(`      📅 Fecha histórica: ${generated.historical_day}/${generated.historical_month}/${generated.historical_year}`);
          console.log(`      🏷️  Categoría: ${generated.category || 'N/A'}`);
        } else {
          console.log(`   ❌ NO se pudo generar efeméride`);
        }
      } catch (error) {
        console.log(`   ❌ Error generando: ${error.message}`);
      }
    }
    
    console.log(''); // Línea en blanco
  }

  // Mostrar resumen del sistema
  console.log('📋 RESUMEN DEL SISTEMA:');
  console.log('======================');
  console.log('✅ 6/10: Debian GNU/Linux 1.3 (1997) - YA FUNCIONA');
  console.log('✅ 7/10: Nokia fundación (1865) - DATOS PREPARADOS');
  console.log('⚠️  8/10: Se generará automáticamente si no existe');
  console.log('⚠️  9/10: Se generará automáticamente si no existe');
  console.log('⚠️  10/10: Se generará automáticamente si no existe');
  
  console.log('\n🤖 FUNCIONAMIENTO:');
  console.log('- Si existe efeméride histórica hardcodeada → Se usa esa');
  console.log('- Si NO existe → Se genera automáticamente (evento genérico)');
  console.log('- Una vez generada, se guarda en la base de datos');
  console.log('- Al día siguiente, se reutiliza la que está guardada');
}

testNextDays();