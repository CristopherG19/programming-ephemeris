const fs = require('fs');
const path = require('path');

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cron Secret for daily ephemeris generation
CRON_SECRET=6a25c0522478fe35e4bb5b717f37b060a11b269eb896f1bae65239eb8a7906b1
`;

const envPath = path.join(__dirname, '..', '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env.local creado exitosamente');
  console.log('📝 Por favor, actualiza las credenciales de Supabase en .env.local');
  console.log('🔗 Ve a tu proyecto de Supabase > Settings > API para obtener las credenciales');
} catch (error) {
  console.error('❌ Error creando .env.local:', error.message);
}
