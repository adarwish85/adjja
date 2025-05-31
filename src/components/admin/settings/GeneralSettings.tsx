
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Globe, Clock, Palette } from "lucide-react";
import { useSettings, GeneralSettings as GeneralSettingsType } from "@/hooks/useSettings";
import { useTheme } from "@/contexts/ThemeContext";

export const GeneralSettings = () => {
  const { 
    defaultGeneralSettings, 
    loadGeneralSettings,
    saveGeneralSettings, 
    isLoading,
    worldTimezones,
    worldCurrencies 
  } = useSettings();
  
  const { theme, colorScheme, setTheme, setColorScheme } = useTheme();
  const [settings, setSettings] = useState<GeneralSettingsType>(defaultGeneralSettings);

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = loadGeneralSettings();
    setSettings(savedSettings);
  }, []);

  const handleSave = async () => {
    await saveGeneralSettings(settings);
  };

  const handleReset = () => {
    setSettings(defaultGeneralSettings);
  };

  const updateBusinessHours = (day: string, field: 'enabled' | 'start' | 'end', value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleThemeChange = (newTheme: string) => {
    setSettings(prev => ({ ...prev, theme: newTheme }));
    setTheme(newTheme as 'light' | 'dark' | 'auto');
  };

  const handleColorSchemeChange = (newColorScheme: string) => {
    setSettings(prev => ({ ...prev, colorScheme: newColorScheme }));
    setColorScheme(newColorScheme as 'bjj-gold' | 'blue' | 'green' | 'purple');
  };

  return (
    <div className="space-y-6">
      {/* Organization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input 
                id="org-name" 
                value={settings.organizationName}
                onChange={(e) => setSettings(prev => ({ ...prev, organizationName: e.target.value }))}
                placeholder="Enter organization name"
              />
            </div>
            <div>
              <Label htmlFor="org-code">Organization Code</Label>
              <Input 
                id="org-code" 
                value={settings.organizationCode}
                onChange={(e) => setSettings(prev => ({ ...prev, organizationCode: e.target.value }))}
                placeholder="Enter organization code"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input 
                id="contact-email" 
                type="email" 
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="Enter contact email"
              />
            </div>
            <div>
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input 
                id="contact-phone" 
                value={settings.contactPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="Enter contact phone"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Organization Address</Label>
            <Input 
              id="address" 
              value={settings.address}
              onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter organization address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Regional Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, timezone: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {worldTimezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={settings.currency} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {worldCurrencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(settings.businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Switch 
                  checked={hours.enabled}
                  onCheckedChange={(checked) => updateBusinessHours(day, 'enabled', checked)}
                />
                <span className="font-medium min-w-[80px] capitalize">{day}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Input 
                  type="time" 
                  value={hours.start} 
                  onChange={(e) => updateBusinessHours(day, 'start', e.target.value)}
                  className="w-24" 
                  disabled={!hours.enabled}
                />
                <span className={hours.enabled ? "" : "text-muted-foreground"}>to</span>
                <Input 
                  type="time" 
                  value={hours.end} 
                  onChange={(e) => updateBusinessHours(day, 'end', e.target.value)}
                  className="w-24" 
                  disabled={!hours.enabled}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={settings.theme} 
                onValueChange={handleThemeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="color-scheme">Color Scheme</Label>
              <Select 
                value={settings.colorScheme} 
                onValueChange={handleColorSchemeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select color scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bjj-gold">BJJ Gold</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Color Scheme Preview */}
          <div className="mt-4">
            <Label>Preview</Label>
            <div className="flex space-x-2 mt-2">
              <div className="w-8 h-8 rounded bg-primary border-2 border-border"></div>
              <div className="w-8 h-8 rounded bg-accent border-2 border-border"></div>
              <div className="w-8 h-8 rounded bg-secondary border-2 border-border"></div>
              <div className="w-8 h-8 rounded bg-muted border-2 border-border"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Reset to Defaults
        </Button>
        <Button 
          className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
