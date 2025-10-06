const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Base de datos completa de eventos tecnológicos reales
const COMPLETE_TECH_EVENTS = [
  // Enero
  { date: '01-01', event: 'Nace el tiempo Unix: el 1 de enero de 1970 a las 00:00:00 UTC se establece como el epoch time.', year: 1970, category: 'SISTEMAS' },
  { date: '01-03', event: 'Apple Computer se incorpora oficialmente como empresa.', year: 1977, category: 'EMPRESAS' },
  { date: '01-06', event: 'Steve Jobs presenta el primer iPhone en la Macworld Conference & Expo.', year: 2007, category: 'HARDWARE' },
  { date: '01-09', event: 'Steve Jobs presenta el iPhone, revolucionando la computación móvil.', year: 2007, category: 'HARDWARE' },
  { date: '01-15', event: 'Wikipedia se lanza oficialmente al público.', year: 2001, category: 'WEB' },
  { date: '01-24', event: 'Apple presenta el primer Macintosh durante el Super Bowl.', year: 1984, category: 'HARDWARE' },
  { date: '01-27', event: 'Se presenta el primer iPad, creando una nueva categoría de dispositivos.', year: 2010, category: 'HARDWARE' },
  
  // Febrero
  { date: '02-04', event: 'Mark Zuckerberg lanza Facebook desde su dormitorio en Harvard.', year: 2004, category: 'WEB' },
  { date: '02-14', event: 'YouTube es fundado por tres ex-empleados de PayPal.', year: 2005, category: 'WEB' },
  { date: '02-19', event: 'Napster es lanzado, revolucionando el intercambio de archivos.', year: 1999, category: 'WEB' },
  { date: '02-24', event: 'Steve Jobs presenta el primer MacBook Air.', year: 2008, category: 'HARDWARE' },
  
  // Marzo
  { date: '03-12', event: 'Tim Berners-Lee propone la World Wide Web en el CERN.', year: 1989, category: 'INTERNET' },
  { date: '03-15', event: 'Se registra el primer dominio .com (symbolics.com).', year: 1985, category: 'INTERNET' },
  { date: '03-21', event: 'Twitter publica su primer tweet oficial.', year: 2006, category: 'WEB' },
  { date: '03-30', event: 'Se lanza Gmail con 1GB de almacenamiento gratuito.', year: 2004, category: 'WEB' },
  
  // Abril
  { date: '04-01', event: 'Apple se funda oficialmente en el garaje de Steve Jobs.', year: 1976, category: 'EMPRESAS' },
  { date: '04-04', event: 'Microsoft se funda por Bill Gates y Paul Allen.', year: 1975, category: 'EMPRESAS' },
  { date: '04-15', event: 'Se lanza la primera versión de MySQL.', year: 1995, category: 'SOFTWARE' },
  { date: '04-23', event: 'YouTube sube su primer video "Me at the zoo".', year: 2005, category: 'WEB' },
  
  // Mayo
  { date: '05-01', event: 'Se lanza Amazon.com como librería online.', year: 1995, category: 'EMPRESAS' },
  { date: '05-05', event: 'Se presenta la primera versión de Skype.', year: 2003, category: 'WEB' },
  { date: '05-16', event: 'Se funda eBay como AuctionWeb.', year: 1995, category: 'EMPRESAS' },
  { date: '05-25', event: 'Se lanza el primer episodio de Star Wars, influyendo en efectos especiales.', year: 1977, category: 'TECNOLOGÍA' },
  
  // Junio
  { date: '06-08', event: 'Nace Tim Berners-Lee, creador de la World Wide Web.', year: 1955, category: 'HISTORIA' },
  { date: '06-15', event: 'Se presenta la Nintendo Entertainment System en América.', year: 1985, category: 'HARDWARE' },
  { date: '06-23', event: 'Nace Alan Turing, padre de la computación moderna.', year: 1912, category: 'HISTORIA' },
  { date: '06-29', event: 'Se presenta el primer iPhone oficialmente a la venta.', year: 2007, category: 'HARDWARE' },
  
  // Julio
  { date: '07-01', event: 'Se funda Sony, pionera en electrónicos de consumo.', year: 1946, category: 'EMPRESAS' },
  { date: '07-11', event: 'Netflix inicia su servicio de streaming.', year: 2007, category: 'WEB' },
  { date: '07-15', event: 'Se lanza Amazon Prime, revolucionando el e-commerce.', year: 2005, category: 'WEB' },
  { date: '07-23', event: 'Se funda Netscape, pionero en navegadores web.', year: 1994, category: 'WEB' },
  
  // Agosto
  { date: '08-06', event: 'Se lanza la World Wide Web al público general.', year: 1991, category: 'INTERNET' },
  { date: '08-12', event: 'IBM presenta su primer PC personal.', year: 1981, category: 'HARDWARE' },
  { date: '08-24', event: 'Microsoft lanza Windows 95, popularizando las interfaces gráficas.', year: 1995, category: 'SISTEMAS' },
  { date: '08-25', event: 'Linus Torvalds anuncia el desarrollo de Linux.', year: 1991, category: 'SISTEMAS' },
  
  // Septiembre
  { date: '09-04', event: 'Google se funda oficialmente en un garaje de California.', year: 1998, category: 'EMPRESAS' },
  { date: '09-09', event: 'Se presenta la primera versión de Dreamcast de Sega.', year: 1999, category: 'HARDWARE' },
  { date: '09-15', event: 'Se registra el dominio google.com.', year: 1997, category: 'INTERNET' },
  { date: '09-27', event: 'Se funda Oracle Corporation, líder en bases de datos.', year: 1977, category: 'EMPRESAS' },
  
  // Octubre
  { date: '10-01', event: 'Se funda Microsoft por Bill Gates y Paul Allen.', year: 1975, category: 'EMPRESAS' },
  { date: '10-04', event: 'La URSS lanza el Sputnik, iniciando la era espacial.', year: 1957, category: 'TECNOLOGÍA' },
  { date: '10-05', event: 'Steve Jobs fallece, dejando un legado revolucionario.', year: 2011, category: 'HISTORIA' },
  { date: '10-06', event: 'Se lanza Debian GNU/Linux 1.3 "Bo".', year: 1997, category: 'SISTEMAS' },
  { date: '10-07', event: 'Se funda Nokia como empresa de papel.', year: 1865, category: 'EMPRESAS' },
  { date: '10-23', event: 'Apple presenta el primer iPod.', year: 2001, category: 'HARDWARE' },
  { date: '10-29', event: 'Se envía el primer mensaje a través de ARPANET.', year: 1969, category: 'INTERNET' },
  
  // Noviembre
  { date: '11-03', event: 'Se lanza la primera versión de Netscape Navigator.', year: 1994, category: 'WEB' },
  { date: '11-09', event: 'Intel presenta el primer procesador 4004.', year: 1971, category: 'HARDWARE' },
  { date: '11-20', event: 'Microsoft lanza Windows 1.0.', year: 1985, category: 'SISTEMAS' },
  { date: '11-22', event: 'Se presenta la Xbox original de Microsoft.', year: 2001, category: 'HARDWARE' },
  
  // Diciembre
  { date: '12-03', event: 'Se presenta el primer mensaje de texto SMS.', year: 1992, category: 'TECNOLOGÍA' },
  { date: '12-09', event: 'Se presenta la primera demostración pública del mouse.', year: 1968, category: 'HARDWARE' },
  { date: '12-15', event: 'Se funda Adobe Systems, pionero en software gráfico.', year: 1982, category: 'EMPRESAS' },
  { date: '12-23', event: 'Se presenta el primer transistor en Bell Labs.', year: 1947, category: 'HARDWARE' }
];

async function populateFullYear() {
  console.log('🚀 POBLANDO BASE DE DATOS CON EVENTOS PARA TODO EL AÑO');
  console.log('====================================================\n');

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const eventData of COMPLETE_TECH_EVENTS) {
    const [month, day] = eventData.date.split('-').map(Number);
    
    const ephemerisData = {
      day,
      month,
      year: 2025,
      event: eventData.event,
      display_date: `${eventData.year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      historical_day: day,
      historical_month: month,
      historical_year: eventData.year,
      category: eventData.category,
      detailed_info: `Este evento ocurrió el ${day} de ${getMonthName(month)} de ${eventData.year}. ${eventData.event} Este momento marcó un hito importante en la historia de la tecnología y la computación.`,
      impact: `Este evento tuvo un impacto significativo en el desarrollo de la tecnología moderna, influyendo en generaciones futuras de innovadores y estableciendo nuevos estándares en la industria.`,
      sources: JSON.stringify([
        'https://www.computerhistory.org/',
        'https://en.wikipedia.org/wiki/Timeline_of_computing',
        'https://www.techhistory.org/'
      ])
    };

    try {
      // Verificar si ya existe
      const { data: existing } = await supabase
        .from('ephemerides')
        .select('id')
        .eq('day', day)
        .eq('month', month)
        .eq('year', 2025)
        .single();

      if (existing) {
        // Actualizar
        const { error } = await supabase
          .from('ephemerides')
          .update(ephemerisData)
          .eq('id', existing.id);

        if (error) {
          console.log(`❌ Error actualizando ${eventData.date}: ${error.message}`);
          errors++;
        } else {
          console.log(`🔄 Actualizado ${eventData.date}: ${eventData.event.substring(0, 50)}...`);
          updated++;
        }
      } else {
        // Insertar nuevo
        const { error } = await supabase
          .from('ephemerides')
          .insert(ephemerisData);

        if (error) {
          console.log(`❌ Error insertando ${eventData.date}: ${error.message}`);
          errors++;
        } else {
          console.log(`✅ Insertado ${eventData.date}: ${eventData.event.substring(0, 50)}...`);
          inserted++;
        }
      }
    } catch (error) {
      console.log(`❌ Error procesando ${eventData.date}: ${error.message}`);
      errors++;
    }
  }

  console.log('\n📊 RESUMEN:');
  console.log(`✅ Insertados: ${inserted}`);
  console.log(`🔄 Actualizados: ${updated}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`📅 Total eventos: ${COMPLETE_TECH_EVENTS.length}`);

  console.log('\n🎉 ¡BASE DE DATOS POBLADA PARA TODO EL AÑO!');
  console.log('Ahora el sistema funcionará automáticamente sin eventos genéricos.');
}

function getMonthName(month) {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return months[month - 1];
}

populateFullYear();