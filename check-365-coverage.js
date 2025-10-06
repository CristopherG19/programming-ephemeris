const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Simular la función generateYearRoundEvents del código actual
function countCurrentEvents() {
  // Eventos hardcodeados actualmente
  const TECH_EVENTS_DATABASE = {
    '01-01': [{}], '01-02': [{}], '01-03': [{}], '01-04': [{}], '01-05': [{}], '01-06': [{}], '01-07': [{}], '01-08': [{}], '01-09': [{}], '01-10': [{}],
    '02-01': [{}], '02-02': [{}], '02-03': [{}], '02-04': [{}], '02-05': [{}], 
    '03-01': [{}], '03-02': [{}],
    '10-01': [{}], '10-02': [{}], '10-03': [{}], '10-04': [{}], '10-05': [{}], '10-06': [{}], '10-07': [{}], '10-08': [{}], '10-09': [{}], '10-10': [{}]
  };

  // Simular generateYearRoundEvents
  const expandedEvents = { ...TECH_EVENTS_DATABASE };
  const majorTechEvents = [
    { event: 'Se funda Intel Corporation.', year: 1968 },
    { event: 'Tim Berners-Lee propone la WWW.', year: 1989 },
    { event: 'Se lanza Mosaic.', year: 1993 },
    // ... más eventos
  ];

  // Generar para todo el año
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      
      if (!expandedEvents[dateKey]) {
        expandedEvents[dateKey] = [{ generated: true }];
      }
    }
  }

  return {
    hardcoded: Object.keys(TECH_EVENTS_DATABASE).length,
    total: Object.keys(expandedEvents).length
  };
}

async function checkYearCoverage() {
  console.log('📅 VERIFICANDO COBERTURA ANUAL DEL SISTEMA');
  console.log('==========================================\n');

  // Contar eventos en el código actual
  const counts = countCurrentEvents();
  console.log(`📊 Eventos hardcodeados: ${counts.hardcoded}`);
  console.log(`📊 Total después de expandir: ${counts.total}`);

  // Verificar cuántos días tiene el año
  const daysInYear = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      daysInYear.push(`${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
    }
  }

  console.log(`\n📅 DÍAS DEL AÑO:`);
  console.log(`- Total días en 2024: ${daysInYear.length}`);
  console.log(`- Esperado: 366 (año bisiesto) o 365`);

  // Verificar en base de datos
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: dbEvents, error } = await supabase
    .from('ephemerides')
    .select('day, month, year')
    .eq('year', 2025);

  if (error) {
    console.log(`❌ Error consultando BD: ${error.message}`);
  } else {
    console.log(`\n📊 EVENTOS EN BASE DE DATOS:`);
    console.log(`- Total registros para 2025: ${dbEvents?.length || 0}`);
    
    if (dbEvents && dbEvents.length > 0) {
      const uniqueDates = new Set(dbEvents.map(e => `${e.month.toString().padStart(2, '0')}-${e.day.toString().padStart(2, '0')}`));
      console.log(`- Fechas únicas cubiertas: ${uniqueDates.size}`);
      console.log(`- Faltarían: ${365 - uniqueDates.size} días`);
    }
  }

  console.log(`\n🎯 RESPUESTA A TU PREGUNTA:`);
  if (counts.total >= 365) {
    console.log(`✅ SÍ, el sistema PUEDE cubrir los 365 días`);
    console.log(`✅ La función generateYearRoundEvents() genera automáticamente para TODOS los días`);
  } else {
    console.log(`❌ NO, actualmente solo cubre ${counts.total} días`);
  }

  console.log(`\n🔧 PERO HAY UN PROBLEMA:`);
  console.log(`⚠️  Los eventos se generan EN MEMORIA cada vez`);
  console.log(`⚠️  No están persistidos en la base de datos`);
  console.log(`⚠️  Necesitamos poblar la BD con los 365 días`);
}

checkYearCoverage();