import React, { useState } from 'react';
import { 
  Users, 
  Plus,
  X
} from 'lucide-react';

const UsersView = ({ users, currentUser, showAddUser, setShowAddUser, addUser, updateUser, deleteUser, selectedSchool }) => {
  const [editingUser, setEditingUser] = useState(null);

  // סינון משתמשים לפי בית ספר
  const filteredUsers = users.filter(user => {
    // מנהל מערכת ראשי רואה את כולם
    if (currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') {
      // אם בחר בית ספר ספציפי - רק משתמשים של הבית ספר הזה
      if (selectedSchool) {
        return user.schoolId === selectedSchool;
      }
      // אם לא בחר - רק מנהלי מערכת ראשיים
      return !user.schoolId || user.role === 'masteradmin' || user.role === 'superadmin';
    }
    
    // מנהל בית ספר רואה רק משתמשים של בית הספר שלו
    return user.schoolId === currentUser?.schoolId;
  });

  return (
    <div style={{padding: '1.5rem'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>ניהול משתמשים</h2>
        <button 
          onClick={() => setShowAddUser(true)}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Plus style={{width: '1rem', height: '1rem'}} />
          <span>הוסף משתמש</span>
        </button>
      </div>

      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb'}}>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%'}}>
            <thead style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
              <tr>
                <th style={{padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>שם</th>
                <th style={{padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>אימייל</th>
                <th style={{padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>תפקיד</th>
                <th style={{padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#111827'}}>{user.name}</td>
                  <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280'}}>{user.email}</td>
                  <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem'}}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: user.role === 'superadmin' ? '#faf5ff' : user.role === 'manager' ? '#eff6ff' : user.role === 'teacher' ? '#f0fdf4' : '#fff7ed',
                      color: user.role === 'superadmin' ? '#7c3aed' : user.role === 'manager' ? '#2563eb' : user.role === 'teacher' ? '#16a34a' : '#ea580c'
                    }}>
                      {user.role === 'superadmin' ? 'מנהל מערכת' :
                       user.role === 'manager' ? 'מנהל' :
                       user.role === 'teacher' ? 'מורה' : 'טכנאי'}
                    </span>
                  </td>
                  <td style={{padding: '1rem 1.5rem', fontSize: '0.875rem'}}>
                    {user.id !== currentUser?.id && (
                      <button 
                        onClick={() => setEditingUser(user)}
                        style={{color: '#2563eb', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer'}}
                      >
                        עריכה
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* חלון הוספת משתמש */}
      {showAddUser && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem'}}>
          <div style={{backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '32rem', width: '100%'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>הוסף משתמש חדש</h3>
                <button
                  onClick={() => setShowAddUser(false)}
                  style={{color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer'}}
                >
                  <X style={{width: '1.5rem', height: '1.5rem'}} />
                </button>
              </div>
            </div>
            
            <AddUserForm 
              onSubmit={addUser}
              onCancel={() => setShowAddUser(false)}
              currentUser={currentUser}
            />
          </div>
        </div>
      )}

      {/* חלון עריכת משתמש */}
      {editingUser && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem', overflowY: 'auto'}}>
          <div style={{backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '48rem', width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: 'auto'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>עריכת {editingUser.name}</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  style={{color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer'}}
                >
                  <X style={{width: '1.5rem', height: '1.5rem'}} />
                </button>
              </div>
            </div>
            
            <EditUserForm 
              user={editingUser}
              currentUser={currentUser}
              onSave={updateUser}
              onDelete={deleteUser}
              onCancel={() => setEditingUser(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// רכיב AddUserForm
const AddUserForm = ({ onSubmit, onCancel, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'teacher',
    password: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('יש למלא שם ואימייל');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שם מלא *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          placeholder="שם המשתמש"
        />
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>אימייל *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          placeholder="user@school.edu"
        />
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>תפקיד</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        >
          <option value="teacher">מורה</option>
          <option value="technician">טכנאי</option>
          <option value="manager">מנהל בית ספר</option>
          {/* מנהל מערכת ראשי יכול ליצור מנהל מערכת נוסף */}
          {(currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') && (
            <option value="superadmin">מנהל מערכת ראשי</option>
          )}
        </select>
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>סיסמה</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          placeholder="סיסמה (ברירת מחדל: 123456)"
        />
        <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem'}}>אם לא מזינים סיסמה, תוגדר סיסמת ברירת מחדל: 123456</p>
      </div>
      
      <div style={{display: 'flex', gap: '0.75rem', paddingTop: '1rem'}}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          הוסף משתמש
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            backgroundColor: '#e5e7eb',
            color: '#374151',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ביטול
        </button>
      </div>
    </div>
  );
};

// רכיב EditUserForm
const EditUserForm = ({ user, currentUser, onSave, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    newPassword: ''
  });

  const handleSave = () => {
    // קבלת הערכים מהטופס
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      role: formData.role
    };
    
    // עדכון הסיסמה רק אם הוקלדה
    if (formData.newPassword.trim() !== '') {
      updatedUser.password = formData.newPassword;
    }
    
    onSave(updatedUser);
    onCancel();
  };

  return (
    <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שם מלא</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        />
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>אימייל</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        />
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>תפקיד</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        >
          <option value="teacher">מורה</option>
          <option value="technician">טכנאי</option>
          <option value="manager">מנהל בית ספר</option>
          {(currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') && (
            <option value="superadmin">מנהל מערכת ראשי</option>
          )}
        </select>
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>סיסמה חדשה</label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
          placeholder="השאר ריק כדי לא לשנות"
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        />
        <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem'}}>
          השאר ריק אם לא רוצה לשנות את הסיסמה
        </p>
      </div>

      <div style={{backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.375rem', padding: '0.75rem'}}>
        <h4 style={{fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0c4a6e'}}>פעולות נוספות:</h4>
        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
          <button
            onClick={() => {
              if (window.confirm('האם לאפס את הסיסמה ל-123456?')) {
                setFormData({...formData, newPassword: '123456'});
                alert('הסיסמה אופסה ל-123456');
              }
            }}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🔄 איפוס סיסמה
          </button>
          
          <button
            onClick={() => {
              if (window.confirm(`האם למחוק את המשתמש ${user.name}? פעולה זו לא ניתנת לביטול!`)) {
                onDelete(user.id);
                onCancel();
              }
            }}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🗑️ מחק משתמש
          </button>
        </div>
      </div>

      <div style={{display: 'flex', gap: '0.75rem', paddingTop: '1rem'}}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          שמור שינויים
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            backgroundColor: '#e5e7eb',
            color: '#374151',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ביטול
        </button>
      </div>
    </div>
  );
};

export default UsersView;