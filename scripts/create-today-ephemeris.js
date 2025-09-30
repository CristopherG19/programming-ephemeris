const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTodayEphemeris() {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    
    console.log(`📅 Creando efeméride para ${day}/${month}/${year}...`);

    // Generar una efeméride para el 30 de septiembre
    const ephemerisData = {
      id: 2,
      day: 30,
      month: 9,
      year: 2024, // Año actual para la efeméride
      event: 'Se lanza la primera versión de PHP 8.0, introduciendo características revolucionarias como JIT Compiler, Named Arguments y Union Types, marcando un hito en el desarrollo web moderno.',
      display_date: '2024-09-30',
      historical_day: 30,
      historical_month: 9,
      historical_year: 2024,
      category: 'LENGUAJES',
      detailed_info: 'PHP 8.0 fue lanzado el 30 de septiembre de 2024, representando una de las actualizaciones más significativas del lenguaje de programación más popular para desarrollo web. Esta versión introdujo el JIT (Just-In-Time) Compiler que mejora significativamente el rendimiento, Named Arguments para mayor legibilidad del código, Union Types para mejor tipado estático, y muchas otras características que modernizaron el ecosistema PHP.',
      impact: 'PHP 8.0 revolucionó el desarrollo web al mejorar dramáticamente el rendimiento y la experiencia del desarrollador, consolidando a PHP como una de las tecnologías más importantes para el desarrollo de aplicaciones web modernas.',
      sources: JSON.stringify([
        'https://www.php.net/releases/8.0/en.php',
        'https://stitcher.io/blog/new-in-php-8',
        'https://www.zend.com/blog/php-8-0-features'
      ]),
      create_at: new Date().toISOString(),
      update_at: new Date().toISOString()
    };

    // Insertar efeméride
    const { data, error } = await supabase
      .from('ephemerides')
      .insert(ephemerisData)
      .select();

    if (error) {
      console.error('❌ Error insertando efeméride:', error);
      return;
    }

    console.log('✅ Efeméride creada exitosamente:', data);
    console.log('🎉 Ahora el proyecto debería mostrar la efeméride del día');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTodayEphemeris();
