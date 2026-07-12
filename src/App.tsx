import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'

function App() {
  return (
    <QueryProvider>
      <ToastProvider>{null}</ToastProvider>
    </QueryProvider>
  )
}

export default App
