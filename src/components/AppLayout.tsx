import React, { useState, useEffect } from 'react';
import { SidebarNavigation, MainContent } from './Navigation';
import { Dashboard } from './Dashboard';
import { BudgetManagement } from './BudgetManagement';
import { DatabaseManagement } from './DatabaseManagement';
import { MasterDataManagement } from './MasterDataManagement';
import KertasKerjaPerubahanComponent from './KertasKerjaPerubahan';
import { FilterOptions } from '../types/database';

type ViewType = 'dashboard' | 'budget' | 'database' | 'master-data' | 'kertas-kerja';

export const AppLayout: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  
  // Initialize sidebar state from localStorage or default
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('rkas-sidebar-open');
    return saved !== null ? JSON.parse(saved) : true; // Default to open on desktop
  });

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rkas-sidebar-open', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Always close sidebar on mobile
      } else {
        // On desktop, restore from localStorage or default to open
        const saved = localStorage.getItem('rkas-sidebar-open');
        setSidebarOpen(saved !== null ? JSON.parse(saved) : true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case 'dashboard':
        setActiveView('dashboard');
        break;
      case 'budget':
      case 'budget-management':
        setActiveView('budget');
        break;
      case 'kertas-kerja':
        setActiveView('kertas-kerja');
        break;
      case 'database':
      case 'database-management':
        setActiveView('database');
        break;
      case 'master-data':
        setActiveView('master-data');
        break;
      default:
        setActiveView('dashboard');
    }

    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            filters={filters} 
            onFiltersChange={handleFiltersChange} 
          />
        );
      case 'budget':
        return (
          <BudgetManagement 
            filters={filters} 
            onFiltersChange={handleFiltersChange} 
          />
        );
      case 'kertas-kerja':
        return <KertasKerjaPerubahanComponent />;
      case 'database':
        return <DatabaseManagement />;
      case 'master-data':
        return <MasterDataManagement />;
      default:
        return (
          <Dashboard 
            filters={filters} 
            onFiltersChange={handleFiltersChange} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Container with 80% width and centered */}
      <div className="w-[80%] mx-auto min-h-screen bg-white shadow-lg">
        <SidebarNavigation
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
          activeItem={activeView}
          onItemClick={handleNavigationClick}
          isMobile={isMobile}
        />
        
        <MainContent 
          sidebarOpen={sidebarOpen} 
          isMobile={isMobile}
          onToggle={handleSidebarToggle}
        >
          {renderContent()}
        </MainContent>
      </div>
    </div>
  );
};

// Export individual components for direct use if needed
export { DatabaseManagement, MasterDataManagement, Dashboard }