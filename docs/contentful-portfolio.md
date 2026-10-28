# Configurar el portafolio en Contentful

La web utiliza un solo Content type con API ID `projects`. No necesita categorías ni tipos de servicio como entradas independientes. Las cuatro categorías son opciones del campo `category`.

## 1. Seleccionar el espacio y entorno

Abre tu espacio de Contentful y selecciona el entorno que usa la web (`master` por defecto). Entra en **Content model**.

Si ya existe un modelo con API ID `projects`, ábrelo y añade los campos que falten. Usa el modelo existente con ID `projects`. No borres entradas ni modelos anteriores. Los campos antiguos `title`, `slug`, `summary` y `serviceType` ya no los lee esta galería: pueden conservarse, pero deben dejar de ser obligatorios al cargar proyectos nuevos. Los proyectos antiguos necesitan los nuevos campos para aparecer.

## 2. Crear el modelo y los campos

Si no existe: **Add content type**, nombre **Project**, API ID **projects**. Los IDs de los campos deben coincidir exactamente, incluidas las mayúsculas.

| Nombre visible | Field ID | Tipo | Obligatorio | Traducible |
| --- | --- | --- | --- | --- |
| Project name | `projectName` | Text → Short text | Sí | Sí |
| Category | `category` | Text → Short text, un solo valor | Sí | No |
| Before image | `beforeImage` | Media → One file, solo imágenes | Sí | No |
| After image | `afterImage` | Media → One file, solo imágenes | Sí | No |
| Description | `description` | Text → Long text, texto plano | Sí | Sí |
| Gallery | `gallery` | Media → Many files, solo imágenes | No | No |
| Location | `location` | Text → Short text | No | No |
| Featured | `featured` | Boolean, predeterminado No | No | No |
| Order | `order` | Number → Integer, mínimo 0, predeterminado 0 | No | No |

En `category`, limita los valores permitidos a estos cuatro, exactamente en minúsculas:

```text
repairs
installation
maintenance
assembly
```

Configura su apariencia como **Dropdown**. La web traduce automáticamente las etiquetas al español o al inglés. No escribas `Repairs` ni `Reparaciones` como valor almacenado.

Usa `projectName` como título de las entradas (display field). Guarda el modelo.

Si un campo existente tiene un tipo incompatible, no lo borres: hay que revisar su contenido antes de decidir cómo migrarlo. El archivo `contentful-project-model.json` sirve como especificación del modelo esperado; no es un comando de importación ni modifica el espacio.

Referencia de los [tipos de campos](https://www.contentful.com/help/fields/) y su [configuración](https://www.contentful.com/help/fields/configure-a-field/).

## 3. Configurar los idiomas

En **Settings → Locales**, verifica que existan `en-US` y `es-MX` y estén habilitados para la API. La web solicita esos códigos exactos. Configura `es-MX` para usar `en-US` como fallback cuando no haya traducción.

Activa la localización en `projectName` y `description`. Comparte las fotos, categoría, ubicación y orden entre idiomas. No hace falta duplicar las entradas. Si `en-US` no es el idioma predeterminado del espacio, revisamos la configuración antes de cambiarla.

Referencia: [localización y fallbacks](https://www.contentful.com/developers/docs/tutorials/general/setting-locales/).

## 4. Publicar el primer trabajo

En **Content → Add entry → Project**, completa por ejemplo:

- Project name (en-US): `Drywall repair in South Austin`.
- Project name (es-MX): `Reparación de pared en South Austin`.
- Category: `repairs`.
- Before image: fotografía real del daño.
- After image: fotografía real del resultado. También será la portada de la tarjeta.
- Description: problema y solución, en ambos idiomas.
- Location: `South Austin`, sin dirección particular.
- Featured: Yes si quieres mostrarlo primero dentro de su categoría.
- Order: `1`. Los números menores aparecen primero; los destacados preceden a los demás.

`gallery` es opcional y conserva el orden de las fotos que elijas. Añade descripciones a las imágenes para accesibilidad. Para el comparador, usa fotos del antes y después desde el mismo ángulo y con proporciones similares. La comparación muestra las imágenes completas; las portadas de las tarjetas se recortan a 4:3.

Publica las imágenes y después la entrada. Los borradores o proyectos sin nombre, descripción, categoría válida y ambas imágenes publicadas no aparecen. Si Repairs no tiene entradas, verás un estado vacío; no se muestran trabajos ficticios.

## 5. Conectar la web

En **Settings → API keys**, usa una clave de **Content Delivery API**. En `.env.local` y, al desplegar, en las variables del proyecto de Vercel:

```env
CONTENTFUL_SPACE_ID=tu_space_id
CONTENTFUL_ACCESS_TOKEN=tu_content_delivery_api_access_token
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_WEBHOOK_SECRET=un_secreto_aleatorio
```

No uses el Preview token ni el Management token. No añadas el prefijo `NEXT_PUBLIC_` ni pegues tokens en el chat. Reinicia el servidor local tras editar las variables; vuelve a desplegar en Vercel si cambias sus variables.

## 6. Actualizar la web al publicar

En **Settings → Webhooks**, crea un webhook:

- URL: `https://www.santihandy.com/api/contentful/revalidate`.
- Método: `POST`.
- Cabecera: `x-contentful-webhook-secret`, con el mismo valor que `CONTENTFUL_WEBHOOK_SECRET`.
- Eventos: publicar, despublicar y borrar Entries y Assets.
- Filtro de entorno: el que usa la web, normalmente `master`.

El endpoint invalida la caché de Contentful y las páginas. La revalidación usa stale-while-revalidate: la primera visita puede mostrar el contenido anterior mientras se actualiza. Sin webhook, la caché se revalida después de 24 horas.

## 7. Verificar

Abre `/en#services` y `/es#services`. Elige Repairs, abre la tarjeta y comprueba el comparador, las fotos adicionales y el texto. Cierra con el botón, Escape o pulsando fuera del modal. Con teclado, Tab permanece dentro del modal y el deslizador se mueve con las flechas. “Solicitar un trabajo similar” cierra el modal y rellena la categoría y una referencia al proyecto en el formulario, sin enviar nada.
