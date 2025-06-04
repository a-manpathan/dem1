import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { FullscreenToggle } from '@/components/ui/fullscreen-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import genixLogo from './jok.jpg';

const DoctorLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const navItems = [
    { icon: <Calendar className="w-5 h-5" />, label: 'Dashboard', path: '/doctor/dashboard' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Appointments', path: '/doctor/appointments' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', path: '/doctor/analytics' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', path: '/doctor/messages' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/doctor/settings' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-full"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card text-card-foreground shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <img src={genixLogo} alt="Genix Logo" className="h-30" />
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t">
            <Link
              to="/login"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-3">Logout</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header with theme toggle */}
        <header className="bg-card text-card-foreground shadow-sm p-4 flex items-center justify-end border-b">
          <div className="flex items-center space-x-4">
            {/* Theme toggle button - using same style as Layout.tsx */}
            <ThemeToggle />
            
            {/* Fullscreen toggle - using same style as Layout.tsx */}
            <FullscreenToggle />
            
            {/* Settings button */}
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
            
            {/* Bell/Notifications button */}
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            
            {/* User dropdown - using same style as Layout.tsx */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">D</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  logout();
                  navigate('/login');
                }}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Content */}
        <main className="h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;

