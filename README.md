# Mis Tratamientos — Medicity

Demo de hackathon (Farmaenlace / Connect Atventures) que ayuda a los pacientes a registrar tratamientos recurrentes, digitalizar recetas con IA y mantener la continuidad del tratamiento con recordatorios proactivos.

## Demo en vivo

**App desplegada:** [https://hackathon-connect-atventures.vercel.app](https://hackathon-connect-atventures.vercel.app)

| | |
|---|---|
| Repositorio | [ricardozuritadev/hackathon-connect-atventures](https://github.com/ricardozuritadev/hackathon-connect-atventures) |
| Experiencia recomendada | Móvil (Safari / Chrome) o vista responsive |
| Idioma de la UI | Español |

> Usa únicamente **recetas ficticias o sintéticas**. No cargues datos reales de pacientes.

---

## ¿Qué resuelve?

Muchos tratamientos crónicos se interrumpen porque el paciente olvida reponer el medicamento a tiempo. **Mis Tratamientos** propone un flujo dentro del ecosistema Medicity para:

1. Registrar el tratamiento a partir de la receta.
2. Confirmar instrucciones con revisión humana (la IA propone; el paciente valida).
3. Ver cobertura / copago y beneficios del programa.
4. Completar la compra.
5. Recibir un recordatorio de reposición (simulado por WhatsApp) para volver a comprar a tiempo.

---

## Recorrido de la demo (~3 minutos)

1. Inicio Medicity → **Mis tratamientos** → registrar tratamiento.
2. Perfil: toca un campo vacío para autocompletar datos de demo (no médicos).
3. Sube una imagen de receta → **Analizar** (OpenAI OCR real).
4. Confirma instrucciones (edita dosis/frecuencia si hace falta) → revisión médica → seguro.
5. Revisa cobertura y beneficios → entrega a domicilio → **Confirmar y pagar**.
6. Preferencias de recordatorio → **Finalizar**.
7. Tras ~15 s aparece la simulación de chat WhatsApp con el aviso de reposición.

---

## Qué es real y qué está simulado

| Real (producción-like) | Simulado (demo) |
|------------------------|-----------------|
| Subida y validación de imagen de receta | Consulta de cobertura de seguro |
| Extracción estructurada con OpenAI | Pago y fulfillment de entrega |
| Revisión/edición humana antes de continuar | Mensajería WhatsApp |
| Estado de sesión en el navegador (`sessionStorage`) | Catálogo / progreso de promoción PMF |

La simulación de WhatsApp **no** envía mensajes reales ni abre la app de WhatsApp: es una pantalla dentro del producto para el pitch.

---

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** · shadcn/ui · Zod
- **OpenAI** (`gpt-4.1-mini` por defecto) — Responses API + salida estructurada

---

## Desarrollo local

```bash
npm install
```

Crea `.env.local` en la raíz:

```env
OPENAI_API_KEY=tu_clave
OPENAI_MODEL=gpt-4.1-mini
```

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Variables de entorno

| Variable | Ámbito | Descripción |
|----------|--------|-------------|
| `OPENAI_API_KEY` | Servidor | Obligatoria para el OCR de recetas |
| `OPENAI_MODEL` | Servidor | Opcional; por defecto `gpt-4.1-mini` |

Nunca expongas la API key con prefijo `NEXT_PUBLIC_`.

### Scripts útiles

```bash
npm run lint
npm test
npx tsc --noEmit
npm run build
```

---

## Arquitectura (vista rápida)

```
Navegador (shell Medicity + flujos de tratamiento)
  ├─ Store de demo (sessionStorage)
  └─ POST /api/prescriptions/extract → validación → OpenAI → Zod
```

Rutas principales: `/`, `/treatments`, `/treatments/register/*`, `/treatments/[treatmentId]`, `/treatments/[treatmentId]/whatsapp`.

Documentación operativa para agentes de código: [`AGENTS.md`](./AGENTS.md).

---

## Equipo / hackathon

Proyecto construido para la presentación de **Connect Atventures** en el contexto Farmaenlace / Medicity.

**Demo pública para el jurado:** [https://hackathon-connect-atventures.vercel.app](https://hackathon-connect-atventures.vercel.app)
