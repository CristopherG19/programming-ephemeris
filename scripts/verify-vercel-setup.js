const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 VERIFICANDO CONFIGURACIÓN PARA VERCEL...\n');

// 1. Verificar variables de entorno
console.log('1️⃣ VERIFICANDO VARIABLES DE ENTORNO:');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const cronSecret = process.env.CRON_SECRET;

console.log(`   ✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Configurada' : '❌ Faltante'}`);
console.log(`   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Configurada' : '❌ Faltante'}`);
console.log(`   ✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? '✅ Configurada' : '❌ Faltante'}`);
console.log(`   ✅ CRON_SECRET: ${cronSecret ? '✅ Configurada' : '❌ Faltante'}`);

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.log('\n❌ ERROR: Variables de entorno faltantes. Configura en Vercel:');
  console.log('   - Ve a Vercel Dashboard > Settings > Environment Variables');
  console.log('   - Agrega las variables de Supabase');
  process.exit(1);
}

// 2. Verificar conexión a Supabase
console.log('\n2️⃣ VERIFICANDO CONEXIÓN A SUPABASE:');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifySupabase() {
  try {
    const { data, error } = await supabase
      .from('ephemerides')
      .select('count')
      .limit(1);

    if (error) {
      console.log(`   ❌ Error conectando a Supabase: ${error.message}`);
      return false;
    }

    console.log('   ✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// 3. Verificar estructura de tabla
async function verifyTableStructure() {
  console.log('\n3️⃣ VERIFICANDO ESTRUCTURA DE TABLA:');
  try {
    const { data, error } = await supabase
      .from('ephemerides')
      .select('*')
      .limit(1);

    if (error) {
      console.log(`   ❌ Error: ${error.message}`);
      return false;
    }

    if (data && data.length > 0) {
      const record = data[0];
      const requiredFields = ['id', 'day', 'month', 'year', 'event', 'display_date'];
      const missingFields = requiredFields.filter(field => !(field in record));
      
      if (missingFields.length > 0) {
        console.log(`   ❌ Campos faltantes: ${missingFields.join(', ')}`);
        return false;
      }
      
      console.log('   ✅ Estructura de tabla correcta');
      console.log(`   📊 Registros en la tabla: ${data.length > 0 ? 'Sí' : 'No'}`);
      return true;
    } else {
      console.log('   ⚠️  Tabla vacía (esto está bien, se generarán automáticamente)');
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// 4. Verificar configuración de Vercel
console.log('\n4️⃣ VERIFICANDO CONFIGURACIÓN DE VERCEL:');
const fs = require('fs');
const path = require('path');

try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  
  if (vercelConfig.crons && vercelConfig.crons.length > 0) {
    console.log('   ✅ Cron jobs configurados');
    vercelConfig.crons.forEach(cron => {
      console.log(`      - ${cron.path} (${cron.schedule})`);
    });
  } else {
    console.log('   ❌ No hay cron jobs configurados');
  }
} catch (error) {
  console.log('   ❌ Error leyendo vercel.json:', error.message);
}

// 5. Verificar archivos de API
console.log('\n5️⃣ VERIFICANDO ARCHIVOS DE API:');
const apiFiles = [
  'app/api/generate-ephemeris/route.ts',
  'app/api/cron/generate-daily-ephemeris/route.ts'
];

apiFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - FALTANTE`);
  }
});

// Ejecutar verificaciones
async function runVerification() {
  const supabaseOk = await verifySupabase();
  const tableOk = await verifyTableStructure();
  
  console.log('\n📋 RESUMEN:');
  console.log(`   Variables de entorno: ${supabaseUrl && supabaseAnonKey && supabaseServiceKey ? '✅' : '❌'}`);
  console.log(`   Conexión Supabase: ${supabaseOk ? '✅' : '❌'}`);
  console.log(`   Estructura tabla: ${tableOk ? '✅' : '❌'}`);
  console.log(`   Configuración Vercel: ${fs.existsSync('vercel.json') ? '✅' : '❌'}`);
  
  if (supabaseOk && tableOk) {
    console.log('\n🎉 ¡CONFIGURACIÓN CORRECTA! El proyecto debería funcionar en Vercel.');
    console.log('\n📝 PRÓXIMOS PASOS:');
    console.log('   1. Asegúrate de que las variables de entorno estén en Vercel');
    console.log('   2. Despliega el proyecto: git push origin main');
    console.log('   3. Verifica que la API funcione: https://tu-proyecto.vercel.app/api/generate-ephemeris');
  } else {
    console.log('\n❌ HAY PROBLEMAS QUE RESOLVER ANTES DEL DESPLIEGUE');
  }
}

runVerification();
