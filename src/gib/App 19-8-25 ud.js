import React, { useState } from 'react';
import { 
  Computer, 
  ShoppingCart, 
  Users, 
  Calendar,
  Power,
  Battery,
  MapPin,
  Plus,
  Shield,
  Activity,
  Settings,
  X,
  Edit,
  Save,
  Clock
} from 'lucide-react';

const SchoolCartManager = () => {

  // פונקציות שמירה וטעינה מ-localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log('שגיאה בשמירה:', error);
    }
  };

  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.log('שגיאה בטעינה:', error);
      return defaultValue;
    }
  };
  
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentWeek, setCurrentWeek] = useState(0);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [editingCart, setEditingCart] = useState(null);
  const [showCartDetails, setShowCartDetails] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

    const [notifications, setNotifications] = useState([
    {
      id: 1,
      userId: 'cohen@school.edu',
      message: 'ההזמנה שלך לעגלה A אושרה',
      type: 'success',
      read: false,
      createdAt: new Date()
    },
    {
      id: 2,
      userId: 'david@school.edu',
      message: 'יש הזמנה חדשה ממתינה לאישור',
      type: 'info',
      read: false,
      createdAt: new Date()
    }
  ]);
  
  const [showNotifications, setShowNotifications] = useState(false);

  const [schoolSettings, setSchoolSettings] = useState(() => loadFromStorage('schoolSettings', {

    workDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workStartTime: '08:00',
    workEndTime: '16:00',
    approvalPolicy: 'auto' // 'auto' = אישור אוטומטי, 'manual' = מנהל צריך לאשר
 }));

  const [users, setUsers] = useState(() => loadFromStorage('users', [
    { id: 1, name: 'מורה כהן', role: 'teacher', email: 'cohen@school.edu', password: '123456' },
    { id: 2, name: 'מנהל דוד', role: 'manager', email: 'david@school.edu', password: '123456' },
    { id: 3, name: 'טכנאי לוי', role: 'technician', email: 'levi@school.edu', password: '123456' },
    { id: 4, name: 'מנהל מערכת ראשי', role: 'masteradmin', email: 'info@innosys.co.il', password: 'In@3030548' }
  ]));

  const [carts, setCarts] = useState(() => loadFromStorage('carts', [
    {
      id: 1,
      name: 'עגלה A',
      location: 'קומה 1 - מסדרון מרכזי',
      status: 'active',
      totalComputers: 30,
      connectedComputers: 28,
      reservedBy: 'מורה כהן',
      color: '#2563eb' // כחול
    },
    {
      id: 2,
      name: 'עגלה B',
      location: 'קומה 2 - חדר מחשבים',
      status: 'maintenance',
      totalComputers: 25,
      connectedComputers: 23,
      currentUser: 'טכנאי לוי',
      color: '#16a34a' // ירוק
    },
    {
      id: 3,
      name: 'עגלה C',
      location: 'ספרייה',
      status: 'locked',
      totalComputers: 20,
      connectedComputers: 20,
      color: '#dc2626' // אדום
    }
  ]));

const [reservations, setReservations] = useState(() => loadFromStorage('reservations', [
    {
      id: 1,
      cartId: 1,
      cartName: 'עגלה A',
      teacherName: 'מורה כהן',
      teacherEmail: 'cohen@school.edu',
      className: 'כיתה ה',
      subject: 'מדעי המחשב',
      date: new Date(2025, 7, 18),
      hour: 9,
      duration: 1,
      status: 'confirmed',
      notes: 'שיעור תכנות לכיתה ה'
    },
    {
      id: 2,
      cartId: 2,
      cartName: 'עגלה B',
      teacherName: 'מורה לוי',
      teacherEmail: 'levi@school.edu',
      className: 'כיתה ז',
      subject: 'טכנולוגיה',
      date: new Date(2025, 7, 19),
      hour: 10,
      duration: 2,
      status: 'confirmed',
      notes: 'פרויקט מחקר'
    }
  ]));

  // שמירה אוטומטית כאשר הנתונים משתנים
  React.useEffect(() => {
    saveToStorage('schoolSettings', schoolSettings);
  }, [schoolSettings]);

  React.useEffect(() => {
    saveToStorage('users', users);
  }, [users]);

  React.useEffect(() => {
    saveToStorage('carts', carts);
  }, [carts]);

  React.useEffect(() => {
    saveToStorage('reservations', reservations);
  }, [reservations]);

  // סימולציה של שליחת אימיילים
 
  const sendEmailNotification = (to, subject, message, reservationId = null, type = 'email') => {
    console.log('📧 שליחת אימייל:');
    console.log(`📬 אל: ${to}`);
    console.log(`📋 נושא: ${subject}`);
    console.log(`📄 תוכן: ${message}`);
    
    // הוספת התראה למערכת
    const newNotification = {
      id: Date.now() + Math.random(),
      userId: to,
      message: `📧 ${message}`,
      type: type,
      reservationId: reservationId, // ← זה חשוב!
      read: false,
      createdAt: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // התראה ויזואלית (אופציונלי)
    setTimeout(() => {
      alert(`📧 אימייל נשלח ל-${to}: ${subject}`);
    }, 500);
  };

  // שליחת התראה למנהלים על הזמנה חדשה
  const notifyManagersOfPendingReservation = (reservation) => {
    const managers = users.filter(user => 
      user.role === 'manager' || user.role === 'superadmin'
    );
    
    managers.forEach(manager => {
      const subject = '🔔 הזמנה חדשה ממתינה לאישור';
      const message = `הזמנה חדשה מ-${reservation.teacherName} ל-${reservation.cartName} ביום ${new Date(reservation.date).toLocaleDateString('he-IL')} בשעה ${reservation.hour}:00`;
      
      // הוספת התראה למערכת עם קישור להזמנה
      const newNotification = {
        id: Date.now() + Math.random(), // וודא שה-ID יחיד
        userId: manager.email,
        message: `📧 ${message}`,
        type: 'pending_approval',
        reservationId: reservation.id, // ← זה החשוב!
        read: false,
        createdAt: new Date()
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      // שליחת אימייל (לוג)
      console.log('📧 שליחת אימייל:');
      console.log(`📬 אל: ${manager.email}`);
      console.log(`📋 נושא: ${subject}`);
      console.log(`📄 תוכן: ${message}`);
    });
  };

  // שליחת התראה למורה על אישור/דחיה
  const notifyTeacherOfReservationStatus = (reservation, status) => {
    const subject = status === 'approved' ? '✅ ההזמנה שלך אושרה' : '❌ ההזמנה שלך נדחתה';
    const message = status === 'approved' 
      ? `ההזמנה שלך ל-${reservation.cartName} ביום ${new Date(reservation.date).toLocaleDateString('he-IL')} בשעה ${reservation.hour}:00 אושרה בהצלחה!`
      : `ההזמנה שלך ל-${reservation.cartName} ביום ${new Date(reservation.date).toLocaleDateString('he-IL')} בשעה ${reservation.hour}:00 נדחתה.`;
    
    sendEmailNotification(reservation.teacherEmail, subject, message, reservation.id, 'email');

  };

  // מחיקת התראות ישנות של הזמנה מסוימת
  const removeNotificationsByReservation = (reservationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.reservationId !== reservationId)
    );
  };

  const handleLogin = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };
const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const updateCart = (cartId, updatedData) => {
    setCarts(prevCarts => 
      prevCarts.map(cart => 
        cart.id === cartId ? { ...cart, ...updatedData } : cart
      )
    );
    setEditingCart(null);
    alert('העגלה עודכנה בהצלחה');
  };

  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now(),
      password: newUser.password || '123456'
    };
    setUsers([...users, userWithId]);
    setShowAddUser(false);
    alert(`המשתמש ${newUser.name} נוסף בהצלחה למערכת`);
  };

  const addReservation = (newReservation) => {
    const requestedDate = new Date(newReservation.date);
    const startHour = newReservation.hour;
    const endHour = startHour + newReservation.duration;
    
    // בדיקה שהתאריך הוא ביום עבודה
  const dayOfWeek = requestedDate.getDay(); // 0=ראשון, 1=שני, וכו'
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const requestedDayName = dayNames[dayOfWeek];
  
  if (!schoolSettings.workDays.includes(requestedDayName)) {
    const hebrewDays = {
      'sunday': 'ראשון', 'monday': 'שני', 'tuesday': 'שלישי',
      'wednesday': 'רביעי', 'thursday': 'חמישי', 'friday': 'שישי', 'saturday': 'שבת'
    };
    alert(`לא ניתן לקבוע הזמנה ביום ${hebrewDays[requestedDayName]} - זה לא יום עבודה`);
    return;
  }
  
  // בדיקה שהשעה בטווח שעות העבודה
  const workStart = parseInt(schoolSettings.workStartTime.split(':')[0]);
  const workEnd = parseInt(schoolSettings.workEndTime.split(':')[0]);
  
  if (startHour < workStart || endHour > workEnd) {
    alert(`ההזמנה חייבת להיות בין השעות ${workStart}:00 - ${workEnd}:00`);
    return;
  }

    // בדיקת התנגשות
    const hasConflict = reservations.some(existingRes => {
      if (existingRes.cartId !== newReservation.cartId) return false;
      
      const existingDate = new Date(existingRes.date);
      if (existingDate.toDateString() !== requestedDate.toDateString()) return false;
      
      const existingStart = existingRes.hour;
      const existingEnd = existingRes.hour + existingRes.duration;
      
      return (startHour < existingEnd && endHour > existingStart);
    });
    
    if (hasConflict) {
      alert(`התנגשות: העגלה ${newReservation.cartName} תפוסה בזמן ${startHour}:00-${endHour}:00`);
      return;
    }

    // קבע סטטוס לפי מדיניות האישורים
    let status;
    if (schoolSettings.approvalPolicy === 'auto') {
      status = 'confirmed';
    } else {
      status = (currentUser?.role === 'manager' || currentUser?.role === 'superadmin') ? 'confirmed' : 'pending';
    }

    const reservation = {
      ...newReservation,
      id: Date.now(),
      status: status
    };
    
    // יצירת הזמנות (רגילה או חוזרת)
    const reservationsToCreate = [];
    
    if (newReservation.isRecurring && newReservation.recurringWeeks) {
      // יצירת הזמנות חוזרות
      for (let week = 0; week < newReservation.recurringWeeks; week++) {
        const weeklyDate = new Date(requestedDate);
        weeklyDate.setDate(weeklyDate.getDate() + (week * 7));
        
        // בדיקת התנגשות לכל שבוע
        const weeklyStartHour = startHour;
        const weeklyEndHour = endHour;
        
        const weeklyConflict = reservations.some(existingRes => {
          if (existingRes.cartId !== newReservation.cartId) return false;
          
          const existingDate = new Date(existingRes.date);
          if (existingDate.toDateString() !== weeklyDate.toDateString()) return false;
          
          const existingStart = existingRes.hour;
          const existingEnd = existingRes.hour + existingRes.duration;
          
          return (weeklyStartHour < existingEnd && weeklyEndHour > existingStart);
        });
        
        if (!weeklyConflict) {
          const weeklyReservation = {
            ...newReservation,
            id: Date.now() + week,
            date: weeklyDate,
            status: status,
            notes: `${newReservation.notes || ''} (הזמנה חוזרת - שבוע ${week + 1}/${newReservation.recurringWeeks})`
          };
          reservationsToCreate.push(weeklyReservation);
        }
      }
      
      if (reservationsToCreate.length < newReservation.recurringWeeks) {
        const conflictWeeks = newReservation.recurringWeeks - reservationsToCreate.length;
        const confirmPartial = window.confirm(
          `נמצאו התנגשויות ב-${conflictWeeks} שבועות. האם ליצור את ההזמנות הפנויות (${reservationsToCreate.length} מתוך ${newReservation.recurringWeeks})?`
        );
        if (!confirmPartial) {
          return;
        }
      }
    } else {
      // הזמנה רגילה
      reservationsToCreate.push(reservation);
    }
    
    // הוספת כל ההזמנות למערכת
    setReservations(prev => [...prev, ...reservationsToCreate]);
    setShowNewReservation(false);
    
    // שליחת התראות אימייל לכל הזמנה שנוצרה
    reservationsToCreate.forEach(res => {
      if (res.status === 'pending') {
        notifyManagersOfPendingReservation(res);
      }
    });
    
    // הודעת הצלחה
    if (reservationsToCreate.length === 1) {
      alert(`הזמנה נשמרה בהצלחה עבור ${reservation.cartName}`);
    } else {
      alert(`${reservationsToCreate.length} הזמנות חוזרות נשמרו בהצלחה עבור ${reservation.cartName}!`);
    }
  };

  const cancelReservation = (reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;
    
    const canCancel = reservation.teacherEmail === currentUser?.email || 
                     currentUser?.role === 'manager' || 
                     currentUser?.role === 'superadmin';
    
    if (!canCancel) {
      alert('אין לך הרשאה לבטל את ההזמנה הזו. רק המורה שביצע את ההזמנה או מנהל יכולים לבטל.');
      return;
    }
    
    const confirmCancel = window.confirm(`האם אתה בטוח שברצונך לבטל את ההזמנה של ${reservation.cartName} ב-${reservation.hour}:00?`);
    
    if (confirmCancel) {
      const newReservations = reservations.filter(r => r.id !== reservationId);
      setReservations(newReservations);
      alert('ההזמנה בוטלה בהצלחה');
    }
  };

  const approveReservation = (reservationId) => {
  const reservation = reservations.find(r => r.id === reservationId);
  setReservations(prevReservations =>
    prevReservations.map(res =>
      res.id === reservationId ? { ...res, status: 'confirmed' } : res
    )
  );
  
  // שליחת התראה למורה
  if (reservation) {
    notifyTeacherOfReservationStatus(reservation, 'approved');
  }
  
  // מחיקת התראות ישנות של ההזמנה הזו
  removeNotificationsByReservation(reservationId);

  alert('ההזמנה אושרה בהצלחה');
};

  const rejectReservation = (reservationId) => {
  const reservation = reservations.find(r => r.id === reservationId);
  const confirmReject = window.confirm(`האם אתה בטוח שברצונך לדחות את ההזמנה של ${reservation?.cartName}?`);
  
  if (confirmReject) {
    // שליחת התראה למורה לפני המחיקה
    if (reservation) {
      notifyTeacherOfReservationStatus(reservation, 'rejected');
    }
    
    setReservations(prevReservations =>
      prevReservations.filter(res => res.id !== reservationId)
    );

    // מחיקת התראות ישנות של ההזמנה הזו
      removeNotificationsByReservation(reservationId);

    alert('ההזמנה נדחתה ונמחקה');
  }
};

  if (!isAuthenticated) {
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
                <div><strong>מנהל מערכת:</strong> admin@system.com / admin123</div>
                <div><strong>מנהל בית ספר:</strong> david@school.edu / 123456</div>
                <div><strong>מורה:</strong> cohen@school.edu / 123456</div>
                <div><strong>טכנאי:</strong> levi@school.edu / 123456</div>
              </div>
            </div>

            <LoginForm onLogin={handleLogin} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl" style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      direction: 'rtl'
    }}>

<nav style={{backgroundColor: '#2563eb', color: 'white', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <Computer style={{width: '2rem', height: '2rem'}} />
            <h1 style={{fontSize: '1.25rem', fontWeight: 'bold'}}>מערכת ניהול עגלות מחשבים</h1>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem'}}>

            <button 
                  onClick={toggleNotifications}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  🔔
                </button>

            <span>{currentUser?.name}</span>
            <button 
              onClick={handleLogout}
              style={{backgroundColor: '#ef4444', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.75rem', border: 'none', color: 'white', cursor: 'pointer'}}
            >
              התנתק
            </button>
          </div>
        </div>
        
        <div style={{marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
          {['dashboard', 'carts', 'schedule', 
  ...(currentUser?.role === 'manager' || currentUser?.role === 'superadmin' ? ['users', 'reports'] : []),
  ...(currentUser?.role === 'manager' || currentUser?.role === 'superadmin' || currentUser?.role === 'technician' ? ['settings'] : [])
].map(view => (
            
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: currentView === view ? '#1d4ed8' : '#1e40af',
                color: 'white'
              }}
            >
              {view === 'dashboard' && <Activity style={{width: '1rem', height: '1rem'}} />}
              {view === 'carts' && <ShoppingCart style={{width: '1rem', height: '1rem'}} />}
              {view === 'schedule' && <Calendar style={{width: '1rem', height: '1rem'}} />}
              {view === 'users' && <Users style={{width: '1rem', height: '1rem'}} />}
              {view === 'reports' && <Activity style={{width: '1rem', height: '1rem'}} />}
              {view === 'settings' && <Settings style={{width: '1rem', height: '1rem'}} />}
              <span>
  {view === 'dashboard' ? 'דשבורד' :
   view === 'carts' ? 'עגלות' :
   view === 'schedule' ? 'לוח זמנים' :
   view === 'users' ? 'משתמשים' :
   view === 'reports' ? 'דוחות' : 'הגדרות'}
</span>
            </button>
          ))}
        </div>
      </nav>

      {showNotifications && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '20px',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          width: '300px',
          zIndex: 1000
        }}>
          <div style={{padding: '1rem', borderBottom: '1px solid #e5e7eb'}}>
            <h3 style={{fontSize: '1rem', fontWeight: '600', margin: 0}}>התראות</h3>
          </div>
          <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            {notifications.filter(n => n.userId === currentUser?.email).length === 0 ? (
              <div style={{padding: '1rem', textAlign: 'center', color: '#6b7280'}}>
                אין התראות חדשות
              </div>
            ) : (
              notifications.filter(n => n.userId === currentUser?.email).map(notification => (
  <div key={notification.id} style={{
    padding: '1rem',
    borderBottom: '1px solid #f3f4f6',
    backgroundColor: notification.read ? 'white' : '#f0f9ff'
  }}>
    <p style={{margin: 0, fontSize: '0.875rem'}}>{notification.message}</p>
    <p style={{margin: 0, fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem'}}>
      {notification.createdAt.toLocaleString('he-IL')}
    </p>
    
    {/* כפתורי אישור/דחיה רק להתראות של הזמנות ממתינות */}
    {notification.type === 'pending_approval' && 
     notification.reservationId &&
     (currentUser?.role === 'manager' || currentUser?.role === 'superadmin') && (
      <div style={{marginTop: '0.5rem', display: 'flex', gap: '0.5rem'}}>
        <button
          onClick={() => {
            approveReservation(notification.reservationId);
            // מסמן את ההתראה כנקראה
            setNotifications(prev => prev.map(n => 
              n.id === notification.id ? {...n, read: true} : n
            ));
          }}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ✓ אישור
        </button>
        <button
          onClick={() => {
            rejectReservation(notification.reservationId);
            // מסמן את ההתראה כנקראה
            setNotifications(prev => prev.map(n => 
              n.id === notification.id ? {...n, read: true} : n
            ));
          }}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ✗ דחיה
        </button>
      </div>
    )}
  </div>
))
            )}
          </div>
        </div>
      )}

      <main></main>

      

      <main>
        {currentView === 'dashboard' && <Dashboard carts={carts} reservations={reservations} currentUser={currentUser} approveReservation={approveReservation} rejectReservation={rejectReservation} />}
        {currentView === 'carts' && <CartsView carts={carts} currentUser={currentUser} editingCart={editingCart} setEditingCart={setEditingCart} showCartDetails={showCartDetails} setShowCartDetails={setShowCartDetails} updateCart={updateCart} />}
        {currentView === 'schedule' && <ScheduleView reservations={reservations} currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} showNewReservation={showNewReservation} setShowNewReservation={setShowNewReservation} addReservation={addReservation} cancelReservation={cancelReservation} carts={carts} currentUser={currentUser} schoolSettings={schoolSettings} />}
       {currentView === 'reports' && (currentUser?.role === 'manager' || currentUser?.role === 'superadmin') && (
          <ReportsView 
            carts={carts}
            reservations={reservations}
            users={users}
            schoolSettings={schoolSettings}
          />
        )}
        {currentView === 'reports' && (currentUser?.role !== 'manager' && currentUser?.role !== 'superadmin' && currentUser?.role !== 'masteradmin') && (
          <div style={{padding: '1.5rem'}}>
            <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1rem'}}>
              <h3 style={{color: '#991b1b', fontWeight: '500'}}>אין הרשאה</h3>
              <p style={{color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem'}}>רק מנהל מערכת או מנהל בית ספר יכולים לגשת לדוחות</p>
            </div>
          </div>
        )}
        {currentView === 'users' && (currentUser?.role === 'superadmin' || currentUser?.role === 'manager') && (
          <UsersView 
            users={users}
            currentUser={currentUser}
            showAddUser={showAddUser}
            setShowAddUser={setShowAddUser}
            addUser={addUser}
          />
        )}
        {currentView === 'users' && (currentUser?.role !== 'superadmin' && currentUser?.role !== 'manager') && (
          <div style={{padding: '1.5rem'}}>
            <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1rem'}}>
              <h3 style={{color: '#991b1b', fontWeight: '500'}}>אין הרשאה</h3>
              <p style={{color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem'}}>רק מנהל מערכת או מנהל בית ספר יכולים לגשת לניהול משתמשים</p>
            </div>
          </div>
        )}

        {currentView === 'settings' && (currentUser?.role === 'manager' || currentUser?.role === 'superadmin' || currentUser?.role === 'technician') && (
          <SettingsView 
            schoolSettings={schoolSettings}
            setSchoolSettings={setSchoolSettings}
          />
        )}
        {currentView === 'settings' && (currentUser?.role !== 'manager' && currentUser?.role !== 'superadmin' && currentUser?.role !== 'technician') && (
          <div style={{padding: '1.5rem'}}>
            <div style={{backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1rem'}}>
              <h3 style={{color: '#991b1b', fontWeight: '500'}}>אין הרשאה</h3>
              <p style={{color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem'}}>רק מנהל מערכת או מנהל בית ספר יכולים לגשת להגדרות מערכת</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const success = onLogin(email, password);
    if (!success) {
      setError('אימייל או סיסמה שגויים');
    }
  };

  return (
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
  );
};

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
     

const CartsView = ({ carts, currentUser, editingCart, setEditingCart, showCartDetails, setShowCartDetails, updateCart }) => {
  return (
    <div style={{padding: '1.5rem'}}>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>ניהול עגלות</h2>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
        {carts.map(cart => (
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

      {editingCart && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem'}}>
          <div style={{backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '32rem', width: '100%'}}>
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
                {(currentUser?.role === 'manager' || currentUser?.role === 'superadmin' || currentUser?.role === 'technician') && (
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
    </div>
  );
};

const EditCartForm = ({ cart, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: cart.name,
    location: cart.location,
    status: cart.status,
    totalComputers: cart.totalComputers,
    connectedComputers: cart.connectedComputers,
    color: cart.color || '#2563eb'
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

const ScheduleView = ({ 
  reservations, 
  currentWeek, 
  setCurrentWeek, 
  showNewReservation, 
  setShowNewReservation, 
  addReservation, 
  cancelReservation,
  carts, 
  currentUser,
  schoolSettings,
}) => {
  const getWeekDates = (weekOffset = 0) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (weekOffset * 7));
    
    const weekDates = [];
    const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push({
        dayName: dayNames[i],
        date: date.getDate(),
        month: date.getMonth() + 1,
        dateObj: date,
        isWorkDay: schoolSettings.workDays.includes(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][i])
      });
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentWeek);

  const getCartColor = (cartId) => {
    const cart = carts.find(c => c.id === cartId);
    return cart?.color || '#2563eb';
  };
  const workHours = Array.from({length: 9}, (_, i) => i + 8); // 8:00 - 16:00

  const getReservationsForSlot = (dayDate, hour) => {
    return filteredReservations.filter(res => {
      const resDate = new Date(res.date);
      return resDate.toDateString() === dayDate.toDateString() && 
             res.hour <= hour && 
             res.hour + res.duration > hour;
    });
  };

  return (
    <div style={{padding: '1.5rem'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>לוח זמנים והזמנות</h2>
        <button 
          onClick={() => setShowNewReservation(true)}
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
          <span>הזמנה חדשה</span>
        </button>

{showNewReservation && (
  <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem', overflowY: 'auto'}}>
    <div style={{backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '48rem', width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: 'auto'}}>
            <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>הזמנה חדשה</h3>
                <button
                  onClick={() => setShowNewReservation(false)}
                  style={{color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer'}}
                >
                  <X style={{width: '1.5rem', height: '1.5rem'}} />
                </button>
              </div>
            </div>
            
            <NewReservationForm 
              carts={carts}
              currentUser={currentUser}
              onSubmit={addReservation}
              onCancel={() => setShowNewReservation(false)}
            />
          </div>
        </div>
      )}
      </div>

      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '2px solid #e5e7eb', marginBottom: '1.5rem'}}>
        <div style={{padding: '1rem', borderBottom: '2px solid #f3f4f6', backgroundColor: '#f9fafb'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 style={{fontSize: '1.125rem', fontWeight: '600'}}>לוח זמנים שבועי</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <button 
                onClick={() => setCurrentWeek(currentWeek - 1)}
                style={{padding: '0.25rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', cursor: 'pointer'}}
              >
                השבוע הקודם
              </button>
              <button 
                onClick={() => setCurrentWeek(0)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: currentWeek === 0 ? '#2563eb' : '#dbeafe',
                  color: currentWeek === 0 ? 'white' : '#2563eb'
                }}
              >
                השבוע הנוכחי
              </button>
              <button 
                onClick={() => setCurrentWeek(currentWeek + 1)}
                style={{padding: '0.25rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', backgroundColor: 'white', cursor: 'pointer'}}
              >
                השבוע הבא
              </button>
            </div>
          </div>
        </div>
        
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%'}}>
            <thead style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
              <tr>
                <th style={{padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>שעה</th>
                {weekDates.map((day, index) => (
                  <th key={index} style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: day.isWorkDay ? '#111827' : '#9ca3af',
                    borderRight: '1px solid #e5e7eb'
                  }}>
                    <div>{day.dayName}</div>
                    <div style={{fontSize: '0.75rem'}}>{day.date}/{day.month}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workHours.map((hour, hourIndex) => (
                <tr key={hour} style={{
                  borderBottom: hourIndex === workHours.length - 1 ? '2px solid #d1d5db' : '1px solid #e5e7eb',
                  height: '80px'
                  
                }}>
                
                  <td style={{
                    padding: '0.5rem 1rem', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151',
                    borderRight: '2px solid #d1d5db',
                    borderBottom: hourIndex === workHours.length - 1 ? '2px solid #d1d5db' : '1px solid #e5e7eb',
                    verticalAlign: 'middle'
                  }}>
                    {hour}:00
                  </td>

                  {weekDates.map((day, dayIndex) => {
                    const slotReservations = getReservationsForSlot(day.dateObj, hour);
                    return (
                      <td key={`${dayIndex}-${hour}`} style={{
                        padding: '4px',
                        textAlign: 'left',
                        fontSize: '0.75rem',
                        backgroundColor: !day.isWorkDay ? '#f3f4f6' : '',
                        borderRight: dayIndex === weekDates.length - 1 ? 'none' : '1px solid #e5e7eb',
                        borderBottom: hourIndex === workHours.length - 1 ? '2px solid #d1d5db' : '1px solid #e5e7eb',
                        verticalAlign: 'top',
                        height: '80px',
                        position: 'relative'
                      }}>

                        {day.isWorkDay && slotReservations.length > 0 ? (
                          <div style={{
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '2px',
                            height: '100%',
                            paddingTop: '2px'
                          }}>
                            {slotReservations.map(reservation => (
                              <div key={reservation.id} style={{
                                backgroundColor: reservation.status === 'pending' ? '#fef3c7' : `${getCartColor(reservation.cartId)}20`, 
  border: reservation.status === 'pending' ? '2px solid #f59e0b' : `1px solid ${getCartColor(reservation.cartId)}`, 
  borderRadius: '4px', 
  padding: '4px', 
  position: 'relative',
  fontSize: '10px',
  lineHeight: '1.2'
                              }}>

                                {(reservation.teacherEmail === currentUser?.email || 
                                  currentUser?.role === 'manager' || 
                                  currentUser?.role === 'superadmin') && (
                                  <button
                                    onClick={() => cancelReservation(reservation.id)}
                                    style={{
                                      position: 'absolute',
                                      top: '2px',
                                      right: '2px',
                                      backgroundColor: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '16px',
                                      height: '16px',
                                      fontSize: '10px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      lineHeight: '1'
                                    }}
                                    title="בטל הזמנה"
                                  >
                                    ×
                                  </button>
                                )}
                                <div style={{fontWeight: '500', color: reservation.status === 'pending' ? '#92400e' : '#1e40af'}}>
  {reservation.cartName} {reservation.status === 'pending' && '⏳'}
</div>
<div style={{color: reservation.status === 'pending' ? '#d97706' : '#2563eb'}}>{reservation.teacherName}</div>
<div style={{color: reservation.status === 'pending' ? '#b45309' : '#3b82f6'}}>{reservation.className}</div>
{reservation.status === 'pending' && (
  <div style={{color: '#92400e', fontSize: '9px', fontWeight: 'bold'}}>ממתין לאישור</div>
)}

                              </div>
                            ))}
                          </div>
                        ) : day.isWorkDay ? (
                          <div style={{color: '#d1d5db'}}>פנוי</div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '1.5rem'}}>
        <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>הזמנות קיימות</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
          {filteredReservations.map(reservation => (
            <div key={reservation.id} style={{border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1rem', backgroundColor: '#f9fafb'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <h4 style={{fontWeight: '500', color: '#111827'}}>{reservation.cartName}</h4>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: reservation.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                      color: reservation.status === 'confirmed' ? '#166534' : '#92400e'
                    }}>
                      {reservation.status === 'confirmed' ? 'מאושר' : 'בהמתנה'}
                    </span>
                  </div>
                  <div style={{marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.875rem', color: '#6b7280'}}>
                    <div>מורה: {reservation.teacherName}</div>
                    <div>כיתה: {reservation.className}</div>
                    <div>מקצוע: {reservation.subject}</div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <Clock style={{width: '0.75rem', height: '0.75rem', marginLeft: '0.25rem'}} />
                      {new Date(reservation.date).toLocaleDateString('he-IL')} - {reservation.hour}:00-{reservation.hour + reservation.duration}:00
                    </div>
                  </div>
                  {reservation.notes && (
                    <div style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                      הערות: {reservation.notes}
                    </div>
                  )}
                </div>
                
                <div style={{marginRight: '1rem'}}>
                  {(reservation.teacherEmail === currentUser?.email || 
                    currentUser?.role === 'manager' || 
                    currentUser?.role === 'superadmin') && (
                    <button
                      onClick={() => cancelReservation(reservation.id)}
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
                      ביטול
                    </button>
                  )}
                </div>
                
              </div>
            </div>
          ))}
          
          {reservations.length === 0 && (
            <div style={{textAlign: 'center', padding: '2rem 0', color: '#6b7280'}}>
              אין הזמנות במערכת
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NewReservationForm = ({ carts, currentUser, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    cartId: '',
    cartName: '',
    teacherName: currentUser?.name || '',
    teacherEmail: currentUser?.email || '',
    className: '',
    subject: '',
    date: '',
    hour: 8,
    duration: 1,
    notes: ''
  });

  const handleCartChange = (cartId) => {
    const cart = carts.find(c => c.id === parseInt(cartId));
    setFormData({
      ...formData,
      cartId: parseInt(cartId),
      cartName: cart ? cart.name : ''
    });
  };

  const handleSubmit = () => {
    if (!formData.cartId || !formData.date || !formData.className || !formData.subject) {
      alert('יש למלא את כל השדות הנדרשים');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>עגלה *</label>
        <select
          value={formData.cartId}
          onChange={(e) => handleCartChange(e.target.value)}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
        >
          <option value="">בחר עגלה</option>
          {carts.filter(cart => cart.status === 'active').map(cart => (
            <option key={cart.id} value={cart.id}>{cart.name} - {cart.location}</option>
          ))}
        </select>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שם המורה</label>
          <input
            type="text"
            value={formData.teacherName}
            onChange={(e) => setFormData({...formData, teacherName: e.target.value})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: '#f3f4f6', boxSizing: 'border-box'}}
            readOnly
          />
        </div>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>כיתה *</label>
          <input
            type="text"
            value={formData.className}
            onChange={(e) => setFormData({...formData, className: e.target.value})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
            placeholder="למשל: כיתה ו'"
          />
        </div>
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>מקצוע *</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          placeholder="למשל: מדעי המחשב"
        />
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>תאריך *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          />
        </div>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>
            <input
              type="checkbox"
              checked={formData.isRecurring || false}
              onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
              style={{marginLeft: '0.5rem'}}
            />
            הזמנה חוזרת (כל שבוע)
          </label>
        </div>
        
        {formData.isRecurring && (
          <div style={{backgroundColor: '#f0f9ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '1rem'}}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>מספר שבועות</label>
                <select
                  value={formData.recurringWeeks || 4}
                  onChange={(e) => setFormData({...formData, recurringWeeks: parseInt(e.target.value)})}
                  style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
                >
                  <option value={2}>2 שבועות</option>
                  <option value={4}>4 שבועות</option>
                  <option value={8}>8 שבועות</option>
                  <option value={12}>12 שבועות</option>
                  <option value={16}>16 שבועות (סמסטר)</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>תאריך סיום</label>
                <input
                  type="text"
                  value={formData.date && formData.recurringWeeks ? 
                    new Date(new Date(formData.date).getTime() + (formData.recurringWeeks - 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('he-IL') 
                    : 'בחר תאריך התחלה'}
                  readOnly
                  style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', backgroundColor: '#f9fafb', boxSizing: 'border-box'}}
                />
              </div>
            </div>
            <p style={{fontSize: '0.75rem', color: '#2563eb', marginTop: '0.5rem', margin: 0}}>
              💡 ייווצרו {formData.recurringWeeks || 4} הזמנות - כל שבוע באותו יום ושעה
            </p>
          </div>
        )}
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שעה</label>
          <select
            value={formData.hour}
            onChange={(e) => setFormData({...formData, hour: parseInt(e.target.value)})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          >
            {Array.from({length: 9}, (_, i) => i + 8).map(hour => (
              <option key={hour} value={hour}>{hour}:00</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>משך (שעות)</label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
            style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          >
            <option value={1}>שעה אחת</option>
            <option value={2}>שעתיים</option>
            <option value={3}>שלוש שעות</option>
          </select>
        </div>
      </div>
      
      <div>
        <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>הערות</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
          rows="3"
          placeholder="הערות נוספות (אופציונלי)"
        />
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
          שמור הזמנה
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

const UsersView = ({ users, currentUser, showAddUser, setShowAddUser, addUser }) => {
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
              {users.map(user => (
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
                      <button style={{color: '#2563eb', fontSize: '0.875rem', background: 'none', border: 'none', cursor: 'pointer'}}>
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
            />
          </div>
        </div>
      )}
    </div>
  );
};

const AddUserForm = ({ onSubmit, onCancel }) => {
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
          <option value="manager">מנהל</option>
          <option value="technician">טכנאי</option>
          <option value="superadmin">מנהל מערכת</option>
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
                <span style={{fontSize: '0.875rem', fontWeight: '500', color: '#111827'}}>1.0.0</span>
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

const ReportsView = ({ carts, reservations, users, schoolSettings }) => {

  // פילטרים
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCart, setSelectedCart] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  // סינון הזמנות לפי פילטרים
  const filteredReservations = reservations.filter(r => {
    const resDate = new Date(r.date);
    let matchesFilters = true;
    
    // פילטר חודש ושנה
    if (selectedMonth !== 'all') {
      matchesFilters = matchesFilters && resDate.getMonth() === parseInt(selectedMonth);
    }
    if (selectedYear !== 'all') {
      matchesFilters = matchesFilters && resDate.getFullYear() === parseInt(selectedYear);
    }
    
    // פילטר עגלה
    if (selectedCart !== 'all') {
      matchesFilters = matchesFilters && r.cartId === parseInt(selectedCart);
    }
    
    // פילטר מורה
    if (selectedTeacher !== 'all') {
      matchesFilters = matchesFilters && r.teacherName === selectedTeacher;
    }
    
    return matchesFilters;
  });

  // חישוב סטטיסטיקות
  const totalReservations = filteredReservations.length;
  const confirmedReservations = filteredReservations.filter(r => r.status === 'confirmed').length;
  const pendingReservations = filteredReservations.filter(r => r.status === 'pending').length;

  // הזמנות בתקופה הנבחרת
  const filteredCount = filteredReservations.length;
  
  // עגלה הכי פופולרית (מהנתונים המסוננים)
  const cartPopularity = carts.map(cart => ({
    name: cart.name,
    reservations: filteredReservations.filter(r => r.cartId === cart.id).length
  })).sort((a, b) => b.reservations - a.reservations);
  
  // מורים הכי פעילים (מהנתונים המסוננים)
  const teacherActivity = {};
  filteredReservations.forEach(r => {
    teacherActivity[r.teacherName] = (teacherActivity[r.teacherName] || 0) + 1;
  });
  const topTeachers = Object.entries(teacherActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div style={{padding: '1.5rem'}}>
      <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>דוחות וסטטיסטיקות</h2>

{/* פילטרים */}
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '1.5rem'}}>
        <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>🔍 פילטרים</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>חודש</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem'}}
            >
              <option value="all">כל החודשים</option>
              <option value="0">ינואר</option>
              <option value="1">פברואר</option>
              <option value="2">מרץ</option>
              <option value="3">אפריל</option>
              <option value="4">מאי</option>
              <option value="5">יוני</option>
              <option value="6">יולי</option>
              <option value="7">אוגוסט</option>
              <option value="8">ספטמבר</option>
              <option value="9">אוקטובר</option>
              <option value="10">נובמבר</option>
              <option value="11">דצמבר</option>
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>שנה</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem'}}
            >
              <option value="all">כל השנים</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>עגלה</label>
            <select
              value={selectedCart}
              onChange={(e) => setSelectedCart(e.target.value)}
              style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem'}}
            >
              <option value="all">כל העגלות</option>
              {carts.map(cart => (
                <option key={cart.id} value={cart.id}>{cart.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem'}}>מורה</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem'}}
            >
              <option value="all">כל המורים</option>
              {[...new Set(reservations.map(r => r.teacherName))].map(teacher => (
                <option key={teacher} value={teacher}>{teacher}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
          <button
            onClick={() => {
              setSelectedMonth('all');
              setSelectedYear('all');
              setSelectedCart('all');
              setSelectedTeacher('all');
            }}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🔄 איפוס פילטרים
          </button>

          <button
            onClick={() => {
              // יצירת נתונים לייצוא
              const exportData = filteredReservations.map(r => ({
                'תאריך': new Date(r.date).toLocaleDateString('he-IL'),
                'שעה': `${r.hour}:00-${r.hour + r.duration}:00`,
                'עגלה': r.cartName,
                'מורה': r.teacherName,
                'כיתה': r.className,
                'מקצוע': r.subject,
                'סטטוס': r.status === 'confirmed' ? 'מאושר' : 'ממתין',
                'הערות': r.notes || ''
              }));
              
              // המרה ל-CSV
              const headers = Object.keys(exportData[0] || {});
              const csvContent = [
                headers.join(','),
                ...exportData.map(row => 
                  headers.map(header => `"${row[header]}"`).join(',')
                )
              ].join('\n');
              
              // הורדת הקובץ
              const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', `דוח_הזמנות_${new Date().toISOString().split('T')[0]}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              alert(`✅ הקובץ הורד בהצלחה! (${exportData.length} הזמנות)`);
            }}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📋 יצוא לאקסל
          </button>
          
          <button
            onClick={() => {
              // יצוא סטטיסטיקות
              const statsData = [
                ['סטטיסטיקה', 'ערך'],
                ['סה"כ הזמנות', totalReservations],
                ['הזמנות מאושרות', confirmedReservations],
                ['ממתינות לאישור', pendingReservations],
                ['בתקופה הנבחרת', filteredReservations.length],
                [''],
                ['עגלה פופולרית ביותר', cartPopularity[0]?.name || 'אין נתונים'],
                ['מספר הזמנות לעגלה', cartPopularity[0]?.reservations || 0],
                [''],
                ['מורה פעיל ביותר', topTeachers[0]?.[0] || 'אין נתונים'],
                ['מספר הזמנות למורה', topTeachers[0]?.[1] || 0]
              ];
              
              const csvContent = statsData.map(row => 
                row.map(cell => `"${cell}"`).join(',')
              ).join('\n');
              
              const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', `סטטיסטיקות_${new Date().toISOString().split('T')[0]}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              alert('📊 קובץ הסטטיסטיקות הורד בהצלחה!');
            }}
            style={{
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📊 יצוא סטטיסטיקות
          </button>
        </div>
      </div>

      {/* כרטיסי סטטיסטיקות */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{color: '#2563eb', fontSize: '0.875rem', fontWeight: '500'}}>סה"כ הזמנות</p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1e3a8a'}}>{totalReservations}</p>
            </div>
            <Calendar style={{width: '2rem', height: '2rem', color: '#2563eb'}} />
          </div>
        </div>
        
        <div style={{backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{color: '#16a34a', fontSize: '0.875rem', fontWeight: '500'}}>הזמנות מאושרות</p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#14532d'}}>{confirmedReservations}</p>
            </div>
            <Activity style={{width: '2rem', height: '2rem', color: '#16a34a'}} />
          </div>
        </div>
        
        <div style={{backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.5rem', padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{color: '#ea580c', fontSize: '0.875rem', fontWeight: '500'}}>ממתינות לאישור</p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#9a3412'}}>{pendingReservations}</p>
            </div>
            <Clock style={{width: '2rem', height: '2rem', color: '#ea580c'}} />
          </div>
        </div>
        
        <div style={{backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '0.5rem', padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div>
              <p style={{color: '#7c3aed', fontSize: '0.875rem', fontWeight: '500'}}>בתקופה הנבחרת</p>
              <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#581c87'}}>{filteredCount}</p>
            </div>
            <Calendar style={{width: '2rem', height: '2rem', color: '#7c3aed'}} />
          </div>
        </div>
      </div>

      {/* גרפים ונתונים */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
        {/* עגלות פופולריות */}
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '1.5rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>עגלות פופולריות</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {cartPopularity.map((cart, index) => (
              <div key={cart.name} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{fontSize: '0.875rem'}}>{index + 1}. {cart.name}</span>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{
                    width: `${Math.max(cart.reservations * 20, 20)}px`, 
                    height: '8px', 
                    backgroundColor: '#2563eb', 
                    borderRadius: '4px'
                  }}></div>
                  <span style={{fontSize: '0.875rem', fontWeight: '500'}}>{cart.reservations}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* מורים פעילים */}
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '1.5rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>מורים פעילים</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            {topTeachers.map(([teacher, count], index) => (
              <div key={teacher} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span style={{fontSize: '0.875rem'}}>{index + 1}. {teacher}</span>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <div style={{
                    width: `${Math.max(count * 15, 15)}px`, 
                    height: '8px', 
                    backgroundColor: '#16a34a', 
                    borderRadius: '4px'
                  }}></div>
                  <span style={{fontSize: '0.875rem', fontWeight: '500'}}>{count}</span>

                  {/* גרף הזמנות לפי חודשים */}
        <div style={{backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb', padding: '1.5rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>הזמנות לפי חודשים</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {(() => {
              // חישוב הזמנות לפי חודשים
              const monthlyData = {};
              const monthNames = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
              
              // אתחול כל החודשים לאפס
              monthNames.forEach((month, index) => {
                monthlyData[index] = { name: month, count: 0 };
              });
              
              // ספירת הזמנות לפי חודש
              reservations.forEach(r => {
                const month = new Date(r.date).getMonth();
                monthlyData[month].count++;
              });
              
              const maxCount = Math.max(...Object.values(monthlyData).map(m => m.count), 1);
              
              return Object.values(monthlyData).map((monthData, index) => (
                <div key={index} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                  <span style={{fontSize: '0.875rem', minWidth: '60px'}}>{monthData.name}</span>
                  <div style={{flex: 1, marginLeft: '0.5rem', marginRight: '0.5rem'}}>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(monthData.count / maxCount) * 100}%`,
                        height: '100%',
                        backgroundColor: '#7c3aed',
                        borderRadius: '6px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                  <span style={{fontSize: '0.875rem', fontWeight: '500', minWidth: '30px', textAlign: 'right'}}>{monthData.count}</span>
                </div>
              ));
            })()}
          </div>
        </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolCartManager;