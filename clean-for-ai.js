const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanDatabaseForAI() {
  console.log('🧹 LIMPIANDO BASE DE DATOS PARA SISTEMA CON IA');
  console.log('===============================================\n');

  // Contar registros actuales
  const { data: currentData, error: countError } = await supabase
    .from('ephemerides')
    .select('*', { count: 'exact' });

  if (countError) {
    console.log(`❌ Error contando registros: ${countError.message}`);
    return;
  }

  console.log(`📊 Registros actuales: ${currentData?.length || 0}`);

  // Confirmación (en producción podrías agregar una confirmación)
  console.log('🔄 Eliminando registros para probar IA desde cero...');

  // Eliminar todos los registros de 2025
  const { error: deleteError } = await supabase
    .from('ephemerides')
    .delete()
    .eq('year', 2025);

  if (deleteError) {
    console.log(`❌ Error eliminando registros: ${deleteError.message}`);
    return;
  }

  // Verificar que se eliminaron
  const { data: afterData, error: afterError } = await supabase
    .from('ephemerides')
    .select('*', { count: 'exact' })
    .eq('year', 2025);

  if (afterError) {
    console.log(`❌ Error verificando eliminación: ${afterError.message}`);
    return;
  }

  console.log(`✅ Registros eliminados exitosamente`);
  console.log(`📊 Registros restantes para 2025: ${afterData?.length || 0}`);

  console.log('\n🤖 SISTEMA LISTO PARA IA:');
  console.log('✅ Base de datos limpia');
  console.log('✅ Próxima vez que visites la web, la IA buscará eventos reales');
  console.log('✅ Los eventos encontrados se guardarán automáticamente');
}

cleanDatabaseForAI();