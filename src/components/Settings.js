import React, { useState } from 'react';
import { 
  Settings,
  Save
} from 'lucide-react';

const SettingsView = ({ schoolSettings, setSchoolSettings }) => {
  const [settings, setSettings] = useState(schoolSettings);

  const handleSave = () => {
    setSchoolSettings(settings);
    alert('ההגדרות נשמרו בהצלחה');
  };

  const dayNames = {
    sunday: 'ראשון',
    monday: 'שני', 
    tuesday: 'שלישי',
    wednesday: 'רביעי',
    thursday: 'חמישי',
    friday: 'שישי',
    saturday: 'שבת'
  };

  const toggleWorkDay = (dayKey) => {
    const newWorkDays = settings.workDays.includes(dayKey)
      ? settings.workDays.filter(d => d !== dayKey)
      : [...settings.workDays, dayKey];
    
    setSettings({...settings, workDays: newWorkDays});
  };

  return (
    <div style={{padding: '1.5rem'}}>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>הגדרות מערכת</h2>

      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '1.5rem'}}>
        <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>הגדרות בית ספר</h3>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem'}}>ימי עבודה</label>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem'}}>
              {Object.entries(dayNames).map(([dayKey, dayName]) => (
                <label key={dayKey} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={settings.workDays.includes(dayKey)}
                    onChange={() => toggleWorkDay(dayKey)}
                    style={{borderRadius: '0.25rem', border: '1px solid #d1d5db'}}
                  />
                  <span style={{fontSize: '0.875rem'}}>{dayName}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שעת התחלה</label>
              <input
                type="time"
                value={settings.workStartTime}
                onChange={(e) => setSettings({...settings, workStartTime: e.target.value})}
                style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
              />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שעת סיום</label>
              <input
                type="time"
                value={settings.workEndTime}
                onChange={(e) => setSettings({...settings, workEndTime: e.target.value})}
                style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
              />
            </div>
          </div>

          <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '1rem'}}>
            <h4 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem'}}>הגדרות נוספות</h4>
            
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.75rem'}}>מדיניות אישור הזמנות</label>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                  <input
                    type="radio"
                    name="approvalPolicy"
                    value="auto"
                    checked={settings.approvalPolicy === 'auto'}
                    onChange={(e) => setSettings({...settings, approvalPolicy: e.target.value})}
                  />
                  <span style={{fontSize: '0.875rem'}}>אישור אוטומטי - כל המורים יכולים להזמין ישירות</span>
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                  <input
                    type="radio"
                    name="approvalPolicy"
                    value="manual"
                    checked={settings.approvalPolicy === 'manual'}
                    onChange={(e) => setSettings({...settings, approvalPolicy: e.target.value})}
                  />
                  <span style={{fontSize: '0.875rem'}}>אישור ידני - מנהל צריך לאשר כל הזמנה</span>
                </label>
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem'}}>
                <span style={{fontSize: '0.875rem', color: '#374151'}}>שם בית הספר</span>
                <span style={{fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>בית ספר יסודי הרצל</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem'}}>
                <span style={{fontSize: '0.875rem', color: '#374151'}}>גרסת מערכת</span>
                <span style={{fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>2.0.0</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem'}}>
                <span style={{fontSize: '0.875rem', color: '#374151'}}>סה"כ עגלות במערכת</span>
                <span style={{fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>3</span>
              </div>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem'}}>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.5rem 1.5rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Save style={{width: '1rem', height: '1rem'}} />
              שמור הגדרות
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;