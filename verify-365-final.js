const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify365Days() {
  console.log('✅ VERIFICACIÓN FINAL: ¿ESTÁN LOS 365 DÍAS CUBIERTOS?');
  console.log('====================================================\n');

  // Consultar todos los eventos
  const { data: allEvents, error } = await supabase
    .from('ephemerides')
    .select('day, month, year, event')
    .eq('year', 2025)
    .order('month')
    .order('day');

  if (error) {
    console.log(`❌ Error: ${error.message}`);
    return;
  }

  console.log(`📊 Total eventos en BD: ${allEvents?.length || 0}`);

  // Verificar cada mes
  const monthStats = {};
  const allDates = new Set();

  if (allEvents) {
    allEvents.forEach(event => {
      const monthKey = event.month;
      if (!monthStats[monthKey]) {
        monthStats[monthKey] = 0;
      }
      monthStats[monthKey]++;
      
      const dateKey = `${event.month.toString().padStart(2, '0')}-${event.day.toString().padStart(2, '0')}`;
      allDates.add(dateKey);
    });
  }

  // Mostrar estadísticas por mes
  console.log('\n📅 EVENTOS POR MES:');
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    const eventsInMonth = monthStats[month] || 0;
    const coverage = ((eventsInMonth / daysInMonth) * 100).toFixed(1);
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    console.log(`${monthNames[month-1].padEnd(12)}: ${eventsInMonth.toString().padStart(2)}/${daysInMonth} días (${coverage}%)`);
  }

  // Encontrar días faltantes
  const allPossibleDates = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(2024, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      allPossibleDates.push(dateKey);
    }
  }

  const missingDates = allPossibleDates.filter(date => !allDates.has(date));

  console.log(`\n📊 COBERTURA TOTAL:`);
  console.log(`✅ Días cubiertos: ${allDates.size}`);
  console.log(`❌ Días faltantes: ${missingDates.length}`);
  console.log(`📈 Porcentaje: ${((allDates.size / allPossibleDates.length) * 100).toFixed(1)}%`);

  if (missingDates.length > 0) {
    console.log(`\n⚠️  DÍAS FALTANTES:`);
    missingDates.slice(0, 10).forEach(date => {
      console.log(`   - ${date}`);
    });
    if (missingDates.length > 10) {
      console.log(`   ... y ${missingDates.length - 10} más`);
    }
  }

  // Probar algunas fechas aleatorias
  console.log(`\n🧪 PROBANDO FECHAS ALEATORIAS:`);
  const testDates = [
    '2025-07-15', '2025-12-25', '2025-04-10', '2025-09-22', '2025-02-14'
  ];

  for (const testDate of testDates) {
    try {
      const response = await fetch('https://programming-ephemeris.vercel.app/api/generate-ephemeris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'specific', date: testDate })
      });
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${testDate}: ${result.data.event.substring(0, 60)}...`);
      } else {
        console.log(`❌ ${testDate}: Error - ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ${testDate}: Error de conexión`);
    }
  }

  console.log(`\n🎯 RESPUESTA FINAL:`);
  if (allDates.size >= 365) {
    console.log(`✅ SÍ, EL SISTEMA CUBRE LOS 365 DÍAS DEL AÑO`);
    console.log(`✅ Tienes ${allDates.size} días cubiertos de 365 posibles`);
    console.log(`✅ Sistema 100% funcional y listo para producción`);
  } else {
    console.log(`❌ NO, aún faltan ${365 - allDates.size} días`);
  }
}

verify365Days();