# GUARACA PESIFICATOR
### Intercambiador Galáctico de Divisas

Convertidor de monedas en tiempo real entre **Guaraníes Paraguayos (PYG)**, **Pesos Argentinos (ARS)** y **Dólares Estadounidenses (USD)**.

🌐 **Demo en vivo:** [lucasvicente-com-ar.github.io/guaraca-pesificator](https://lucasvicente-com-ar.github.io/guaraca-pesificator)

---

## ¿Qué hace?

- Convierte entre PYG, ARS y USD de forma bidireccional — editá cualquier campo y los demás se actualizan automáticamente
- Obtiene el tipo de cambio **PYG/USD** en tiempo real vía [exchangerate-api.com](https://exchangerate-api.com)
- Obtiene la cotización del **dólar blue ARS** en tiempo real vía [dolarapi.com](https://dolarapi.com)
- Formatea los Guaraníes con separador de miles mientras escribís (ej: `1.000.000`)
- Modo oscuro / claro con preferencia guardada en el navegador
- Instalable como app en Android e iPhone (PWA)

## Diseño

UI futurista con estética cyberpunk:
- Grilla animada de fondo
- Fuente [Orbitron](https://fonts.google.com/specimen/Orbitron)
- Efectos neon y glitch en los separadores de sección
- Glassmorphism en la card principal
- Brackets animados en las esquinas

## Tecnología

Un solo archivo `index.html` — sin frameworks, sin build step, sin dependencias npm.

| Recurso | Descripción |
|---|---|
| [Tailwind CDN](https://tailwindcss.com) | Estilos utilitarios |
| [Google Fonts – Orbitron](https://fonts.google.com) | Tipografía futurista |
| [dolarapi.com](https://dolarapi.com/v1/dolares/blue) | Cotización dólar blue ARS |
| [exchangerate-api.com](https://api.exchangerate-api.com/v4/latest/USD) | Tipo de cambio PYG/USD |

## Instalación como app

**Android (Chrome):** entrá a la URL → menú ⋮ → "Instalar app"  
**iPhone (Safari):** entrá a la URL → botón compartir → "Agregar a pantalla de inicio"

## Uso

Abrí `index.html` directamente en el browser. No requiere servidor ni instalación.

---

*by LV · made with iA and Brain*
