import React, { useState } from 'react';
import { Shield, Computer } from 'lucide-react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const success = onLogin(email, password);
    if (!success) {
      setError('אימייל או סיסמה שגויים');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl" style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      direction: 'rtl'
    }}>
      <div className="max-w-md w-full space-y-8" style={{maxWidth: '28rem', width: '100%'}}>
        <div className="text-center" style={{textAlign: 'center'}}>
          <Computer className="mx-auto h-12 w-12 text-blue-600" style={{
            margin: '0 auto',
            height: '3rem',
            width: '3rem',
            color: '#2563eb'
          }} />
          <h2 className="mt-6 text-3xl font-bold text-gray-900" style={{
            marginTop: '1.5rem',
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827'
          }}>
            מערכת ניהול עגלות מחשבים
          </h2>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border" style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb'
        }}>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6" style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h3 className="font-medium text-blue-800 mb-2" style={{
              fontWeight: '500',
              color: '#1e40af',
              marginBottom: '0.5rem'
            }}>משתמשים לדוגמה:</h3>
            <div className="space-y-1 text-sm text-blue-700" style={{
              fontSize: '0.875rem',
              color: '#1d4ed8'
            }}>
              <div><strong>מנהל מערכת:</strong> info@innosys.co.il / In@3030548</div>
              <div><strong>מנהל בית ספר:</strong> david@school.edu / 123456</div>
              <div><strong>מורה:</strong> cohen@school.edu / 123456</div>
              <div><strong>טכנאי:</strong> levi@school.edu / 123456</div>
            </div>
          </div>

          <div className="space-y-6" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div>
              <label className="block text-sm font-medium text-gray-700" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>אימייל</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                style={{
                  marginTop: '0.25rem',
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
                placeholder="הכנס אימייל"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151'
              }}>סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                style={{
                  marginTop: '0.25rem',
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem'
                }}
                placeholder="הכנס סיסמה"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded" style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Shield className="w-4 h-4 ml-2" style={{width: '1rem', height: '1rem', marginLeft: '0.5rem'}} />
              התחבר
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;