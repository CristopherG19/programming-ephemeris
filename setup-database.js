const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🔧 CONFIGURANDO BASE DE DATOS SUPABASE');
  console.log('=====================================\n');

  // 1. Verificar si la tabla existe
  console.log('1️⃣ VERIFICANDO ESTRUCTURA ACTUAL:');
  try {
    const { data, error } = await supabase
      .from('ephemerides')
      .select('*')
      .limit(1);

    if (error) {
      console.log(`Error: ${error.message}`);
      if (error.message.includes('does not exist')) {
        console.log('📋 La tabla no existe, la crearemos...');
        await createTable();
        return;
      }
    } else {
      console.log('✅ La tabla existe');
      if (data && data.length > 0) {
        console.log('📊 Columnas existentes:', Object.keys(data[0]));
      }
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  // 2. Crear/actualizar estructura
  await updateTableStructure();

  // 3. Insertar datos iniciales
  await insertInitialData();
}

async function createTable() {
  console.log('\n2️⃣ CREANDO TABLA EPHEMERIDES:');
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS ephemerides (
      id SERIAL PRIMARY KEY,
      day INTEGER NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      event TEXT NOT NULL,
      display_date TEXT NOT NULL,
      historical_day INTEGER NOT NULL,
      historical_month INTEGER NOT NULL,
      historical_year INTEGER NOT NULL,
      detailed_info TEXT,
      impact TEXT,
      category TEXT,
      sources TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (error) {
      console.log(`❌ Error creando tabla: ${error.message}`);
    } else {
      console.log('✅ Tabla creada exitosamente');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function updateTableStructure() {
  console.log('\n3️⃣ ACTUALIZANDO ESTRUCTURA DE TABLA:');
  
  const alterCommands = [
    "ALTER TABLE ephemerides ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();",
    "ALTER TABLE ephemerides ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();",
    "ALTER TABLE ephemerides ADD COLUMN IF NOT EXISTS detailed_info TEXT;",
    "ALTER TABLE ephemerides ADD COLUMN IF NOT EXISTS impact TEXT;",
    "ALTER TABLE ephemerides ADD COLUMN IF NOT EXISTS category TEXT;",
    "ALTER TABLE ephemerides ADD COLUMN IF NOT EXISTS sources TEXT;"
  ];

  for (const command of alterCommands) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: command });
      if (error && !error.message.includes('already exists')) {
        console.log(`❌ Error: ${error.message}`);
      } else {
        console.log('✅ Columna agregada/verificada');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

async function insertInitialData() {
  console.log('\n4️⃣ INSERTANDO DATOS INICIALES:');
  
  const initialData = [
    {
      day: 6,
      month: 10,
      year: 2025,
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
        'https://www.internethalloffame.org/internet-history/birth-internet'
      ])
    },
    {
      day: 9,
      month: 1,
      year: 2007,
      event: 'Steve Jobs presenta el iPhone en la Macworld Conference & Expo, revolucionando la computación móvil.',
      display_date: '2007-01-09',
      historical_day: 9,
      historical_month: 1,
      historical_year: 2007,
      category: 'HARDWARE',
      detailed_info: 'Steve Jobs presentó el iPhone como "tres productos revolucionarios en uno": un iPod con pantalla táctil, un teléfono móvil revolucionario y un dispositivo de comunicación por Internet. Esta presentación cambió para siempre la industria de los smartphones.',
      impact: 'El iPhone redefinió lo que significaba un teléfono inteligente, estableciendo nuevos estándares para interfaces táctiles, aplicaciones móviles y conectividad, influenciando toda la industria tecnológica.',
      sources: JSON.stringify([
        'https://www.apple.com/newsroom/',
        'https://www.macworld.com/'
      ])
    }
  ];

  for (const data of initialData) {
    try {
      const { error } = await supabase
        .from('ephemerides')
        .upsert(data, { onConflict: 'day,month,year' });

      if (error) {
        console.log(`❌ Error insertando datos: ${error.message}`);
      } else {
        console.log(`✅ Datos insertados: ${data.event.substring(0, 50)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

setupDatabase();