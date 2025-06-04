import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  ChevronDown,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import genixLogo from '../../pages/jok.jpg';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { FullscreenToggle } from '@/components/ui/fullscreen-toggle';

const DoctorLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          {/* Logo */}
          <Link to="/doctor/dashboard" className="mr-6 flex items-center space-x-2">
            <img src={genixLogo} alt="Genix Logo" className="h-17 w-auto max-w-[100px]" />
          </Link>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/doctor/dashboard" 
              className={`flex items-center space-x-2 px-3 py-2 ${isActive('/doctor/dashboard') ? 'text-primary border-b-2 border-primary' : 'text-foreground hover:text-primary'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/doctor/appointments" 
              className={`flex items-center space-x-2 px-3 py-2 ${isActive('/doctor/appointments') ? 'text-primary border-b-2 border-primary' : 'text-foreground hover:text-primary'}`}
            >
              <Calendar className="w-5 h-5" />
              <span>Appointments</span>
            </Link>
            
            <Link 
              to="/doctor/messages" 
              className={`flex items-center space-x-2 px-3 py-2 ${isActive('/doctor/messages') ? 'text-primary border-b-2 border-primary' : 'text-foreground hover:text-primary'}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
          </nav>
          
          <div className="ml-auto flex items-center space-x-4">
            {/* Theme toggle */}
            <ThemeToggle />
            
            {/* Fullscreen toggle */}
            <FullscreenToggle />
            
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
            </Button>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center p-2 border-b">
                  <Avatar className="h-10 w-10 mr-2">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 ml-2">
                    <p className="text-sm font-medium">Dr. Abhinand Choudry</p>
                    <p className="text-xs text-muted-foreground">Endocrinologist</p>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/doctor/profile" className="cursor-pointer">
                    <span className="w-full">My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/doctor/availability" className="cursor-pointer">
                    <span className="w-full">My Availability</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/doctor/prescription-pad" className="cursor-pointer">
                    <span className="w-full">My Prescription pad</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity ${
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`fixed inset-y-0 left-0 z-40 w-3/4 max-w-xs bg-card dark:bg-card-dark border-r border-border transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <img src={genixLogo} alt="Genix Logo" className="h-12" />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <nav className="p-4 space-y-2">
            <Link 
              to="/doctor/dashboard" 
              className={`flex items-center space-x-2 p-3 rounded-md ${isActive('/doctor/dashboard') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/doctor/appointments" 
              className={`flex items-center space-x-2 p-3 rounded-md ${isActive('/doctor/appointments') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Calendar className="w-5 h-5" />
              <span>Appointments</span>
            </Link>
            
            <Link 
              to="/doctor/messages" 
              className={`flex items-center space-x-2 p-3 rounded-md ${isActive('/doctor/messages') ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
          </nav>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DoctorLayout;





