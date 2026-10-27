import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import '@ant-design/v5-patch-for-react-19';
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { ConfigProvider } from 'antd';

import es from 'antd/es/locale/es_ES';

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/* const globalBuddhistLocale: typeof es = {
  ...es,
  DatePicker: {
    ...enUS.DatePicker!,
    lang: buddhistLocale.lang,
  },
}; */

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ConfigProvider locale={es}>

        <RouterProvider router={router} />
      </ConfigProvider>

    </StrictMode>,
  )
}