import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Magnet, 
  Lock, 
  Volume2, 
  Settings, 
  Wifi, 
  Activity,
  Power,
  ToggleLeft,
  ToggleRight,
  Save,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

const ESP32ControlPanel = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [esp32Config, setEsp32Config] = useState({
    ip: '192.168.1.100',
    connected: false,
    currentSensors: Array(9).fill(false),
    magnetoSensors: [false, false],
    locks: [false, false],
    soundEnabled: false,
    volume: 20
  });

  const [liveData, setLiveData] = useState({
    currentValues: Array(9).fill(0),
    magnetoStatus: [false, false],
    lockStatus: [false, false]
  });

  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // טעינת הגדרות מהזיכרון המקומי
  useEffect(() => {
    const savedConfig = localStorage.getItem('esp32Config');
    if (savedConfig) {
      setEsp32Config(JSON.parse(savedConfig));
    }
  }, []);

  // שמירת הגדרות אוטומטית
  useEffect(() => {
    localStorage.setItem('esp32Config', JSON.stringify(esp32Config));
  }, [esp32Config]);

  // סימולציה של עדכון נתונים בזמן אמת
  useEffect(() => {
    if (!esp32Config.connected) return;

    const interval = setInterval(() => {
      setLiveData(prev => ({
        currentValues: prev.currentValues.map((_, i) => 
          esp32Config.currentSensors[i] ? (Math.random() * 5).toFixed(2) : 0
        ),
        magnetoStatus: [
          esp32Config.magnetoSensors[0] ? Math.random() > 0.7 : false,
          esp32Config.magnetoSensors[1] ? Math.random() > 0.7 : false
        ],
        lockStatus: prev.lockStatus
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [esp32Config.connected, esp32Config.currentSensors, esp32Config.magnetoSensors]);

  // חיבור ל-ESP32
  const connectToESP32 = () => {
    // סימולציה של חיבור
    setTimeout(() => {
      setEsp32Config(prev => ({ ...prev, connected: true }));
      setConnectionStatus('connected');
      alert(`התחברות הצליחה ל-ESP32: ${esp32Config.ip}`);
    }, 1000);
  };

  // ניתוק מ-ESP32
  const disconnectESP32 = () => {
    setEsp32Config(prev => ({ ...prev, connected: false }));
    setConnectionStatus('disconnected');
  };

  // בדיקת חיבור
  const testConnection = () => {
    if (!esp32Config.connected) {
      alert('אנא התחבר ל-ESP32 קודם');
      return;
    }
    alert('החיבור תקין!');
  };

  // שליטה במנעול
  const toggleLock = (lockNumber) => {
    if (!esp32Config.connected) {
      alert('אנא התחבר ל-ESP32 קודם');
      return;
    }
    
    if (!esp32Config.locks[lockNumber - 1]) {
      alert(`מנעול ${lockNumber} לא מופעל בהגדרות`);
      return;
    }

    setLiveData(prev => ({
      ...prev,
      lockStatus: prev.lockStatus.map((status, i) => 
        i === lockNumber - 1 ? !status : status
      )
    }));
  };

  // נעילת/פתיחת כל המנעולים
  const controlAllLocks = (lock) => {
    if (!esp32Config.connected) {
      alert('אנא התחבר ל-ESP32 קודם');
      return;
    }

    setLiveData(prev => ({
      ...prev,
      lockStatus: prev.lockStatus.map((_, i) => 
        esp32Config.locks[i] ? lock : prev.lockStatus[i]
      )
    }));
  };

  // הפעלת צליל
  const playSound = (soundNumber) => {
    if (!esp32Config.connected || !esp32Config.soundEnabled) {
      alert('מודול שמע לא מופעל או לא מחובר');
      return;
    }
    alert(`מפעיל הודעה ${soundNumber}`);
  };

  // עצירת צליל
  const stopSound = () => {
    if (!esp32Config.connected) return;
    alert('עוצר הודעות שמע');
  };

  // עדכון הגדרות
  const updateSettings = (key, value) => {
    setEsp32Config(prev => ({ ...prev, [key]: value }));
  };

  // שמירת הגדרות
  const saveSettings = () => {
    localStorage.setItem('esp32Config', JSON.stringify(esp32Config));
    alert('הגדרות נשמרו בהצלחה!');
  };

  // איפוס הגדרות
  const resetSettings = () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את כל ההגדרות?')) {
      const defaultConfig = {
        ip: '192.168.1.100',
        connected: false,
        currentSensors: Array(9).fill(false),
        magnetoSensors: [false, false],
        locks: [false, false],
        soundEnabled: false,
        volume: 20
      };
      setEsp32Config(defaultConfig);
      setConnectionStatus('disconnected');
      localStorage.removeItem('esp32Config');
      alert('הגדרות אופסו בהצלחה!');
    }
  };

  const TabButton = ({ id, icon, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              בקרת מערכת ESP32
            </h1>
          </div>
          <div className={`px-4 py-2 rounded-lg font-semibold ${
            connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {connectionStatus === 'connected' 
              ? `מחובר ל-${esp32Config.ip}` 
              : 'לא מחובר ל-ESP32'
            }
          </div>
        </div>

        {/* הגדרות חיבור */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            הגדרות חיבור ESP32
          </h3>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">כתובת IP:</label>
            <input
              type="text"
              value={esp32Config.ip}
              onChange={(e) => updateSettings('ip', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-center font-mono"
              placeholder="192.168.1.XXX"
            />
            {!esp32Config.connected ? (
              <button
                onClick={connectToESP32}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Wifi className="w-4 h-4" />
                התחבר
              </button>
            ) : (
              <button
                onClick={disconnectESP32}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                נתק
              </button>
            )}
            <button
              onClick={testConnection}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              בדוק חיבור
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <TabButton
          id="monitoring"
          icon={<Activity className="w-4 h-4" />}
          label="ניטור"
          isActive={activeTab === 'monitoring'}
          onClick={setActiveTab}
        />
        <TabButton
          id="control"
          icon={<Power className="w-4 h-4" />}
          label="שליטה"
          isActive={activeTab === 'control'}
          onClick={setActiveTab}
        />
        <TabButton
          id="settings"
          icon={<Settings className="w-4 h-4" />}
          label="הגדרות"
          isActive={activeTab === 'settings'}
          onClick={setActiveTab}
        />
      </div>

      {/* טאב ניטור */}
      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* מדי זרם */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              מדי זרם (9 ערוצים)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 9 }, (_, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    esp32Config.currentSensors[i] && parseFloat(liveData.currentValues[i]) > 0.1
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-sm text-gray-600 text-center mb-1">
                    ערוץ {i + 1}
                  </div>
                  <div className="text-lg font-bold text-center">
                    {esp32Config.currentSensors[i] ? `${liveData.currentValues[i]}A` : '--'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* חיישני מגנטו */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Magnet className="w-5 h-5 text-purple-600" />
              חיישני מגנטו
            </h3>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>מגנטו {i}:</span>
                  <div className={`w-6 h-6 rounded-full ${
                    esp32Config.magnetoSensors[i-1] && liveData.magnetoStatus[i-1]
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* טאב שליטה */}
      {activeTab === 'control' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* מנעולים */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              מנעולים חשמליים
            </h3>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>מנעול {i}:</span>
                  <button
                    onClick={() => toggleLock(i)}
                    disabled={!esp32Config.locks[i-1]}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      !esp32Config.locks[i-1]
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : liveData.lockStatus[i-1]
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {liveData.lockStatus[i-1] ? 'נעול' : 'פתוח'}
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => controlAllLocks(true)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  נעל הכל
                </button>
                <button
                  onClick={() => controlAllLocks(false)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  פתח הכל
                </button>
              </div>
            </div>
          </div>

          {/* הודעות שמע */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-green-600" />
              הודעות שמע
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => playSound(i + 1)}
                  disabled={!esp32Config.soundEnabled}
                  className={`px-3 py-2 rounded-lg font-semibold ${
                    !esp32Config.soundEnabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  הודעה {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={stopSound}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              עצור שמע
            </button>
          </div>
        </div>
      )}

      {/* טאב הגדרות */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* הגדרות מדי זרם */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              הפעלת מדי זרם
            </h3>
            <div className="space-y-3">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>מד זרם {i + 1} פעיל:</span>
                  <button
                    onClick={() => {
                      const newSensors = [...esp32Config.currentSensors];
                      newSensors[i] = !newSensors[i];
                      updateSettings('currentSensors', newSensors);
                    }}
                    className="flex items-center"
                  >
                    {esp32Config.currentSensors[i] ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* הגדרות מגנטו ומנעולים */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              הגדרות כלליות
            </h3>
            <div className="space-y-4">
              {/* מגנטו */}
              <div>
                <h4 className="font-semibold text-purple-600 mb-2">חיישני מגנטו</h4>
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                    <span>מגנטו {i} פעיל:</span>
                    <button
                      onClick={() => {
                        const newMagneto = [...esp32Config.magnetoSensors];
                        newMagneto[i-1] = !newMagneto[i-1];
                        updateSettings('magnetoSensors', newMagneto);
                      }}
                      className="flex items-center"
                    >
                      {esp32Config.magnetoSensors[i-1] ? (
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* מנעולים */}
              <div>
                <h4 className="font-semibold text-blue-600 mb-2">מנעולים חשמליים</h4>
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                    <span>מנעול {i} פעיל:</span>
                    <button
                      onClick={() => {
                        const newLocks = [...esp32Config.locks];
                        newLocks[i-1] = !newLocks[i-1];
                        updateSettings('locks', newLocks);
                      }}
                      className="flex items-center"
                    >
                      {esp32Config.locks[i-1] ? (
                        <ToggleRight className="w-8 h-8 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* שמע */}
              <div>
                <h4 className="font-semibold text-green-600 mb-2">מודול שמע</h4>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                  <span>מודול שמע פעיל:</span>
                  <button
                    onClick={() => updateSettings('soundEnabled', !esp32Config.soundEnabled)}
                    className="flex items-center"
                  >
                    {esp32Config.soundEnabled ? (
                      <ToggleRight className="w-8 h-8 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <label className="text-sm font-medium">עוצמת קול:</label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={esp32Config.volume}
                    onChange={(e) => updateSettings('volume', parseInt(e.target.value))}
                    className="flex-1"
                    disabled={!esp32Config.soundEnabled}
                  />
                  <span className="text-sm font-bold w-8">{esp32Config.volume}</span>
                </div>
              </div>
            </div>
          </div>

          {/* כפתורי שמירה */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">ניהול הגדרות</h3>
              <div className="flex gap-3">
                <button
                  onClick={saveSettings}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  שמור הגדרות
                </button>
                <button
                  onClick={resetSettings}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  איפוס לברירת מחדל
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ESP32ControlPanel;