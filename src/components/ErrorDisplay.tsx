import React from 'react'
import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react'

interface ErrorBoundaryProps {
  error: string | null
  onRetry?: () => void
  showDetails?: boolean
}

export const ErrorDisplay: React.FC<ErrorBoundaryProps> = ({ 
  error, 
  onRetry, 
  showDetails = false 
}) => {
  // Hide all error displays
  return null
  
  if (!error) return null

  const getErrorType = (errorMessage: string) => {
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
      return {
        type: 'network',
        title: 'Masalah Koneksi',
        description: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        suggestions: [
          'Periksa koneksi internet',
          'Coba refresh halaman',
          'Hubungi administrator jika masalah berlanjut'
        ]
      }
    }
    
    if (errorMessage.includes('JWT') || errorMessage.includes('auth')) {
      return {
        type: 'auth',
        title: 'Masalah Autentikasi',
        description: 'Sesi login Anda bermasalah atau sudah berakhir.',
        suggestions: [
          'Silakan login ulang',
          'Hapus cache browser',
          'Hubungi administrator jika masalah berlanjut'
        ]
      }
    }
    
    if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
      return {
        type: 'database',
        title: 'Masalah Database',
        description: 'Tabel database tidak ditemukan atau belum diinisialisasi.',
        suggestions: [
          'Hubungi administrator sistem',
          'Database mungkin perlu diinisialisasi',
          'Periksa konfigurasi database'
        ]
      }
    }
    
    if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
      return {
        type: 'permission',
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki izin untuk mengakses data ini.',
        suggestions: [
          'Hubungi administrator untuk mendapatkan akses',
          'Periksa role dan permission akun Anda',
          'Login dengan akun yang memiliki akses'
        ]
      }
    }
    
    return {
      type: 'unknown',
      title: 'Terjadi Kesalahan',
      description: errorMessage,
      suggestions: [
        'Coba refresh halaman',
        'Hubungi administrator jika masalah berlanjut',
        'Periksa console browser untuk detail lebih lanjut'
      ]
    }
  }

  const errorInfo = getErrorType(error)

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-start">
        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            {errorInfo.title}
          </h3>
          <p className="text-red-700 mb-4">
            {errorInfo.description}
          </p>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">Saran Penyelesaian:</h4>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {errorInfo.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          
          {showDetails && (
            <details className="mb-4">
              <summary className="text-sm font-medium text-red-800 cursor-pointer">
                Detail Error
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-x-auto">
                {error}
              </pre>
            </details>
          )}
          
          <div className="flex items-center space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Coba Lagi
              </button>
            )}
            
            {errorInfo.type === 'network' && (
              <a
                href="https://downdetector.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Cek Status Server
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Memuat data...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600 mx-auto mb-2`} />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  action,
  icon 
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}