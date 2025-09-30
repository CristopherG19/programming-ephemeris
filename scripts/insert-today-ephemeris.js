const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';

console.log('🔗 Conectando a Supabase...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertTodayEphemeris() {
  try {
    // Obtener fecha actual
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    
    console.log(`📅 Insertando efeméride para ${day}/${month}...`);

    // Datos de la efeméride de hoy (27 de septiembre)
    const ephemerisData = {
      id: 2, // ID único para la nueva efeméride
      day: 27,
      month: 9,
      year: 1969,
      event: 'Se envía el primer mensaje a través de ARPANET entre UCLA y Stanford, marcando el nacimiento de Internet.',
      display_date: '1969-09-27',
      historical_day: 27,
      historical_month: 9,
      historical_year: 1969,
      category: 'INTERNET',
      detailed_info: 'El 29 de octubre de 1969, a las 22:30 horas, el estudiante de UCLA Charley Kline intentó enviar el mensaje "LOGIN" a la computadora de Stanford. Aunque solo se transmitieron las letras "LO" antes de que el sistema se colapsara, este momento histórico marcó el nacimiento de la red que eventualmente se convertiría en Internet.',
      impact: 'Este evento sentó las bases para la revolución digital del siglo XXI, permitiendo la comunicación global instantánea, el comercio electrónico, las redes sociales y la transformación de prácticamente todos los aspectos de la vida moderna.',
      sources: JSON.stringify([
        'https://www.darpa.mil/about-us/timeline/arpanet',
        'https://www.internethalloffame.org/internet-history/birth-internet',
        'https://www.computerhistory.org/internethistory/1960s/'
      ]),
      create_at: new Date().toISOString(), // Usar create_at en lugar de created_at
      update_at: new Date().toISOString()  // Usar update_at en lugar de updated_at
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

    console.log('✅ Efeméride insertada exitosamente:', data);
    console.log('🎉 Ahora el proyecto debería funcionar correctamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar
insertTodayEphemeris();
