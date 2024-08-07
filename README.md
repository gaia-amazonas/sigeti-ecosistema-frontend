# sigeti-ecosistema-frontend

**sigeti-ecosistema-frontend** es el ecosistema front-end para SIG, escrito con Next.js y consume datos con su API nativa haciendo consultas en BigQuery.

## Instrucciones para Desplegar la App con GCP Run

### Paso 1: Crear la Imagen Dockerizada para Publicar

Construye la imagen Docker con el siguiente comando:

```sh
docker build -t gcr.io/sigeti/sigeti-ecosistema-frontend:produccion --build-arg AMBIENTE=produccion .
```

### Paso 2: Probar Localmente

Para probar localmente la dockerización de la aplicación, ejecuta:

```sh
docker run -p 3000:3000 -e AMBIENTE=produccion gcr.io/sigeti/sigeti-ecosistema-frontend:produccion
```

### Paso 3: 

Empujar la imagen Docker a GCR

```sh
docker push gcr.io/sigeti/sigeti-ecosistema-frontend:produccion
```

### Paso 4: Crear un Servicio en GCP Run

Despliega la imagen Docker en Google Cloud Run con el siguiente comando:

```sh
gcloud run deploy sigeti-ecosistema-frontend \
  --image gcr.io/sigeti/sigeti-ecosistema-frontend:produccion \
  --region southamerica-east1 \
  --network frontend \
  --subnet frontend \
  --allow-unauthenticated \
  --min-instances 1 \
  --set-env-vars "AMBIENTE=produccion" \
  --vpc-egress=all-traffic
```

Siguiendo estos pasos, puedes construir, probar y desplegar la aplicación **sigeti-ecosistema-frontend** usando Google Cloud Run.