import React, { useState } from 'react';
import { 
  Calendar,
  Plus,
  X,
  Clock
} from 'lucide-react';

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
  selectedSchool,
}) => {
  // סינון הזמנות לפי בית ספר
  const filteredReservations = reservations.filter(res => {
    if (currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') {
      return selectedSchool ? res.schoolId === selectedSchool : false;
    }
    return res.schoolId === currentUser?.schoolId;
  });
  
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

      {/* חלון הזמנה חדשה */}
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
  );
};

// רכיב NewReservationForm
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

export default ScheduleView;