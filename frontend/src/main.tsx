import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { App } from './App'
import './styles.css'
import './language.css'
import './chat.css'

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } })
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={queryClient}><LanguageProvider><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></LanguageProvider></QueryClientProvider></React.StrictMode>)
