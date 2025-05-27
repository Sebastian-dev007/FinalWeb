import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// Estado inicial del menú, define qué ítems y componentes están abiertos y el estado de los drawers
const initialState = {
  openedItem: 'dashboard',            // Ítem principal abierto por defecto
  openedComponent: 'buttons',         // Componente abierto por defecto
  openedHorizontalItem: null,         // Ítem horizontal abierto (si aplica)
  isDashboardDrawerOpened: false,     // Drawer del dashboard cerrado por defecto
  isComponentDrawerOpened: true       // Drawer de componentes abierto por defecto
};

// Endpoints utilizados para las claves de SWR y rutas del servidor
export const endpoints = {
  key: 'api/menu',            // Prefijo clave para SWR
  master: 'master',           // Sufijo para el estado principal del menú
  dashboard: '/dashboard'     // Ruta del dashboard (no usada directamente aquí)
};

/**
 * Hook para obtener el estado maestro del menú usando SWR.
 * Devuelve el estado actual del menú y si está cargando.
 */
export function useGetMenuMaster() {
  // Obtiene los datos del menú usando SWR, sin revalidaciones automáticas
  const { data, isLoading } = useSWR(
    endpoints.key + endpoints.master,
    () => initialState,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  // Memoiza el valor retornado para evitar renders innecesarios
  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

/**
 * Actualiza el estado del drawer del dashboard (abierto/cerrado) en el menú.
 * @param {boolean} isDashboardDrawerOpened - Nuevo estado del drawer
 */
export function handlerDrawerOpen(isDashboardDrawerOpened) {
  // Actualiza el estado local de SWR para el menú master
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}

/**
 * Actualiza el ítem activo del menú.
 * @param {string} openedItem - Nuevo ítem abierto
 */
export function handlerActiveItem(openedItem) {
  // Actualiza el estado local de SWR para el menú master
  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, openedItem };
    },
    false
  );
}
