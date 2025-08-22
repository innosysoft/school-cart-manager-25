import React, { useState } from 'react';
import { 
  Computer, 
  ShoppingCart, 
  Power,
  Battery,
  MapPin,
  Plus,
  Activity,
  X,
  Edit,
  Save
} from 'lucide-react';

const CartsView = ({ carts, currentUser, editingCart, setEditingCart, showCartDetails, setShowCartDetails, updateCart, selectedSchool, addCart }) => {
  const [showAddCart, setShowAddCart] = useState(false);

  // סינון עגלות לפי בית ספר
  const filteredCarts = carts.filter(cart => {
    if (currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') {
      return selectedSchool ? cart.schoolId === selectedSchool : false;
    }
    return cart.schoolId === currentUser?.schoolId;
  });
  
  return (
    <div style={{padding: '1.5rem'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>ניהול עגלות</h2>
        {(currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin' || currentUser?.role === 'manager') && (
          <button 
            onClick={() => setShowAddCart(true)}
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
            <span>הוסף עגלה</span>
          </button>
        )}
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
        {filteredCarts.map(cart => (
          <div key={cart.id} style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '2px solid #e5e7eb'}}>
            <div style={{padding: '1rem', borderBottom: '1px solid #f3f4f6'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 style={{fontSize: '1.125rem', fontWeight: '600'}}>{cart.name}</h3>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                  <Power style={{width: '1rem', height: '1rem', color: '#16a34a'}} />
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: cart.status === 'active' ? '#dcfce7' : cart.status === 'maintenance' ? '#fed7aa' : '#fecaca',
                    color: cart.status === 'active' ? '#166534' : cart.status === 'maintenance' ? '#9a3412' : '#991b1b'
                  }}>
                    {cart.status === 'active' ? 'פעיל' : cart.status === 'maintenance' ? 'תחזוקה' : 'נעול'}
                  </span>
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem'}}>
                <MapPin style={{width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem'}} />
                {cart.location}
              </div>
            </div>
            
            <div style={{padding: '1rem'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '0.875rem', color: '#6b7280'}}>מחשבים מחוברים</span>
                  <span style={{fontWeight: '500'}}>{cart.connectedComputers}/{cart.totalComputers}</span>
                </div>
                
                <div style={{width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '0.5rem'}}>
                  <div 
                    style={{
                      backgroundColor: '#16a34a',
                      height: '0.5rem',
                      borderRadius: '9999px',
                      width: `${(cart.connectedComputers / cart.totalComputers) * 100}%`
                    }}
                  ></div>
                </div>
                
                {cart.reservedBy && (
                  <div style={{fontSize: '0.875rem'}}>
                    <span style={{color: '#6b7280'}}>שמור עבור: </span>
                    <span style={{fontWeight: '500', color: '#2563eb'}}>{cart.reservedBy}</span>
                  </div>
                )}
                
                {cart.currentUser && (
                  <div style={{fontSize: '0.875rem'}}>
                    <span style={{color: '#6b7280'}}>משתמש נוכחי: </span>
                    <span style={{fontWeight: '500', color: '#ea580c'}}>{cart.currentUser}</span>
                  </div>
                )}
              </div>
              
              <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
                <button 
                  onClick={() => setShowCartDetails(cart)}
                  style={{
                    flex: 1,
                    backgroundColor: '#2563eb',
                    color: 'white',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  פרטים
                </button>
                {(currentUser?.role === 'manager' || currentUser?.role === 'superadmin' || currentUser?.role === 'technician' || currentUser?.role === 'masteradmin') && (
                  <button 
                    onClick={() => setEditingCart(cart)}
                    style={{
                      flex: 1,
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    עריכה
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* חלון פרטי עגלה */}
      {showCartDetails && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem'}}>
          <div style={{backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '32rem', width: '100%'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>פרטי {showCartDetails.name}</h3>
                <button
                  onClick={() => setShowCartDetails(null)}
                  style={{color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer'}}
                >
                  <X style={{width: '1.5rem', height: '1.5rem'}} />
                </button>
              </div>
            </div>
            
            <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>מיקום</label>
                  <p style={{marginTop: '0.25rem', fontSize: '0.875rem', color: '#111827'}}>{showCartDetails.location}</p>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>סטטוס</label>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: showCartDetails.status === 'active' ? '#dcfce7' : showCartDetails.status === 'maintenance' ? '#fed7aa' : '#fecaca',
                    color: showCartDetails.status === 'active' ? '#166534' : showCartDetails.status === 'maintenance' ? '#9a3412' : '#991b1b'
                  }}>
                    {showCartDetails.status === 'active' ? 'פעיל' : showCartDetails.status === 'maintenance' ? 'תחזוקה' : 'נעול'}
                  </span>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>סה"כ מחשבים</label>
                  <p style={{marginTop: '0.25rem', fontSize: '0.875rem', color: '#111827'}}>{showCartDetails.totalComputers}</p>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>מחשבים מחוברים</label>
                  <p style={{marginTop: '0.25rem', fontSize: '0.875rem', color: '#111827'}}>{showCartDetails.connectedComputers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* חלון עריכת עגלה */}
      {editingCart && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem', overflowY: 'auto'}}>
          <div style={{backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '48rem', width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: 'auto'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>עריכת {editingCart.name}</h3>
                <button
                  onClick={() => setEditingCart(null)}
                  style={{color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer'}}
                >
                  <X style={{width: '1.5rem', height: '1.5rem'}} />
                </button>
              </div>
            </div>
            
            <EditCartForm 
              cart={editingCart}
              onSave={updateCart}
              onCancel={() => setEditingCart(null)}
            />
          </div>
        </div>
      )}

      {/* חלון הוספת עגלה */}
      {showAddCart && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem'}}>
          <div style={{backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '32rem', width: '100%'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>הוסף עגלה חדשה</h3>
            </div>
            <AddCartForm 
              onAdd={(newCart) => {
                addCart(newCart);
                setShowAddCart(false);
              }}
              onCancel={() => setShowAddCart(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// רכיב EditCartForm
const EditCartForm = ({ cart, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: cart.name,
    location: cart.location,
    status: cart.status,
    totalComputers: cart.totalComputers,
    connectedComputers: cart.connectedComputers,
    color: cart.color || '#2563eb',
    
    // הגדרות חדשות
    magneticCheckEnabled: cart.magneticCheckEnabled || false,
    powerCheckEnabled: cart.powerCheckEnabled || false,
    autoLockEnabled: cart.autoLockEnabled || false,
    alertThresholdMinutes: cart.alertThresholdMinutes || 10,
  });

  const handleSubmit = () => {
    onSave(cart.id, formData);
  };

  return (
    <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שם העגלה</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        />
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>מיקום</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        />
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>סטטוס</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        >
          <option value="active">פעיל</option>
          <option value="maintenance">תחזוקה</option>
          <option value="locked">נעול</option>
        </select>
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>צבע העגלה</label>
        <input
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({...formData, color: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', height: '40px', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: 'pointer'}}
        />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>סה"כ מחשבים</label>
          <input
            type="number"
            value={formData.totalComputers}
            onChange={(e) => setFormData({...formData, totalComputers: parseInt(e.target.value)})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          />
        </div>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>מחשבים מחוברים</label>
          <input
            type="number"
            value={formData.connectedComputers}
            onChange={(e) => setFormData({...formData, connectedComputers: parseInt(e.target.value)})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          />
        </div>
      </div>

      {/* הגדרות חיישנים */}
      <div style={{
        borderTop: '2px solid #e5e7eb', 
        paddingTop: '1rem',
        backgroundColor: '#f8fafc',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{
          fontSize: '1rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: '#1e40af'
        }}>
          🔧 הגדרות חיישנים ונעילה
        </h4>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
          <label style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={formData.magneticCheckEnabled}
              onChange={(e) => setFormData({...formData, magneticCheckEnabled: e.target.checked})}
            />
            <div>
              <div style={{fontWeight: '500', fontSize: '0.875rem'}}>🧲 בדיקת מגנט</div>
              <div style={{fontSize: '0.75rem', color: '#6b7280'}}>וידוא שהדלת סגורה</div>
            </div>
          </label>
          
          <label style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={formData.powerCheckEnabled}
              onChange={(e) => setFormData({...formData, powerCheckEnabled: e.target.checked})}
            />
            <div>
              <div style={{fontWeight: '500', fontSize: '0.875rem'}}>⚡ בדיקת טעינה</div>
              <div style={{fontSize: '0.75rem', color: '#6b7280'}}>וידוא מתח וזרם תקינים</div>
            </div>
          </label>
          
          <label style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={formData.autoLockEnabled}
              onChange={(e) => setFormData({...formData, autoLockEnabled: e.target.checked})}
            />
            <div>
              <div style={{fontWeight: '500', fontSize: '0.875rem'}}>🔒 נעילה אוטומטית</div>
              <div style={{fontSize: '0.75rem', color: '#6b7280'}}>נעילה עם סיום התנאים</div>
            </div>
          </label>
          
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db'
          }}>
            <label style={{fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem'}}>
              ⏰ זמן התרעה (דקות)
            </label>
            <input
              type="number"
              value={formData.alertThresholdMinutes}
              onChange={(e) => setFormData({...formData, alertThresholdMinutes: parseInt(e.target.value) || 10})}
              min="1"
              max="60"
              style={{
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '0.25rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <Save style={{width: '1rem', height: '1rem'}} />
          שמור
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

// רכיב AddCartForm
const AddCartForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    status: 'active',
    totalComputers: 20,
    connectedComputers: 20,
    color: '#2563eb',
    
    // הגדרות ברירת מחדל לעגלה חדשה
    magneticCheckEnabled: true,
    powerCheckEnabled: true,
    autoLockEnabled: false,
    alertThresholdMinutes: 10,
    
    // מצב התחלתי
    currentDoorStatus: 'unknown',
    currentPowerStatus: 'unknown',
    lastSensorUpdate: new Date().toISOString(),
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.location) {
      alert('יש למלא שם עגלה ומיקום');
      return;
    }
    
    onAdd(formData);
  };

  return (
    <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שם העגלה *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          placeholder="למשל: עגלה D"
        />
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>מיקום *</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          placeholder="למשל: קומה 3 - חדר מורים"
        />
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>סה"כ מחשבים</label>
          <input
            type="number"
            value={formData.totalComputers}
            onChange={(e) => setFormData({...formData, totalComputers: parseInt(e.target.value)})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          />
        </div>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>צבע העגלה</label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', height: '40px', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: 'pointer'}}
          />
        </div>
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
          הוסף עגלה
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

export default CartsView;