import { GestionDocumental, FilaGestionDocumental } from 'components/mapas/tipos';

export const organizaDocumentacionPorFecha = (gestionDocumental: GestionDocumental) => {
  gestionDocumental.rows.sort((row_a: FilaGestionDocumental, row_b: FilaGestionDocumental) => row_a.FECHA_INICIO.value.localeCompare(row_b.FECHA_INICIO.value));
};