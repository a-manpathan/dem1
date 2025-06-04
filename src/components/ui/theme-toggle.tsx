import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeToggleProps {
  variant?: 'icon' | 'switch';
  className?: string;
}

export function ThemeToggle({ 
  variant = 'icon',
  className = ''
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  
  // For debugging
  console.log("ThemeToggle rendering, current theme:", theme);
  
  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Sun className="h-4 w-4" />
        <Switch 
          checked={theme === 'dark'} 
          onCheckedChange={toggleTheme} 
          aria-label="Toggle theme"
        />
        <Moon className="h-4 w-4" />
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className={className}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

