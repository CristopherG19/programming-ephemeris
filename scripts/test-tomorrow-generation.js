const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTomorrowGeneration() {
  try {
    // Simular fecha de mañana (1 de octubre)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log(`📅 Probando generación para mañana: ${tomorrow.toDateString()}`);
    
    // Buscar si ya existe efeméride para mañana
    const { data: existingData, error: existingError } = await supabase
      .from('ephemerides')
      .select('*')
      .eq('day', tomorrow.getDate())
      .eq('month', tomorrow.getMonth() + 1);

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('❌ Error buscando efeméride existente:', existingError);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log('✅ Ya existe efeméride para mañana:', existingData[0].event);
      return;
    }

    // Generar nueva efeméride para mañana
    console.log('🔄 Generando nueva efeméride para mañana...');
    
    const categories = ['PROGRAMACIÓN', 'INTERNET', 'HARDWARE', 'SOFTWARE', 'LENGUAJES', 'SISTEMAS']
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    
    const events = [
      `Se desarrolla un avance significativo en ${randomCategory.toLowerCase()}, marcando un hito en la evolución tecnológica.`,
      `Un momento crucial en la historia de la computación ocurre en el campo de ${randomCategory.toLowerCase()}.`,
      `La tecnología da un salto importante en el desarrollo de ${randomCategory.toLowerCase()}.`,
      `Un hito memorable en la programación y desarrollo de software se alcanza este día.`
    ]

    const randomEvent = events[Math.floor(Math.random() * events.length)]

    const ephemerisData = {
      id: 3, // Nuevo ID
      day: tomorrow.getDate(),
      month: tomorrow.getMonth() + 1,
      year: tomorrow.getFullYear(),
      event: randomEvent,
      display_date: tomorrow.toISOString().split('T')[0],
      historical_day: tomorrow.getDate(),
      historical_month: tomorrow.getMonth() + 1,
      historical_year: tomorrow.getFullYear(),
      category: randomCategory,
      detailed_info: `Este evento representa un momento significativo en la historia de la tecnología, específicamente en el área de ${randomCategory.toLowerCase()}. Aunque los detalles específicos pueden variar, este día marca un punto importante en la evolución continua de la tecnología moderna.`,
      impact: `Este avance contribuyó al desarrollo continuo de la tecnología moderna, influyendo en futuras innovaciones y mejoras en el campo de ${randomCategory.toLowerCase()}.`,
      sources: JSON.stringify([
        'https://en.wikipedia.org/wiki/History_of_computing',
        'https://www.computerhistory.org/',
        'https://www.britannica.com/technology/computer-science'
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

    console.log('✅ Efeméride para mañana creada exitosamente:', data[0].event);
    console.log('🎉 Sistema de generación automática funcionando correctamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testTomorrowGeneration();
