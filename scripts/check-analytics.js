const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAnalytics() {
  console.log('🔍 VERIFICANDO ESTADO DE ANALYTICS...\n');

  // 1. Verificar si estamos en desarrollo o producción
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.log(`📊 Entorno: ${isDevelopment ? 'DESARROLLO' : 'PRODUCCIÓN'}`);

  if (isDevelopment) {
    console.log('✅ En desarrollo: Mostrando datos simulados (1247 visitantes)');
    console.log('ℹ️  Los datos reales aparecerán en producción con Vercel Analytics');
    return;
  }

  // 2. Verificar configuración de Vercel Analytics
  console.log('\n🔧 CONFIGURACIÓN DE VERCEL ANALYTICS:');
  
  // Verificar si @vercel/analytics está instalado
  try {
    const packageJson = require('../package.json');
    const hasAnalytics = packageJson.dependencies['@vercel/analytics'];
    
    if (hasAnalytics) {
      console.log('✅ @vercel/analytics instalado');
    } else {
      console.log('❌ @vercel/analytics NO instalado');
      console.log('   Solución: npm install @vercel/analytics');
    }
  } catch (error) {
    console.log('❌ Error verificando dependencias:', error.message);
  }

  // 3. Verificar si el proyecto está desplegado en Vercel
  console.log('\n🌐 VERIFICACIÓN DE DESPLIEGUE:');
  console.log('ℹ️  Para que Vercel Analytics funcione:');
  console.log('   1. El proyecto debe estar desplegado en Vercel');
  console.log('   2. Vercel Analytics debe estar habilitado');
  console.log('   3. Debe haber tráfico real en el sitio');

  // 4. Verificar datos en Supabase (para analytics personalizados)
  console.log('\n📊 DATOS EN SUPABASE:');
  try {
    const { data, error } = await supabase
      .from('ephemerides')
      .select('id, day, month, year, event')
      .limit(5);

    if (error) {
      console.log('❌ Error accediendo a Supabase:', error.message);
    } else {
      console.log(`✅ Base de datos accesible (${data.length} efemérides)`);
      console.log('ℹ️  Los analytics de visitantes vienen de Vercel, no de Supabase');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // 5. Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  console.log('1. Verifica que Vercel Analytics esté habilitado en tu dashboard');
  console.log('2. Asegúrate de que el proyecto esté desplegado en Vercel');
  console.log('3. Genera tráfico real visitando el sitio');
  console.log('4. Los datos pueden tardar hasta 24 horas en aparecer');
  console.log('5. En desarrollo siempre muestra datos simulados');

  console.log('\n🎯 ESTADO ACTUAL:');
  console.log('   - Desarrollo: Datos simulados (1247 visitantes)');
  console.log('   - Producción: Datos reales de Vercel Analytics');
  console.log('   - Si muestra "0 visitantes" en producción, es normal al inicio');
}

checkAnalytics();
