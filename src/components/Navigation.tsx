import React from 'react'
import { 
  Database, 
  Settings, 
  FileText, 
  Users, 
  BarChart3,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  TrendingUp
} from 'lucide-react'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<any>
  path?: string
  children?: NavigationItem[]
  badge?: number
}

interface SidebarNavigationProps {
  isOpen: boolean
  onToggle: () => void
  activeItem: string
  onItemClick: (itemId: string) => void
  className?: string
  isMobile?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    path: '/dashboard'
  },
  {
    id: 'budget-management',
    label: 'Manajemen R-KAS',
    icon: FileText,
    path: '/budget'
  },
  {
    id: 'kertas-kerja',
    label: 'Kertas Kerja Perubahan',
    icon: TrendingUp,
    path: '/kertas-kerja'
  },
  {
    id: 'database-management',
    label: 'Database Management',
    icon: Database,
    path: '/database'
  },
  {
    id: 'master-data',
    label: 'Master Data Management',
    icon: Settings,
    path: '/master-data'
  }
]

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isOpen,
  onToggle,
  activeItem,
  onItemClick,
  className = '',
  isMobile = false
}) => {

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = activeItem === item.id || 
                    (item.id === 'budget-management' && activeItem === 'budget') ||
                    (item.id === 'database-management' && activeItem === 'database') ||
                    (item.id === 'master-data' && activeItem === 'master-data') ||
                    (item.id === 'kertas-kerja' && activeItem === 'kertas-kerja')
    const IconComponent = item.icon

    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => onItemClick(item.id)}
          className={`
            w-full flex items-center ${isOpen ? 'px-3 py-2' : 'px-2 py-3 justify-center'} text-left rounded-lg transition-all duration-200 relative group
            ${level > 0 ? 'ml-4 text-sm' : 'text-base'}
            ${isActive 
              ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-500 shadow-sm' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
          title={!isOpen ? item.label : ''}
        >
          <IconComponent className={`${level > 0 ? 'w-4 h-4' : 'w-5 h-5'} ${isOpen ? 'mr-3' : ''} flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
          
          {isOpen && (
            <>
              <span className="flex-1 truncate font-medium">{item.label}</span>
              
              {item.badge && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </>
          )}
          
          {/* Tooltip for collapsed sidebar */}
          {!isOpen && !isMobile && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.label}
            </div>
          )}
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl z-[200] transition-all duration-300 ease-in-out border-r border-gray-200
        ${isOpen ? 'w-64' : isMobile ? 'w-0' : 'w-16'}
        ${isMobile && !isOpen ? 'overflow-hidden' : ''}
        ${className}
      `}>
        {/* Header */}
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4 border-b border-gray-200`}>
          {isOpen ? (
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">R-KAS</h1>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          )}
          
          {isOpen && (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Sembunyikan Menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {navigationItems.map(item => renderNavigationItem(item))}
        </nav>

        {/* User info at bottom */}
        {isOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Administrator</p>
                <p className="text-xs text-gray-500">admin@rkas.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

interface MainContentProps {
  sidebarOpen: boolean
  children: React.ReactNode
  className?: string
  isMobile?: boolean
  onToggle?: () => void
}

export const MainContent: React.FC<MainContentProps> = ({
  sidebarOpen,
  children,
  className = '',
  isMobile = false,
  onToggle
}) => {
  return (
    <div className={`
      transition-all duration-300 ease-in-out
      ${isMobile ? 'ml-0' : sidebarOpen ? 'ml-64' : 'ml-16'}
      min-h-screen bg-gray-50
      ${className}
    `}>
      {/* Header with toggle button */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                title={sidebarOpen ? 'Sembunyikan Menu' : 'Tampilkan Menu'}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5 text-gray-600" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5 text-gray-600" />
                )}
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-900">Sistem R-KAS</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Administrator R-KAS</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-4 lg:p-6 max-w-full overflow-x-auto">
        {children}
      </div>
    </div>
  )
}