const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugEphemeris() {
  console.log('🔍 DEBUGGING SISTEMA DE EFEMÉRIDES');
  console.log('=====================================\n');

  // 1. Verificar datos existentes
  console.log('1️⃣ VERIFICANDO DATOS EN LA BASE DE DATOS:');
  try {
    const { data: allData, error: allError } = await supabase
      .from('ephemerides')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (allError) {
      console.log(`❌ Error: ${allError.message}`);
      return;
    }

    console.log(`📊 Total de registros encontrados: ${allData?.length || 0}`);
    
    if (allData && allData.length > 0) {
      console.log('\n📋 ÚLTIMOS REGISTROS:');
      allData.forEach((record, index) => {
        console.log(`${index + 1}. ${record.day}/${record.month}/${record.year} - ${record.event.substring(0, 100)}...`);
      });
    }

  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
  }

  // 2. Verificar efeméride de hoy
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth() + 1;

  console.log(`\n2️⃣ VERIFICANDO EFEMÉRIDE DE HOY (${todayDay}/${todayMonth}):`);
  
  try {
    const { data: todayData, error: todayError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', todayDay)
      .eq('month', todayMonth);

    if (todayError) {
      console.log(`❌ Error: ${todayError.message}`);
    } else {
      console.log(`📊 Registros para hoy: ${todayData?.length || 0}`);
      if (todayData && todayData.length > 0) {
        todayData.forEach((record, index) => {
          console.log(`${index + 1}. ${record.year} - ${record.event}`);
        });
      } else {
        console.log('⚠️  No hay efemérides para el día de hoy');
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  // 3. Probar generación de efeméride
  console.log('\n3️⃣ PROBANDO GENERACIÓN DE EFEMÉRIDE:');
  try {
    const response = await fetch('https://programming-ephemeris.vercel.app/api/generate-ephemeris');
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ API funcionando correctamente');
      console.log(`📅 Efeméride generada: ${result.data.event}`);
      console.log(`📊 Tipo: ${result.data.category || 'N/A'}`);
    } else {
      console.log('❌ API devolvió error:', result.error);
    }
  } catch (error) {
    console.log(`❌ Error llamando API: ${error.message}`);
  }

  // 4. Verificar cron job
  console.log('\n4️⃣ INFORMACIÓN DEL CRON JOB:');
  console.log('Schedule: 1 0 * * * (1 minuto después de medianoche UTC)');
  console.log('Endpoint: /api/cron/generate-daily-ephemeris');
  console.log('⚠️  Nota: Los cron jobs de Vercel solo funcionan en el plan Pro+');

  console.log('\n=====================================');
  console.log('🎯 DIAGNÓSTICO COMPLETO TERMINADO');
}

debugEphemeris();