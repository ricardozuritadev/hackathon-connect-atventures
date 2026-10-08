# Mis Tratamientos — Phase 1

POC de digitalización de recetas médicas con OpenAI.

**Importante:** usa únicamente recetas ficticias o sintéticas. No cargues datos reales de pacientes.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Zod
- OpenAI (`openai`, modelo `gpt-4.1-mini`)

## Configuración

1. Copia las variables de entorno:

```bash
cp .env.example .env.local
```

2. Obtén una API key en [OpenAI Platform](https://platform.openai.com/api-keys) y completa:

```env
OPENAI_API_KEY=tu_clave
OPENAI_MODEL=gpt-4.1-mini
```

3. Instala dependencias y arranca:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000/prescriptions/extract](http://localhost:3000/prescriptions/extract).

## Variables en Vercel

Configura en el proyecto de Vercel (Settings → Environment Variables):

| Variable | Público | Descripción |
|----------|---------|-------------|
| `OPENAI_API_KEY` | No | Clave del OpenAI API |
| `OPENAI_MODEL` | No | Modelo multimodal (p. ej. `gpt-4.1-mini`) |

Nunca uses el prefijo `NEXT_PUBLIC_` para la clave.

## Flujo

1. Sube una imagen JPEG, PNG o WebP (máx. 5 MB).
2. Pulsa **Analizar receta**.
3. Revisa y corrige los datos extraídos antes de continuar.

La extracción es una propuesta de IA y requiere verificación humana.
