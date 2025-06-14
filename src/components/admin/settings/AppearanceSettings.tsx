
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Palette, Monitor, Sun, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AppearanceSettings = () => {
  const { theme, colorScheme, setTheme, setColorScheme, isLoading, canModifyTheme } = useTheme();

  if (!canModifyTheme) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Only Super Admins can modify the system appearance settings.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span>Current Theme:</span>
                <Badge variant="outline">{theme}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Current Color Scheme:</span>
                <Badge variant="outline">{colorScheme}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            System Appearance Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure the appearance for all users across the entire system.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Mode Selection */}
          <div className="space-y-3">
            <Label htmlFor="theme-mode">Theme Mode</Label>
            <Select 
              value={theme} 
              onValueChange={(value: 'light' | 'dark' | 'auto') => setTheme(value)}
              disabled={isLoading}
            >
              <SelectTrigger id="theme-mode">
                <SelectValue placeholder="Select theme mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </div>
                </SelectItem>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Auto (System Preference)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This setting applies to all users system-wide.
            </p>
          </div>

          {/* Color Scheme Selection */}
          <div className="space-y-3">
            <Label htmlFor="color-scheme">Primary Color Scheme</Label>
            <Select 
              value={colorScheme} 
              onValueChange={(value: 'bjj-gold' | 'blue' | 'green' | 'purple' | 'black') => setColorScheme(value)}
              disabled={isLoading}
            >
              <SelectTrigger id="color-scheme">
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bjj-gold">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#f6ad24]"></div>
                    BJJ Gold (Default)
                  </div>
                </SelectItem>
                <SelectItem value="blue">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    Professional Blue
                  </div>
                </SelectItem>
                <SelectItem value="green">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    Nature Green
                  </div>
                </SelectItem>
                <SelectItem value="purple">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    Royal Purple
                  </div>
                </SelectItem>
                <SelectItem value="black">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-900"></div>
                    Classic Black
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Changes the primary color used throughout the application for all users.
            </p>
          </div>

          {/* Theme Preview */}
          <div className="space-y-3">
            <Label>Live Preview</Label>
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-primary text-primary-foreground">
                  Primary Button
                </Button>
                <Button size="sm" variant="secondary">
                  Secondary Button
                </Button>
                <Button size="sm" variant="outline">
                  Outline Button
                </Button>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-primary rounded-full w-1/3"></div>
                <div className="h-2 bg-secondary rounded-full w-1/2"></div>
                <div className="h-2 bg-muted rounded-full w-1/4"></div>
              </div>
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  System-Wide Changes
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  These appearance settings will be applied to all users (Super Admins, Coaches, and Students) across the entire system. 
                  Changes are saved automatically and will persist across page reloads and user sessions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
