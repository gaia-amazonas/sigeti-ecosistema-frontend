# sigeti-ecosistema-frontend

**sigeti-ecosistema-frontend** es el ecosistema front-end para SIG, escrito en React, que consume datos desde la API (sigeti-api).

## Instrucciones para Desplegar la App con GCP Run

### Paso 1: Crear la Imagen Dockerizada para Publicar

Construye la imagen Docker con el siguiente comando:

```sh
docker build -t gcr.io/sigeti/sigeti-ecosistema-frontend:production --build-arg ENV=production --build-arg GOOGLE_APPLICATION_CREDENTIALS_JSON=/secrets/sigeti-dee63dd3ec66.json .
```

### Paso 2: Probar Localmente

Para probar la aplicación localmente, ejecuta:

```sh
docker run -p 3000:3000 -e ENV=production -e GOOGLE_APPLICATION_CREDENTIALS=/secrets/sigeti-dee63dd3ec66.json gcr.io/sigeti/sigeti-ecosistema-frontend:production
```

### Paso 3: Crear un Servicio en GCP Run

Despliega la imagen Docker en Google Cloud Run con el siguiente comando:

```sh
gcloud run deploy sigeti-ecosistema-frontend \
  --image gcr.io/YOUR_PROJECT_ID/sigeti-ecosistema-frontend:production \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated
```

### Paso 4: Desplegar la Imagen en el Servicio GCP Run con Secretos

Despliega la imagen en el servicio Google Cloud Run, asegurándote de configurar correctamente las variables de entorno:

```sh
gcloud run deploy sigeti-ecosistema-frontend \
  --image gcr.io/sigeti/sigeti-ecosistema-frontend:production \
  --platform managed \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars "ENV=production,GOOGLE_APPLICATION_CREDENTIALS=/secrets/sigeti-dee63dd3ec66.json"
```

---

Siguiendo estos pasos, puedes construir, probar y desplegar la aplicación **sigeti-ecosistema-frontend** usando Google Cloud Run.