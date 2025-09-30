const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla ephemerides...');
    
    // Intentar obtener la estructura de la tabla
    const { data, error } = await supabase
      .from('ephemerides')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error obteniendo estructura:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Estructura actual de la tabla:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('📝 La tabla está vacía, pero existe');
    }

    // Intentar insertar una efeméride simple
    console.log('\n🧪 Probando inserción simple...');
    const testData = {
      day: 27,
      month: 9,
      year: 1969,
      event: 'Test event',
      display_date: '1969-09-27',
      historical_day: 27,
      historical_month: 9,
      historical_year: 1969
    };

    const { data: insertData, error: insertError } = await supabase
      .from('ephemerides')
      .insert(testData)
      .select();

    if (insertError) {
      console.error('❌ Error en inserción de prueba:', insertError);
    } else {
      console.log('✅ Inserción exitosa:', insertData);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTableStructure();
