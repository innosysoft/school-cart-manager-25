import React, { useState } from 'react';
import LoginForm from './components/Login';
import Dashboard from './components/Dashboard';
import CartsView from './components/Carts';
import UsersView from './components/Users';
import ScheduleView from './components/Schedule';
import ReportsView from './components/Reports';
import SettingsView from './components/Settings';


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

 // בתי ספר
  const [schools, setSchools] = useState(() => loadFromStorage('schools', [
  {
    id: 1,
    name: 'בית ספר יסודי הרצל',
    symbolCode: '123456',
    address: 'רחוב הרצל 15, תל אביב',
    phone: '03-1234567',
    email: 'herzel@school.edu'
  }
]));
  
  const [selectedSchool, setSelectedSchool] = useState(() => loadFromStorage('selectedSchool', 1));

  const [users, setUsers] = useState(() => loadFromStorage('users', [
  { id: 1, name: 'מורה כהן', role: 'teacher', email: 'cohen@school.edu', password: '123456', schoolId: 1 },
  { id: 2, name: 'מנהל דוד', role: 'manager', email: 'david@school.edu', password: '123456', schoolId: 1 },
  { id: 3, name: 'טכנאי לוי', role: 'technician', email: 'levi@school.edu', password: '123456', schoolId: 1 },
  { id: 4, name: 'מנהל מערכת ראשי', role: 'masteradmin', email: 'info@innosys.co.il', password: 'In@3030548', schoolId: null }
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
      color: '#2563eb', // כחול
      schoolId: 1,
      
magneticCheckEnabled: true,     // בדיקת מגנט
powerCheckEnabled: true,        // בדיקת טעינה
autoLockEnabled: true,          // נעילה אוטומטית
alertThresholdMinutes: 10,      // זמן התרעה

// מצב עדכני (יתעדכן מהחומרה)
currentDoorStatus: 'closed',    // 'open', 'closed', 'unknown'
currentPowerStatus: 'ok',       // 'ok', 'warning', 'error'
lastSensorUpdate: new Date(),
    },
    {
      id: 2,
      name: 'עגלה B',
      location: 'קומה 2 - חדר מחשבים',
      status: 'maintenance',
      totalComputers: 25,
      connectedComputers: 23,
      currentUser: 'טכנאי לוי',
      color: '#16a34a', // ירוק
      schoolId: 1,
      magneticCheckEnabled: true,     // בדיקת מגנט
powerCheckEnabled: true,        // בדיקת טעינה
autoLockEnabled: true,          // נעילה אוטומטית
alertThresholdMinutes: 10,      // זמן התרעה

// מצב עדכני (יתעדכן מהחומרה)
currentDoorStatus: 'closed',    // 'open', 'closed', 'unknown'
currentPowerStatus: 'ok',       // 'ok', 'warning', 'error'
lastSensorUpdate: new Date(),
    },
    {
      id: 3,
      name: 'עגלה C',
      location: 'ספרייה',
      status: 'locked',
      totalComputers: 20,
      connectedComputers: 20,
      color: '#dc2626', // אדום
      schoolId: 1,
      magneticCheckEnabled: true,     // בדיקת מגנט
powerCheckEnabled: true,        // בדיקת טעינה
autoLockEnabled: true,          // נעילה אוטומטית
alertThresholdMinutes: 10,      // זמן התרעה

// מצב עדכני (יתעדכן מהחומרה)
currentDoorStatus: 'closed',    // 'open', 'closed', 'unknown'
currentPowerStatus: 'ok',       // 'ok', 'warning', 'error'
lastSensorUpdate: new Date(),
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
      notes: 'שיעור תכנות לכיתה ה',
      schoolId: 1
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
      notes: 'פרויקט מחקר',
      schoolId: 1
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

  React.useEffect(() => {
    saveToStorage('schools', schools);
  }, [schools]);

  React.useEffect(() => {
    saveToStorage('selectedSchool', selectedSchool);
  }, [selectedSchool]);

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
    password: newUser.password || '123456',
    schoolId: selectedSchool
  };
  setUsers([...users, userWithId]);
  setShowAddUser(false);
  alert(`המשתמש ${newUser.name} נוסף בהצלחה למערכת`);
};

const updateUser = (updatedUser) => {
  setUsers(prevUsers => 
    prevUsers.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    )
  );
  alert(`המשתמש ${updatedUser.name} עודכן בהצלחה`);
};

const deleteUser = (userId) => {
  setUsers(prevUsers => 
    prevUsers.filter(user => user.id !== userId)
  );
  alert('המשתמש נמחק בהצלחה');
};

const addCart = (newCart) => {
  const cartWithId = {
    ...newCart,
    id: Date.now(),
    color: newCart.color || '#2563eb',
    schoolId: selectedSchool || currentUser?.schoolId
  };
  setCarts([...carts, cartWithId]);
  alert(`העגלה ${newCart.name} נוספה בהצלחה למערכת`);
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
      status: status,
      schoolId: selectedSchool || currentUser?.schoolId
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
            notes: `${newReservation.notes || ''} (הזמנה חוזרת - שבוע ${week + 1}/${newReservation.recurringWeeks})`,
            schoolId: selectedSchool || currentUser?.schoolId
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


React.useEffect(() => {
  const handleApiRequest = (path, method, data) => {
    console.log(`📡 API Call: ${method} ${path}`, data);
  console.log('🔍 Debug:', { path, method, isStatus: path.includes('/status') });
    // בדיקת מצב עגלה
    if (path.includes('/status') && method === 'GET') {
      
  // נחלץ את cartId מהנתיב /api/cart/1/status
  const pathParts = path.split('/');
  const cartIdIndex = pathParts.indexOf('cart') + 1;
  const cartId = parseInt(pathParts[cartIdIndex]);
  
  console.log('🔍 מחפש עגלה:', cartId);
      const cart = carts.find(c => c.id === cartId);
      
      if (!cart) {
        return { error: 'עגלה לא נמצאה', code: 404 };
      }
      
      return {
        cartId: cart.id,
        name: cart.name,
        status: cart.status,
        settings: {
          magneticCheckEnabled: cart.magneticCheckEnabled,
          powerCheckEnabled: cart.powerCheckEnabled,
          autoLockEnabled: cart.autoLockEnabled,
          alertThresholdMinutes: cart.alertThresholdMinutes
        },
        currentState: {
          doorStatus: cart.currentDoorStatus,
          powerStatus: cart.currentPowerStatus,
          lastUpdate: cart.lastSensorUpdate
        },
        timestamp: new Date().toISOString()
      };
    }
    
    // בדיקת הרשאה
    if (path === '/api/cart/access' && method === 'POST') {
      const { cartId, userEmail, currentTime } = data;
      
      // בדיקה האם יש הזמנה פעילה
      const now = currentTime ? new Date(currentTime) : new Date();
      const currentHour = now.getHours();
      const today = now.toDateString();
      
      const activeReservation = reservations.find(res => {
        const resDate = new Date(res.date);
        return (
          res.cartId === cartId &&
          res.teacherEmail === userEmail &&
          res.status === 'confirmed' &&
          resDate.toDateString() === today &&
          res.hour <= currentHour &&
          res.hour + res.duration > currentHour
        );
      });
      
      if (activeReservation) {
        return {
          allowed: true,
          message: 'גישה מאושרת - יש הזמנה פעילה',
          reservation: {
            id: activeReservation.id,
            startHour: activeReservation.hour,
            endHour: activeReservation.hour + activeReservation.duration,
            className: activeReservation.className,
            subject: activeReservation.subject
          }
        };
      }
      
      // בדיקה אם המשתמש הוא מנהל או טכנאי
      const user = users.find(u => u.email === userEmail);
      if (user && (user.role === 'manager' || user.role === 'technician' || user.role === 'masteradmin')) {
        return {
          allowed: true,
          message: 'גישה מאושרת - הרשאת מנהל/טכנאי',
          adminAccess: true
        };
      }
      
      return {
        allowed: false,
        message: 'גישה נדחתה - אין הזמנה פעילה או הרשאה',
        reason: 'no_active_reservation'
      };
    }
    
    // עדכון חיישנים
    if (path.startsWith('/api/cart/') && path.includes('/sensors') && method === 'POST') {
      const cartId = parseInt(path.split('/')[3]);
      const { doorStatus, powerStatus, voltage, current } = data;
      
      // עדכון מצב העגלה במערכת
      setCarts(prevCarts => 
        prevCarts.map(cart => 
          cart.id === cartId ? {
            ...cart,
            currentDoorStatus: doorStatus,
            currentPowerStatus: powerStatus,
            lastSensorUpdate: new Date().toISOString()
          } : cart
        )
      );
      
      return {
        success: true,
        message: 'נתוני חיישנים עודכנו',
        cartId: cartId
      };
    }
    
    return { error: 'API endpoint לא נמצא', code: 404 };
  };

  window.cartAPI = handleApiRequest;
  console.log('🎯 Cart API מוכן עם endpoints מתקדמים!');
  console.log('נסה: window.cartAPI("/api/cart/1/status", "GET")');
}, [carts, reservations, users]);
  if (!isAuthenticated) {
  return <LoginForm onLogin={handleLogin} />;
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
<h1 style={{fontSize: '1.25rem', fontWeight: 'bold'}}>
  מערכת ניהול עגלות מחשבים
  {selectedSchool && (
    <span style={{fontSize: '1rem', fontWeight: 'normal', marginRight: '1rem', color: '#dbeafe'}}>
      - {schools.find(s => s.id === selectedSchool)?.name}
    </span>
  )}
</h1>      
      {/* רשימה נפתחת לבחירת בית ספר - רק למנהל ראשי */}
      {(currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') && (
        <div style={{marginRight: '2rem'}}>

          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(parseInt(e.target.value))}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #3b82f6',
              backgroundColor: 'white',
              color: '#1e40af',
              fontSize: '0.875rem'
            }}
          >
            {schools.map(school => (
              <option key={school.id} value={school.id}>{school.name} ({school.symbolCode})</option>
            ))}
          </select>
        </div>
      )}
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
  ...(currentUser?.role === 'manager' || currentUser?.role === 'superadmin' || currentUser?.role === 'masteradmin' ? ['users', 'reports'] : []),
  ...(currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin' ? ['schools'] : []),
  ...(currentUser?.role === 'manager' || currentUser?.role === 'superadmin' || currentUser?.role === 'technician' ? ['settings'] : [])].map(view => (
            
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
              {view === 'schools' && <Computer style={{width: '1rem', height: '1rem'}} />}
              {view === 'settings' && <Settings style={{width: '1rem', height: '1rem'}} />}
              <span>
  {view === 'dashboard' ? 'דשבורד' :
   view === 'carts' ? 'עגלות' :
   view === 'schedule' ? 'לוח זמנים' :
   view === 'users' ? 'משתמשים' :
   view === 'reports' ? 'דוחות' :
   view === 'schools' ? 'בתי ספר' : 'הגדרות'}
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
        {currentView === 'schools' && (currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') && (
          <SchoolsView 
            schools={schools}
            setSchools={setSchools}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
          />
        )}
        {currentView === 'carts' && <CartsView carts={carts} currentUser={currentUser} editingCart={editingCart} setEditingCart={setEditingCart} showCartDetails={showCartDetails} setShowCartDetails={setShowCartDetails} updateCart={updateCart} selectedSchool={selectedSchool} addCart={addCart} />}
{currentView === 'schedule' && <ScheduleView reservations={reservations} currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} showNewReservation={showNewReservation} setShowNewReservation={setShowNewReservation} addReservation={addReservation} cancelReservation={cancelReservation} carts={carts} currentUser={currentUser} schoolSettings={schoolSettings} selectedSchool={selectedSchool} />}       
{currentView === 'reports' && (currentUser?.role === 'manager' || currentUser?.role === 'superadmin' || currentUser?.role === 'masteradmin') && (          <ReportsView 
            carts={carts}
            reservations={reservations}
            users={users}
            schoolSettings={schoolSettings}
            selectedSchool={selectedSchool}
            currentUser={currentUser}
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
{currentView === 'users' && (currentUser?.role === 'superadmin' || currentUser?.role === 'masteradmin' || currentUser?.role === 'manager') && (          <UsersView 
            users={users}
            currentUser={currentUser}
            showAddUser={showAddUser}
            setShowAddUser={setShowAddUser}
            addUser={addUser}
            updateUser={updateUser}
            deleteUser={deleteUser}
            selectedSchool={selectedSchool}
          />
        )}
        {currentView === 'users' && (currentUser?.role !== 'superadmin' && currentUser?.role !== 'masteradmin' && currentUser?.role !== 'manager') && (
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


const SchoolsView = ({ schools, setSchools, selectedSchool, setSelectedSchool }) => {
  const [showAddSchool, setShowAddSchool] = useState(false);

  const addSchool = (newSchool) => {
    const schoolWithId = {
      ...newSchool,
      id: Date.now()
    };
    setSchools([...schools, schoolWithId]);
    setShowAddSchool(false);
    alert(`בית הספר ${newSchool.name} נוסף בהצלחה למערכת`);
  };

  return (
    <div style={{padding: '1.5rem'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>ניהול בתי ספר</h2>
        <button 
          onClick={() => setShowAddSchool(true)}
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
          <span>הוסף בית ספר</span>
        </button>
      </div>

      {/* רשימת בתי ספר */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
        {schools.map(school => (
          <div key={school.id} style={{
            backgroundColor: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
            border: selectedSchool === school.id ? '2px solid #2563eb' : '2px solid #e5e7eb',
            padding: '1.5rem'
          }}>
            <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>{school.name}</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
              <div>🏫 סמל מוסד: {school.symbolCode}</div>
              <div>📍 {school.address}</div>
              <div>📞 {school.phone}</div>
              <div>📧 {school.email}</div>
            </div>
            
            <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
              <button
                onClick={() => setSelectedSchool(school.id)}
                style={{
                  flex: 1,
                  backgroundColor: selectedSchool === school.id ? '#16a34a' : '#2563eb',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {selectedSchool === school.id ? '✓ נבחר' : 'בחר'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* חלון הוספת בית ספר */}
      {showAddSchool && (
        <AddSchoolModal 
          onAdd={addSchool}
          onCancel={() => setShowAddSchool(false)}
        />
      )}
    </div>
  );
};

const AddSchoolModal = ({ onAdd, onCancel }) => {
 const [formData, setFormData] = useState({
  name: '',
  symbolCode: '',
  address: '',
  phone: '',
  email: ''
});
  

  const handleSubmit = () => {
    if (!formData.name || !formData.symbolCode || !formData.address) {
      alert('יש למלא שם בית ספר, סמל מוסד וכתובת');
      return;
    }
    
    onAdd(formData);
  };

  return (
    <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem'}}>
      <div style={{backgroundColor: 'white', borderRadius: '0.5rem', maxWidth: '32rem', width: '100%'}}>
        <div style={{padding: '1.5rem', borderBottom: '1px solid #e5e7eb'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 style={{fontSize: '1.25rem', fontWeight: '600'}}>הוסף בית ספר חדש</h3>
            <button
              onClick={onCancel}
              style={{color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer'}}
            >
              <X style={{width: '1.5rem', height: '1.5rem'}} />
            </button>
          </div>
        </div>
        
        <div style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>שם בית הספר *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
              placeholder="למשל: בית ספר יסודי גולדה מאיר"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>סמל מוסד *</label>
            <input
              type="text"
              value={formData.symbolCode}
              onChange={(e) => setFormData({...formData, symbolCode: e.target.value})}
              style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
              placeholder="למשל: 123456"
            />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>כתובת *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
              placeholder="רחוב ומספר, עיר"
            />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>טלפון</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
              placeholder="03-1234567"
            />
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151'}}>אימייל</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box'}}
              placeholder="info@school.edu"
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
              הוסף בית ספר
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
      </div>
    </div>
  );
};



export default SchoolCartManager;