import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { FullscreenToggle } from '@/components/ui/fullscreen-toggle';
import { useTheme } from '@/hooks/useTheme';

const Settings = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === '/settings/hospital') return 'hospital';
    if (location.pathname === '/settings/notification') return 'notification';
    return 'configure';
  });

  const [configSettings, setConfigSettings] = useState({
    patientPhoto: true,
    maritalStatus: false,
    bloodGroup: true,
    allergies: true,
    medications: true,
    pastMedicalHistory: false,
    familyHistory: false,
    socialHistory: false,
    immunizations: true,
  });

  const handleConfigToggle = (key: keyof typeof configSettings) => {
    setConfigSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-48 border-r border-border">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
        <nav className="space-y-1">
          <Link 
            to="/settings" 
            className={`block px-3 py-2 rounded-md ${activeTab === 'configure' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-foreground hover:bg-muted'}`}
            onClick={() => setActiveTab('configure')}
          >
            Configure
          </Link>
          <Link 
            to="/settings/hospital" 
            className={`block px-3 py-2 rounded-md ${activeTab === 'hospital' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-foreground hover:bg-muted'}`}
            onClick={() => setActiveTab('hospital')}
          >
            Manage Hospital
          </Link>
          <Link 
            to="/settings/notification" 
            className={`block px-3 py-2 rounded-md ${activeTab === 'notification' ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-foreground hover:bg-muted'}`}
            onClick={() => setActiveTab('notification')}
          >
            Notifications
          </Link>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-6">
        {activeTab === 'configure' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Configure Patient Information</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Theme:</span>
                  <ThemeToggle variant="switch" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Fullscreen:</span>
                  <FullscreenToggle />
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border border-border space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select which information should be displayed on the patient profile
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">#</span>
                  <span>Patient photo</span>
                </div>
                <Switch checked={configSettings.patientPhoto} onCheckedChange={() => handleConfigToggle('patientPhoto')} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">⊤</span>
                  <span>Marital Status</span>
                </div>
                <Switch checked={configSettings.maritalStatus} onCheckedChange={() => handleConfigToggle('maritalStatus')} />
              </div>
              
              {/* Other settings */}
            </div>
          </div>
        )}
        
        {activeTab === 'hospital' && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Hospital Settings</h2>
            <p className="text-muted-foreground">Configure hospital information and settings.</p>
          </div>
        )}
        
        {activeTab === 'notification' && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Notification Settings</h2>
            <p className="text-muted-foreground">Configure notification preferences.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;



