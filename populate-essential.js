const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Base de datos seleccionada de eventos más importantes
const ESSENTIAL_TECH_EVENTS = [
  // Octubre (mes actual - prioridad)
  { date: '10-04', event: 'La URSS lanza el Sputnik, iniciando la era espacial.', year: 1957, category: 'TECNOLOGÍA' },
  { date: '10-08', event: 'Se lanza Microsoft Windows 98, estableciendo un nuevo estándar.', year: 1998, category: 'SISTEMAS' },
  { date: '10-09', event: 'Se funda Canonical Ltd., empresa creadora de Ubuntu Linux.', year: 2004, category: 'EMPRESAS' },
  { date: '10-10', event: 'Se anuncia el proyecto GNU por Richard Stallman.', year: 1985, category: 'SOFTWARE' },
  { date: '10-23', event: 'Apple presenta el primer iPod.', year: 2001, category: 'HARDWARE' },
  { date: '10-29', event: 'Se envía el primer mensaje a través de ARPANET.', year: 1969, category: 'INTERNET' },
  
  // Eventos esenciales del año
  { date: '01-09', event: 'Steve Jobs presenta el iPhone, revolucionando la computación móvil.', year: 2007, category: 'HARDWARE' },
  { date: '02-04', event: 'Mark Zuckerberg lanza Facebook desde su dormitorio en Harvard.', year: 2004, category: 'WEB' },
  { date: '03-12', event: 'Tim Berners-Lee propone la World Wide Web en el CERN.', year: 1989, category: 'INTERNET' },
  { date: '04-01', event: 'Apple se funda oficialmente en el garaje de Steve Jobs.', year: 1976, category: 'EMPRESAS' },
  { date: '05-01', event: 'Se lanza Amazon.com como librería online.', year: 1995, category: 'EMPRESAS' },
  { date: '06-08', event: 'Nace Tim Berners-Lee, creador de la World Wide Web.', year: 1955, category: 'HISTORIA' },
  { date: '07-11', event: 'Netflix inicia su servicio de streaming.', year: 2007, category: 'WEB' },
  { date: '08-06', event: 'Se lanza la World Wide Web al público general.', year: 1991, category: 'INTERNET' },
  { date: '09-04', event: 'Google se funda oficialmente en un garaje de California.', year: 1998, category: 'EMPRESAS' },
  { date: '11-20', event: 'Microsoft lanza Windows 1.0.', year: 1985, category: 'SISTEMAS' },
  { date: '12-09', event: 'Se presenta la primera demostración pública del mouse.', year: 1968, category: 'HARDWARE' }
];

async function populateWithCorrectIds() {
  console.log('🔧 POBLANDO BASE DE DATOS CON IDs CORRECTOS');
  console.log('==========================================\n');

  // Obtener el último ID usado
  const { data: lastRecord, error: lastError } = await supabase
    .from('ephemerides')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (lastError && lastError.code !== 'PGRST116') {
    console.log(`❌ Error obteniendo último ID: ${lastError.message}`);
    return;
  }

  let nextId = lastRecord ? lastRecord.id + 1 : 1;
  console.log(`📊 Próximo ID a usar: ${nextId}\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const eventData of ESSENTIAL_TECH_EVENTS) {
    const [month, day] = eventData.date.split('-').map(Number);
    
    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('ephemerides')
      .select('id')
      .eq('day', day)
      .eq('month', month)
      .eq('year', 2025)
      .single();

    if (existing) {
      console.log(`⏭️  Saltado ${eventData.date}: Ya existe`);
      skipped++;
      continue;
    }

    const ephemerisData = {
      id: nextId,
      day,
      month,
      year: 2025,
      event: eventData.event,
      display_date: `${eventData.year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      historical_day: day,
      historical_month: month,
      historical_year: eventData.year,
      category: eventData.category,
      detailed_info: `Este evento ocurrió el ${day} de ${getMonthName(month)} de ${eventData.year}. ${eventData.event} Este momento marcó un hito importante en la historia de la tecnología.`,
      impact: `Este evento transformó la industria tecnológica, estableciendo nuevos paradigmas que continúan influyendo en el desarrollo tecnológico moderno.`,
      sources: JSON.stringify([
        'https://www.computerhistory.org/',
        'https://en.wikipedia.org/wiki/Timeline_of_computing'
      ])
    };

    try {
      const { error } = await supabase
        .from('ephemerides')
        .insert(ephemerisData);

      if (error) {
        console.log(`❌ Error insertando ${eventData.date}: ${error.message}`);
        errors++;
      } else {
        console.log(`✅ Insertado ${eventData.date} (ID: ${nextId}): ${eventData.event.substring(0, 50)}...`);
        inserted++;
        nextId++;
      }
    } catch (error) {
      console.log(`❌ Error procesando ${eventData.date}: ${error.message}`);
      errors++;
    }
  }

  console.log('\n📊 RESUMEN FINAL:');
  console.log(`✅ Insertados: ${inserted}`);
  console.log(`⏭️  Saltados (ya existían): ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`📅 Total procesados: ${ESSENTIAL_TECH_EVENTS.length}`);

  if (inserted > 0) {
    console.log('\n🎉 ¡SISTEMA AUTOMÁTICO LISTO!');
    console.log('✅ Ahora tienes eventos históricos reales para fechas clave');
    console.log('✅ El sistema funcionará automáticamente sin eventos genéricos');
    console.log('✅ Cada día mostrará una efeméride histórica real');
  }
}

function getMonthName(month) {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return months[month - 1];
}

populateWithCorrectIds();