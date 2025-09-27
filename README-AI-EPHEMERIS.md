# Sistema de Generación Automática de Efemérides con IA

## 🚀 Características

- **Generación automática diaria** de efemérides usando IA
- **Base de datos Supabase** para almacenamiento persistente
- **Cron job** que se ejecuta diariamente a las 00:01
- **Verificación de fechas** para asegurar precisión histórica
- **API REST** para gestión de efemérides

## 📋 Configuración

### 1. Variables de Entorno

Asegúrate de tener estas variables en tu `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# Cron Job Security
CRON_SECRET=tu_clave_secreta_para_cron
```

### 2. Estructura de Base de Datos

La tabla `ephemerides` debe tener esta estructura:

```sql
CREATE TABLE ephemerides (
  id SERIAL PRIMARY KEY,
  day INTEGER NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  event TEXT NOT NULL,
  display_date DATE NOT NULL,
  historical_day INTEGER NOT NULL,
  historical_month INTEGER NOT NULL,
  historical_year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Despliegue en Vercel

1. **Conecta tu repositorio** a Vercel
2. **Configura las variables de entorno** en el dashboard de Vercel
3. **El cron job se ejecutará automáticamente** usando `vercel.json`

## 🔧 Uso del Sistema

### API Endpoints

#### Obtener efeméride de hoy
```bash
GET /api/generate-ephemeris
```

#### Generar efeméride de mañana
```bash
POST /api/generate-ephemeris
Content-Type: application/json

{
  "action": "tomorrow"
}
```

#### Generar efeméride para fecha específica
```bash
POST /api/generate-ephemeris
Content-Type: application/json

{
  "action": "specific",
  "date": "2024-01-15"
}
```

#### Cron job (automático)
```bash
GET /api/cron/generate-daily-ephemeris
Authorization: Bearer tu_clave_secreta_para_cron
```

### Funcionalidades

1. **Verificación de duplicados**: No genera efemérides duplicadas
2. **Base de datos histórica**: Usa efemérides verificadas cuando están disponibles
3. **Generación con IA**: Crea nuevas efemérides cuando no hay datos históricos
4. **Precisión de fechas**: Asegura que las fechas sean correctas

## 🎯 Flujo de Trabajo Diario

1. **00:01** - Cron job se ejecuta automáticamente
2. **Verifica** si existe efeméride para mañana
3. **Genera** efeméride si no existe
4. **Inserta** en Supabase
5. **Registra** el proceso en logs

## 🔍 Verificación de Datos

El sistema incluye:
- **Efemérides históricas verificadas** para fechas importantes
- **Validación de fechas** para evitar errores
- **Logs detallados** para monitoreo
- **Manejo de errores** robusto

## 📊 Monitoreo

Para verificar que el sistema funciona:

1. **Revisa los logs** de Vercel
2. **Verifica la base de datos** en Supabase
3. **Usa la interfaz web** para generar efemérides manualmente
4. **Comprueba las fechas** generadas

## 🛠️ Desarrollo Local

Para probar localmente:

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local

# Ejecutar servidor de desarrollo
npm run dev

# Probar generación manual
curl -X POST http://localhost:3000/api/generate-ephemeris \
  -H "Content-Type: application/json" \
  -d '{"action": "tomorrow"}'
```

## 🚨 Solución de Problemas

### Error de conexión a Supabase
- Verifica las variables de entorno
- Comprueba que la tabla existe
- Revisa los permisos de la base de datos

### Cron job no se ejecuta
- Verifica la configuración en Vercel
- Comprueba las variables de entorno
- Revisa los logs de Vercel

### Efemérides no se generan
- Verifica la conexión a Supabase
- Comprueba los logs de la API
- Revisa la estructura de la base de datos

## 📈 Próximas Mejoras

- [ ] Integración con APIs de IA reales (OpenAI, Claude)
- [ ] Categorización automática de efemérides
- [ ] Sistema de moderación de contenido
- [ ] Estadísticas de uso
- [ ] API de búsqueda avanzada
- [ ] Exportación de datos
