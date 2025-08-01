import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Login } from './components/Login'
import { Dashboard } from './components/Dashboard'
import { BudgetManagement } from './components/BudgetManagement'
import { Reports } from './components/Reports'
import { UserManagement } from './components/UserManagement'
import { SystemSettings } from './components/SystemSettings'
import { Analytics } from './components/Analytics'
import { DocumentManagement } from './components/DocumentManagement'
import { EventManagement } from './components/EventManagement'
import { NotificationCenter } from './components/NotificationCenter'
import { StudentManagement } from './components/StudentManagement'
import { InventoryManagement } from './components/InventoryManagement'
import { DatabaseManagement } from './components/DatabaseManagement'
import { MasterDataManagement } from './components/MasterDataManagement'
import { FilterOptions } from './types/database'

function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    tahun: new Date().getFullYear(),
    periode: 'bulanan'
  })

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route 
                          path="/" 
                          element={
                            <Dashboard 
                              filters={filters} 
                              onFiltersChange={setFilters} 
                            />
                          } 
                        />
                        <Route 
                          path="/rkas" 
                          element={
                            <BudgetManagement 
                              filters={filters} 
                              onFiltersChange={setFilters} 
                            />
                          } 
                        />
                        <Route 
                          path="/reports" 
                          element={
                            <Reports 
                              filters={filters} 
                              onFiltersChange={setFilters} 
                            />
                          } 
                        />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/students" element={<StudentManagement />} />
                        <Route path="/inventory" element={<InventoryManagement />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/documents" element={<DocumentManagement />} />
                        <Route path="/events" element={<EventManagement />} />
                        <Route path="/notifications" element={<NotificationCenter />} />
                        <Route path="/database" element={<DatabaseManagement />} />
                        <Route path="/master-data" element={<MasterDataManagement />} />
                        <Route path="/settings" element={<SystemSettings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  )
}

export default App

