import PropTypes from 'prop-types';
// Importa createContext para crear el contexto de configuración
import { createContext } from 'react';

// Importa la configuración por defecto del proyecto
import defaultConfig from 'config';
// Importa el hook personalizado para sincronizar configuración con localStorage
import useLocalStorage from 'hooks/useLocalStorage';

// Estado inicial del contexto, incluye la configuración por defecto y funciones vacías
const initialState = {
  ...defaultConfig,
  onChangeFontFamily: () => {},
  onChangeBorderRadius: () => {},
  onReset: () => {}
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

// Crea el contexto de configuración con el estado inicial
const ConfigContext = createContext(initialState);

// Componente proveedor del contexto de configuración
function ConfigProvider({ children }) {
  // Estado de configuración, sincronizado con localStorage
  const [config, setConfig] = useLocalStorage('berry-config-vite-ts', {
    fontFamily: initialState.fontFamily,
    borderRadius: initialState.borderRadius
  });

  // Cambia la fuente tipográfica y actualiza el estado
  const onChangeFontFamily = (fontFamily) => {
    setConfig({
      ...config,
      fontFamily
    });
  };

  // Cambia el radio de los bordes y actualiza el estado
  const onChangeBorderRadius = (event, newValue) => {
    setConfig({
      ...config,
      borderRadius: newValue
    });
  };

  // Restaura la configuración a los valores por defecto
  const onReset = () => {
    setConfig({ ...defaultConfig });
  };

  // Proporciona el estado y las funciones a los componentes hijos
  return (
    <ConfigContext.Provider
      value={{
        ...config,
        onChangeFontFamily,
        onChangeBorderRadius,
        onReset
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

// Exporta el proveedor y el contexto para su uso en la aplicación
export { ConfigProvider, ConfigContext };

// Define los tipos de las props para el proveedor
ConfigProvider.propTypes = { children: PropTypes.node };
