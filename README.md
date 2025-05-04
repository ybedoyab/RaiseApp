# RaiseApp

## Descripción del Proyecto
RaiseApp es una aplicación descentralizada (dApp) construida sobre la red Avalanche que permite a los usuarios interactuar con contratos inteligentes y realizar transacciones de manera segura y eficiente.

## Tecnologías Utilizadas
- **Frontend**: React.js con Vite
- **UI Framework**: Chakra UI
- **Web3**: 
  - ThirdWeb SDK
  - Web3-React
  - Ethers.js
- **Mapas**: Google Maps (react-google-maps)
- **Routing**: React Router DOM
- **Animaciones**: Framer Motion

## Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn
- MetaMask u otra wallet compatible con Avalanche
- Cuenta en la red Avalanche (para pruebas o producción)

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd RaiseApp
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
PRIVATE_KEY=[KEY DE LA WALLET]
AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
VITE_THIRDWEB_CLIENT_ID=[KEY DEL PROYECTO]
```

## Ejecución del Proyecto

### Desarrollo
```bash
npm run dev
# o
yarn dev
```
La aplicación estará disponible en `http://localhost:5173`

### Construcción para Producción
```bash
npm run build
# o
yarn build
```

### Vista Previa de Producción
```bash
npm run preview
# o
yarn preview
```

## Estructura del Proyecto
```
RaiseApp/
├── src/               # Código fuente de la aplicación
├── contracts/         # Contratos inteligentes
├── public/           # Archivos estáticos
├── node_modules/     # Dependencias
└── vite.config.js    # Configuración de Vite
```

## Integración con Avalanche
La aplicación está construida para interactuar con la red Avalanche, utilizando:
- Smart Contracts desplegados en la red Avalanche
- Integración con wallets a través de Web3-React
- Transacciones y llamadas a contratos mediante ThirdWeb SDK

## Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción
- `npm run lint`: Ejecuta el linter para verificar el código

## Contacto
softwareashen@gmail.com