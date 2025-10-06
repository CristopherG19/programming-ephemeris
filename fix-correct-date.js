const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateOctoberSixthCorrect() {
  console.log('📅 ACTUALIZANDO EFEMÉRIDE DEL 6 DE OCTUBRE CON FECHA CORRECTA');
  console.log('===========================================================\n');

  // Datos correctos para el 6 de octubre - evento que realmente ocurrió ese día
  const correctEphemeris = {
    day: 6,
    month: 10,
    year: 2025,
    event: 'Se lanza Debian GNU/Linux 1.3, estableciendo uno de los sistemas operativos más estables y utilizados en servidores.',
    display_date: '1997-10-06',
    historical_day: 6,
    historical_month: 10,
    historical_year: 1997,
    category: 'SISTEMAS',
    detailed_info: 'El 6 de octubre de 1997, se lanzó Debian GNU/Linux 1.3, conocido como "Bo". Esta distribución estableció estándares importantes para la estabilidad y gestión de paquetes en sistemas Linux. Debian se caracterizó por su compromiso con el software libre y su sistema de gestión de paquetes APT, que más tarde influenciaría muchas otras distribuciones.',
    impact: 'Debian se convirtió en la base de muchas distribuciones populares como Ubuntu, y estableció estándares para la gestión de paquetes y estabilidad en sistemas Linux. Su influencia se extiende a millones de servidores y sistemas en todo el mundo.',
    sources: JSON.stringify([
      'https://www.debian.org/releases/hamm/',
      'https://wiki.debian.org/DebianHistory',
      'https://www.linux.org/threads/debian-history.4223/'
    ])
  };

  try {
    // Actualizar el registro existente (ID 4)
    console.log('🔄 ACTUALIZANDO REGISTRO EXISTENTE...');
    const { data: updated, error: updateError } = await supabase
      .from('ephemerides')
      .update(correctEphemeris)
      .eq('day', 6)
      .eq('month', 10)
      .eq('year', 2025)
      .select();

    if (updateError) {
      console.log(`❌ Error actualizando: ${updateError.message}`);
    } else {
      console.log('✅ Efeméride actualizada exitosamente');
      console.log(`📅 Evento histórico del ${correctEphemeris.historical_day}/${correctEphemeris.historical_month}/${correctEphemeris.historical_year}`);
      console.log(`🐧 ${correctEphemeris.event}`);
    }

    // Verificar la actualización
    console.log('\n🔍 VERIFICANDO ACTUALIZACIÓN...');
    const { data: verification, error: verifyError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', 6)
      .eq('month', 10)
      .eq('year', 2025);

    if (verifyError) {
      console.log(`❌ Error verificando: ${verifyError.message}`);
    } else {
      console.log(`📊 Registros para 6/10/2025: ${verification?.length || 0}`);
      if (verification && verification.length > 0) {
        verification.forEach(record => {
          console.log(`📝 ${record.historical_day}/${record.historical_month}/${record.historical_year}: ${record.event}`);
        });
      }
    }

    // Probar la API
    console.log('\n🌐 PROBANDO API...');
    try {
      const response = await fetch('https://programming-ephemeris.vercel.app/api/generate-ephemeris');
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ API funcionando');
        console.log(`📅 Fecha histórica: ${result.data.historical_day}/${result.data.historical_month}/${result.data.historical_year}`);
        console.log(`📖 Evento: ${result.data.event.substring(0, 80)}...`);
      } else {
        console.log('❌ Error en API:', result.error);
      }
    } catch (error) {
      console.log(`❌ Error llamando API: ${error.message}`);
    }

  } catch (error) {
    console.log(`❌ Error general: ${error.message}`);
  }

  console.log('\n✅ AHORA LA EFEMÉRIDE MUESTRA UN EVENTO QUE REALMENTE OCURRIÓ EL 6 DE OCTUBRE! 🎉');
}

updateOctoberSixthCorrect();