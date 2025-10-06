const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertOctoberSixth() {
  console.log('📅 INSERTANDO EFEMÉRIDE PARA EL 6 DE OCTUBRE');
  console.log('============================================\n');

  const ephemerisData = {
    day: 6,
    month: 10,
    year: 2025,
    event: 'Steve Jobs presenta el iPhone en la Macworld Conference & Expo, revolucionando la computación móvil.',
    display_date: '2007-01-09',
    historical_day: 9,
    historical_month: 1,
    historical_year: 2007
  };

  try {
    // Insertar sin especificar ID (auto-generado)
    const { data, error } = await supabase
      .from('ephemerides')
      .insert([ephemerisData])
      .select();

    if (error) {
      console.log(`❌ Error: ${error.message}`);
      
      // Si ya existe, intentar actualizar
      if (error.code === '23505') {
        console.log('🔄 El registro ya existe, intentando actualizar...');
        
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
          console.log('✅ Registro actualizado exitosamente');
          console.log(updated);
        }
      }
    } else {
      console.log('✅ Efeméride insertada exitosamente');
      console.log(data);
    }

    // Verificar que existe
    console.log('\n🔍 VERIFICANDO INSERCIÓN...');
    const { data: verification, error: verifyError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', 6)
      .eq('month', 10)
      .eq('year', 2025);

    if (verifyError) {
      console.log(`❌ Error verificando: ${verifyError.message}`);
    } else {
      console.log(`📊 Registros encontrados: ${verification?.length || 0}`);
      if (verification && verification.length > 0) {
        verification.forEach(record => {
          console.log(`📝 ${record.event}`);
        });
      }
    }

  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }
}

insertOctoberSixth();