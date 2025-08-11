import { useState } from 'react';
import { Heading } from '../components/shared/Heading';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      dailyDigest: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York'
    },
    api: {
      endpoint: process.env.REACT_APP_API_URL || 'http://localhost:3001',
      timeout: 30000
    }
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <Heading level={1} className="mb-2">Settings</Heading>
        <p className="text-gray-600">Configure your application preferences</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage how you receive notifications about cases, denials, and system updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked: boolean) =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: checked }
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-gray-600">Browser push notifications</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked: boolean) =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: checked }
                }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Daily Digest</h4>
              <p className="text-sm text-gray-600">Daily summary of activities</p>
            </div>
            <Switch
              checked={settings.notifications.dailyDigest}
              onCheckedChange={(checked: boolean) =>
                setSettings(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, dailyDigest: checked }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your application experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={settings.preferences.theme}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, theme: e.target.value }
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={settings.preferences.language}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, language: e.target.value }
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, timezone: e.target.value }
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Advanced settings for API connections and timeouts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API Endpoint</label>
            <Input
              value={settings.api.endpoint}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  api: { ...prev.api, endpoint: e.target.value }
                }))
              }
              placeholder="http://localhost:3001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Request Timeout (ms)</label>
            <Input
              type="number"
              value={settings.api.timeout}
              onChange={(e) =>
                setSettings(prev => ({
                  ...prev,
                  api: { ...prev.api, timeout: parseInt(e.target.value) }
                }))
              }
              placeholder="30000"
            />
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Current system status and version information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>Version:</span>
            <Badge variant="outline">v1.2.0</Badge>
          </div>
          <div className="flex justify-between">
            <span>Environment:</span>
            <Badge variant="outline">Development</Badge>
          </div>
          <div className="flex justify-between">
            <span>API Status:</span>
            <Badge className="bg-green-100 text-green-800">Connected</Badge>
          </div>
          <div className="flex justify-between">
            <span>Last Sync:</span>
            <span className="text-sm text-gray-600">2 minutes ago</span>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Settings
        </Button>
      </div>
    </div>
  );
}