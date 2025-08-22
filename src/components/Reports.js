import React, { useState } from 'react';
import { 
  Activity,
  Calendar,
  Clock
} from 'lucide-react';

const ReportsView = ({ carts, reservations, users, schoolSettings, selectedSchool, currentUser }) => {
  // סינון נתונים לפי בית ספר
  const filteredCarts = carts.filter(cart => {
    if (currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') {
      return selectedSchool ? cart.schoolId === selectedSchool : false;
    }
    return cart.schoolId === currentUser?.schoolId;
  });
  
  const schoolFilteredReservations = reservations.filter(res => {
    if (currentUser?.role === 'masteradmin' || currentUser?.role === 'superadmin') {
      return selectedSchool ? res.schoolId === selectedSchool : false;
    }
    return res.schoolId === currentUser?.schoolId;
  });

  // פילטרים
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCart, setSelectedCart] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  // סינון הזמנות לפי פילטרים
  const filteredReservations = schoolFilteredReservations.filter(r => {    
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
                </div>
              </div>
            ))}
          </div>
        </div>

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
  );
};

export default ReportsView;