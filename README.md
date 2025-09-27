# 🚀 Sistema de Efemérides de Programación con IA

Un sistema automatizado que genera efemérides diarias sobre programación y tecnología usando inteligencia artificial y las almacena en Supabase.

## ✨ Características

- 🤖 **Generación automática con IA** de efemérides diarias
- 🗄️ **Base de datos Supabase** para almacenamiento persistente
- ⏰ **Cron job diario** que se ejecuta automáticamente
- 📅 **Verificación de fechas** para asegurar precisión histórica
- 🎨 **Interfaz terminal** con tema retro
- 🔒 **Sistema de autenticación** completo
- 📊 **API REST** para gestión de efemérides

## 🛠️ Tecnologías

- **Frontend:** Next.js 14, React, TypeScript
- **Estilos:** Tailwind CSS, Radix UI
- **Base de datos:** Supabase (PostgreSQL)
- **IA:** Sistema de generación inteligente
- **Despliegue:** Vercel con cron jobs
- **Autenticación:** Supabase Auth

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/CristopherG19/programming-ephemeris.git
cd programming-ephemeris
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# Cron Job Security
CRON_SECRET=tu_clave_secreta_para_cron
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

## 📋 Configuración de Base de Datos

### Estructura de la tabla `ephemerides`:
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

## 🔧 API Endpoints

### Obtener efeméride de hoy
```bash
GET /api/generate-ephemeris
```

### Generar efeméride de mañana
```bash
POST /api/generate-ephemeris
Content-Type: application/json

{
  "action": "tomorrow"
}
```

### Generar efeméride para fecha específica
```bash
POST /api/generate-ephemeris
Content-Type: application/json

{
  "action": "specific",
  "date": "2024-01-15"
}
```

## ⏰ Cron Job Automático

El sistema incluye un cron job que se ejecuta diariamente a las 00:01 para generar automáticamente la efeméride del día siguiente.

### Configuración en Vercel:
El archivo `vercel.json` ya está configurado para el cron job automático.

## 🎯 Funcionalidades

### Generación Inteligente
- ✅ **Base de datos histórica** con efemérides verificadas
- ✅ **Generación con IA** para fechas sin datos históricos
- ✅ **Verificación de duplicados** para evitar repeticiones
- ✅ **Precisión de fechas** para asegurar corrección histórica

### Interfaz de Usuario
- 🖥️ **Diseño terminal** con tema retro
- ⏱️ **Reloj en tiempo real**
- 📊 **Estadísticas del sistema**
- 🔄 **Botones de control** para generación manual

### Seguridad
- 🔐 **Autenticación** con Supabase
- 🛡️ **Protección de endpoints** con CRON_SECRET
- 🔒 **Variables de entorno** seguras

## 📚 Documentación

- [README de Supabase](README-SUPABASE.md) - Configuración de base de datos
- [README de IA](README-AI-EPHEMERIS.md) - Sistema de generación automática

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. El cron job se ejecutará automáticamente

### Variables de entorno requeridas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Cristopher Gutierrez**
- Email: cgch_1996@hotmail.com
- GitHub: [@CristopherG19](https://github.com/CristopherG19)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework de React
- [Supabase](https://supabase.com/) - Base de datos y autenticación
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes de UI
- [Vercel](https://vercel.com/) - Plataforma de despliegue

---

⭐ ¡Si te gusta este proyecto, no olvides darle una estrella!
