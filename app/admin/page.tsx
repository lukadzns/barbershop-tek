'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format, startOfWeek, addDays, addWeeks, subWeeks, isToday } from 'date-fns'
import { nl } from 'date-fns/locale'
import { supabase, Booking } from '@/lib/supabase'
import { SERVICES, TIME_SLOTS } from '@/lib/constants'
import styles from './admin.module.css'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'tek2024'

function getServiceName(id: string) {
  return SERVICES.find(s => s.id === id)?.name || id
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Booking | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const weekDays = Array.from({ length: 6 }, (_, i) => addDays(weekStart, i)) // Mon–Sat

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    const from = format(weekStart, 'yyyy-MM-dd')
    const to = format(addDays(weekStart, 5), 'yyyy-MM-dd')
    supabase
      .from('bookings')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .neq('status', 'cancelled')
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true })
      .then(({ data }) => {
        setBookings(data as Booking[] || [])
        setLoading(false)
      })
  }, [authed, weekStart])

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setPwError(false) }
    else setPwError(true)
  }

  const handleCancel = async (id: string) => {
    if (!confirm('Afspraak annuleren?')) return
    setCancelling(true)
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBookings(b => b.filter(x => x.id !== id))
    setSelected(null)
    setCancelling(false)
  }

  const getBookingsForDay = (day: Date) => {
    const str = format(day, 'yyyy-MM-dd')
    return bookings.filter(b => b.date === str)
  }

  // Login screen
  if (!authed) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <div className={styles.loginLogo}>
            <Image 
              src="/logo.png" 
              alt="Barbershop Tek Logo" 
              width={32} 
              height={32} 
            />
          </div>
          <h1 className={styles.loginTitle}>Admin</h1>
          <p className={styles.loginSub}>Barbershop Tek</p>
          <div className={styles.loginForm}>
            <input
              type="password"
              placeholder="Wachtwoord"
              value={pw}
              onChange={e => { setPw(e.target.value); setPwError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={`${styles.loginInput} ${pwError ? styles.loginInputError : ''}`}
              autoFocus
            />
            {pwError && <p className={styles.loginError}>Onjuist wachtwoord</p>}
            <button className={styles.loginBtn} onClick={handleLogin}>Inloggen</button>
          </div>
          <Link href="/" className={styles.loginBack}>← Terug naar site</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Image 
            src="/logo.png" 
            alt="Barbershop Tek Logo" 
            width={28} 
            height={28} 
          />
          <div>
            <h1 className={styles.headerTitle}>Afspraken</h1>
            <p className={styles.headerSub}>Barbershop Tek</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Link href="/" className={styles.headerSiteLink}>Naar site →</Link>
          <button className={styles.logoutBtn} onClick={() => setAuthed(false)}>Uitloggen</button>
        </div>
      </header>

      {/* Week nav */}
      <div className={styles.weekNav}>
        <button className={styles.weekNavBtn} onClick={() => setWeekStart(w => subWeeks(w, 1))}>‹ Vorige week</button>
        <div className={styles.weekLabel}>
          <span className={styles.weekLabelMain}>
            {format(weekStart, 'd MMM', { locale: nl })} – {format(addDays(weekStart, 5), 'd MMM yyyy', { locale: nl })}
          </span>
          <button className={styles.todayBtn} onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
            Vandaag
          </button>
        </div>
        <button className={styles.weekNavBtn} onClick={() => setWeekStart(w => addWeeks(w, 1))}>Volgende week ›</button>
      </div>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{bookings.length}</span>
          <span className={styles.statLabel}>Deze week</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{getBookingsForDay(new Date()).length}</span>
          <span className={styles.statLabel}>Vandaag</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>
            {bookings.length > 0
              ? '€' + bookings.reduce((sum, b) => {
                  const svc = SERVICES.find(s => s.id === b.service)
                  return sum + parseInt(svc?.price.replace('€','') || '0')
                }, 0)
              : '€0'}
          </span>
          <span className={styles.statLabel}>Omzet week</span>
        </div>
      </div>

      {/* Calendar */}
      {loading ? (
        <div className={styles.loadingWrap}><p>Laden…</p></div>
      ) : (
        <div className={styles.calendar}>
          {weekDays.map(day => {
            const dayBookings = getBookingsForDay(day)
            const isCurrentDay = isToday(day)
            return (
              <div key={day.toISOString()} className={`${styles.dayCol} ${isCurrentDay ? styles.today : ''}`}>
                <div className={styles.dayHeader}>
                  <span className={styles.dayName}>{format(day, 'EEE', { locale: nl })}</span>
                  <span className={`${styles.dayNum} ${isCurrentDay ? styles.dayNumToday : ''}`}>
                    {format(day, 'd')}
                  </span>
                  <span className={styles.dayCount}>{dayBookings.length} afsp.</span>
                </div>
                <div className={styles.daySlots}>
                  {TIME_SLOTS.map(slot => {
                    const booking = dayBookings.find(b => b.time_slot === slot)
                    return (
                      <div key={slot} className={`${styles.slot} ${booking ? styles.slotBooked : styles.slotFree}`}
                        onClick={() => booking && setSelected(booking)}>
                        <span className={styles.slotTime}>{slot}</span>
                        {booking ? (
                          <div className={styles.slotBooking}>
                            <span className={styles.slotName}>{booking.name}</span>
                            <span className={styles.slotService}>{getServiceName(booking.service)}</span>
                          </div>
                        ) : (
                          <span className={styles.slotFreeLabel}>vrij</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelected(null)}>✕</button>
            <h2 className={styles.modalTitle}>Afspraakdetails</h2>
            <div className={styles.modalRows}>
              <div className={styles.modalRow}><span>Naam</span><strong>{selected.name}</strong></div>
              <div className={styles.modalRow}><span>Telefoon</span>
                <a href={`tel:${selected.phone}`} className={styles.modalPhone}>{selected.phone}</a>
              </div>
              {selected.email && <div className={styles.modalRow}><span>E-mail</span><strong>{selected.email}</strong></div>}
              <div className={styles.modalRow}><span>Dienst</span><strong>{getServiceName(selected.service)}</strong></div>
              <div className={styles.modalRow}><span>Datum</span>
                <strong>{selected.date && format(new Date(selected.date + 'T00:00:00'), 'EEEE d MMMM yyyy', { locale: nl })}</strong>
              </div>
              <div className={styles.modalRow}><span>Tijdstip</span><strong>{selected.time_slot}</strong></div>
              <div className={styles.modalRow}><span>Prijs</span>
                <strong>{SERVICES.find(s => s.id === selected.service)?.price}</strong>
              </div>
              {selected.notes && <div className={styles.modalRow}><span>Opmerking</span><strong>{selected.notes}</strong></div>}
            </div>
            <div className={styles.modalActions}>
              <a href={`tel:${selected.phone}`} className={styles.btnCall}>📞 Bellen</a>
              <button className={styles.btnCancel}
                onClick={() => selected.id && handleCancel(selected.id)}
                disabled={cancelling}>
                {cancelling ? 'Bezig…' : 'Afspraak annuleren'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
