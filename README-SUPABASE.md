# Integración de Supabase

## Configuración Inicial

### 1. Crear proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y las claves API

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### 3. Archivos creados
- `lib/supabase.ts` - Cliente de Supabase
- `lib/auth.ts` - Funciones de autenticación
- `components/auth-provider.tsx` - Contexto de autenticación
- `components/supabase-test.tsx` - Componente para probar conexión

## Uso

### Autenticación
```tsx
import { useAuth } from '@/components/auth-provider'

function MyComponent() {
  const { user, signIn, signOut } = useAuth()
  
  // Usar las funciones de autenticación
}
```

### Base de datos
```tsx
import { supabase } from '@/lib/supabase'

// Obtener datos
const { data, error } = await supabase
  .from('mi_tabla')
  .select('*')

// Insertar datos
const { data, error } = await supabase
  .from('mi_tabla')
  .insert({ campo: 'valor' })
```

## Próximos pasos
1. Configura las variables de entorno
2. Prueba la conexión con el componente SupabaseTest
3. Crea las tablas necesarias en Supabase
4. Implementa las funcionalidades específicas de tu app
