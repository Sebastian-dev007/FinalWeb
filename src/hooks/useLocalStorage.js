import { useState, useEffect } from 'react';

// ==============================|| HOOKS - LOCAL STORAGE ||============================== //

/**
 * Hook personalizado para sincronizar un estado de React con localStorage.
 * Permite leer, actualizar y escuchar cambios en una clave específica de localStorage.
 *
 * @param {string} key - La clave de localStorage a utilizar.
 * @param {*} defaultValue - El valor por defecto si no existe nada en localStorage.
 * @returns {[any, Function]} - Retorna el valor actual y una función para actualizarlo.
 */
export default function useLocalStorage(key, defaultValue) {
  // Estado local que se inicializa con el valor de localStorage o el valor por defecto
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    // Si no hay valor guardado, retorna el valor por defecto
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  // Efecto para escuchar cambios en localStorage desde otras pestañas/ventanas
  useEffect(() => {
    const listener = (e) => {
      // Solo responde si el cambio es en la clave y storage correctos
      if (e.storageArea === localStorage && e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
      }
    };
    window.addEventListener('storage', listener);

    // Limpia el listener al desmontar el componente o cambiar la clave
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue]);

  /**
   * Actualiza el valor tanto en el estado local como en localStorage.
   * Permite pasar un valor directo o una función que recibe el valor actual.
   */
  const setValueInLocalStorage = (newValue) => {
    setValue((currentValue) => {
      const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  // Retorna el valor actual y la función para actualizarlo
  return [value, setValueInLocalStorage];
}