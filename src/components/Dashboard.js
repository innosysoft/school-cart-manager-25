import React from 'react';
import { 
  Computer, 
  ShoppingCart, 
  Power,
  Battery,
  Activity,
  Clock
} from 'lucide-react';

const Dashboard = ({ carts, reservations, currentUser, approveReservation, rejectReservation }) => {
  const activeCarts = carts.filter(cart => cart.status === 'active');
  const totalComputers = carts.reduce((sum, cart) => sum + cart.totalComputers, 0);
  const connectedComputers = carts.reduce((sum, cart) => sum + cart.connectedComputers, 0);
  const todayReservations = reservations.filter(res => {    
    const resDate = new Date(res.date);
    const today = new Date();
    return resDate.toDateString() === today.toDateString();
  });

  return (
    <div style={{padding: '1.5rem'}}>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>דשבורד - בית ספר יסודי הרצל</h2>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{color: '#2563eb', fontSize: '0.875rem', fontWeight: '500'}}>סה"כ עגלות</p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a'}}>{carts.length}</p>
            </div>
            <ShoppingCart style={{width: '2rem', height: '2rem', color: '#2563eb'}} />
          </div>
        </div>
        
        <div style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{color: '#16a34a', fontSize: '0.875rem', fontWeight: '500'}}>עגלות פעילות</p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d'}}>{activeCarts.length}</p>
            </div>
            <Power style={{width: '2rem', height: '2rem', color: '#16a34a'}} />
          </div>
        </div>
        
        <div style={{backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '0.5rem', padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{color: '#7c3aed', fontSize: '0.875rem', fontWeight: '500'}}>סה"כ מחשבים</p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#581c87'}}>{totalComputers}</p>
            </div>
            <Computer style={{width: '2rem', height: '2rem', color: '#7c3aed'}} />
          </div>
        </div>
        
        <div style={{backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.5rem', padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{color: '#ea580c', fontSize: '0.875rem', fontWeight: '500'}}>מחוברים לטעינה</p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#9a3412'}}>{connectedComputers}/{totalComputers}</p>
            </div>
            <Battery style={{width: '2rem', height: '2rem', color: '#ea580c'}} />
          </div>
        </div>
      </div>

      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '1.5rem'}}>
        <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>הזמנות היום</h3>
        {todayReservations.length === 0 ? (
            <div>
            <p style={{color: '#6b7280', textAlign: 'center', padding: '1rem 0'}}>אין הזמנות להיום</p>
            {(currentUser?.role === 'manager' || currentUser?.role === 'superadmin') && (
              <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb'}}>
                <h4 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#ef4444'}}>הזמנות ממתינות לאישור</h4>
                {reservations.filter(res => res.status === 'pending').length === 0 ? (
                  <p style={{color: '#6b7280', textAlign: 'center'}}>אין הזמנות ממתינות לאישור</p>
                ) : (
                  <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    {reservations.filter(res => res.status === 'pending').map(res => (
                      <div key={res.id} style={{border: '1px solid #fbbf24', borderRadius: '0.5rem', padding: '0.75rem', backgroundColor: '#fffbeb'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                          <div>
                            <p style={{fontWeight: '500', color: '#92400e'}}>{res.cartName}</p>
                            <p style={{fontSize: '0.875rem', color: '#d97706'}}>{res.teacherName} - {res.className}</p>
                            <p style={{fontSize: '0.75rem', color: '#92400e'}}>{res.subject}</p>
                            <p style={{fontSize: '0.75rem', color: '#92400e'}}>
                              {new Date(res.date).toLocaleDateString('he-IL')} - {res.hour}:00-{res.hour + res.duration}:00
                            </p>
                          </div>
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            <button
                              onClick={() => approveReservation(res.id)}
                              style={{
                                backgroundColor: '#16a34a',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              אישור
                            </button>
                            <button
                              onClick={() => rejectReservation(res.id)}
                              style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                border: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              דחיה
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {todayReservations.map(res => (
              <div key={res.id} style={{border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem', backgroundColor: '#eff6ff'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                  <div>
                    <p style={{fontWeight: '500', color: '#1e3a8a'}}>{res.cartName}</p>
                    <p style={{fontSize: '0.875rem', color: '#1d4ed8'}}>{res.teacherName} - {res.className}</p>
                    <p style={{fontSize: '0.75rem', color: '#2563eb'}}>{res.subject}</p>
                  </div>
                  <div style={{textAlign: 'right', fontSize: '0.875rem', color: '#1d4ed8'}}>
                    <p>{res.hour}:00-{res.hour + res.duration}:00</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* אירועים ממתינים לאישור - עבור מנהלים */}
        {(currentUser?.role === 'manager' || currentUser?.role === 'superadmin') && 
         reservations.filter(res => res.status === 'pending').length > 0 && 
         todayReservations.length > 0 && (
          <div style={{marginTop: '2rem', paddingTop: '1rem', borderTop: '2px solid #e5e7eb'}}>
            <h4 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#ef4444'}}>
              🔴 הזמנות ממתינות לאישור ({reservations.filter(res => res.status === 'pending').length})
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
              {reservations.filter(res => res.status === 'pending').map(res => (
                <div key={res.id} style={{border: '1px solid #fbbf24', borderRadius: '0.5rem', padding: '0.75rem', backgroundColor: '#fffbeb'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                    <div>
                      <p style={{fontWeight: '500', color: '#92400e'}}>{res.cartName}</p>
                      <p style={{fontSize: '0.875rem', color: '#d97706'}}>{res.teacherName} - {res.className}</p>
                      <p style={{fontSize: '0.75rem', color: '#92400e'}}>{res.subject}</p>
                      <p style={{fontSize: '0.75rem', color: '#92400e'}}>
                        {new Date(res.date).toLocaleDateString('he-IL')} - {res.hour}:00-{res.hour + res.duration}:00
                      </p>
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <button
                        onClick={() => approveReservation(res.id)}
                        style={{
                          backgroundColor: '#16a34a',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ✓ אישור
                      </button>
                      <button
                        onClick={() => rejectReservation(res.id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.875rem',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        ✗ דחיה
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;