'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, addDays, isSunday, isToday, isPast, startOfDay } from 'date-fns'
import { nl } from 'date-fns/locale'
import { SERVICES, TIME_SLOTS } from '@/lib/constants'
import styles from './booking.module.css'

type Step = 1 | 2 | 3 | 4

interface FormData {
  service: string
  date: string
  time_slot: string
  name: string
  phone: string
  email: string
  notes: string
}

const EMPTY_FORM: FormData = {
  service: '',
  date: '',
  time_slot: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
}

function generateDays(count = 30) {
  const days = []
  let d = new Date()
  // Start tomorrow if past 18:00 today
  if (new Date().getHours() >= 18) d = addDays(d, 1)
  for (let i = 0; i < count + 14; i++) {
    const day = addDays(startOfDay(d), i)
    if (!isSunday(day)) days.push(day)
    if (days.length >= count) break
  }
  return days
}

export default function BookingPage() {
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const days = generateDays(30)

  useEffect(() => {
    if (form.date) {
      setLoading(true)
      fetch(`/api/bookings?date=${form.date}`)
        .then(r => r.json())
        .then(data => setBookedSlots(data.bookedSlots || []))
        .catch(() => setBookedSlots([]))
        .finally(() => setLoading(false))
    }
  }, [form.date])

  const selectedService = SERVICES.find(s => s.id === form.service)

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Er ging iets mis')
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✓</div>
          <h1>Afspraak bevestigd!</h1>
          <p>
            Bedankt, <strong>{form.name}</strong>! Je afspraak voor{' '}
            <strong>{selectedService?.name}</strong> op{' '}
            <strong>
              {form.date && format(new Date(form.date + 'T00:00:00'), 'EEEE d MMMM', { locale: nl })}
            </strong>{' '}
            om <strong>{form.time_slot}</strong> is ingepland.
          </p>
          <p className={styles.successNote}>We zien je snel! – Barbershop Tek, Willem II Straat 78A, Tilburg</p>
          <Link href="/" className={styles.btnPrimary}>Terug naar home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>← Terug</Link>
        <h1 className={styles.title}>Afspraak boeken</h1>
        <p className={styles.subtitle}>Barbershop Tek · Tilburg</p>
      </div>

      {/* Steps indicator */}
      <div className={styles.stepsBar}>
        {(['1', '2', '3', '4'] as const).map((s, i) => (
          <div key={s} className={`${styles.stepItem} ${step > i + 1 ? styles.done : ''} ${step === i + 1 ? styles.active : ''}`}>
            <span className={styles.stepNum}>{step > i + 1 ? '✓' : s}</span>
            <span className={styles.stepLabel}>{['Dienst', 'Datum', 'Tijd', 'Gegevens'][i]}</span>
          </div>
        ))}
      </div>

      <div className={styles.content}>

        {/* STEP 1: Service */}
        {step === 1 && (
          <div className={styles.stepPanel}>
            <h2 className={styles.stepTitle}>Kies een dienst</h2>
            <div className={styles.serviceList}>
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  className={`${styles.serviceBtn} ${form.service === s.id ? styles.selected : ''}`}
                  onClick={() => {
                    setForm(f => ({ ...f, service: s.id }))
                    setTimeout(() => setStep(2), 200)
                  }}
                >
                  <div className={styles.serviceBtnInfo}>
                    <span className={styles.serviceBtnName}>{s.name}</span>
                    <span className={styles.serviceBtnDur}>{s.duration}</span>
                  </div>
                  <span className={styles.serviceBtnPrice}>{s.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Date */}
        {step === 2 && (
          <div className={styles.stepPanel}>
            <h2 className={styles.stepTitle}>Kies een datum</h2>
            <div className={styles.dateGrid}>
              {days.map(day => {
                const str = format(day, 'yyyy-MM-dd')
                const isSelected = form.date === str
                return (
                  <button
                    key={str}
                    className={`${styles.dateBtn} ${isSelected ? styles.selected : ''}`}
                    onClick={() => {
                      setForm(f => ({ ...f, date: str, time_slot: '' }))
                      setTimeout(() => setStep(3), 200)
                    }}
                  >
                    <span className={styles.dateBtnDay}>
                      {format(day, 'EEE', { locale: nl })}
                    </span>
                    <span className={styles.dateBtnNum}>
                      {format(day, 'd', { locale: nl })}
                    </span>
                    <span className={styles.dateBtnMonth}>
                      {format(day, 'MMM', { locale: nl })}
                    </span>
                    {isToday(day) && <span className={styles.todayBadge}>Vandaag</span>}
                  </button>
                )
              })}
            </div>
            <button className={styles.btnBack} onClick={() => setStep(1)}>← Terug</button>
          </div>
        )}

        {/* STEP 3: Time */}
        {step === 3 && (
          <div className={styles.stepPanel}>
            <h2 className={styles.stepTitle}>
              Kies een tijdstip
              {form.date && (
                <span className={styles.stepSubtitle}>
                  {format(new Date(form.date + 'T00:00:00'), 'EEEE d MMMM', { locale: nl })}
                </span>
              )}
            </h2>
            {loading ? (
              <p className={styles.loadingText}>Tijdslots laden…</p>
            ) : (
              <div className={styles.timeGrid}>
                {TIME_SLOTS.map(slot => {
                  const taken = bookedSlots.includes(slot)
                  return (
                    <button
                      key={slot}
                      disabled={taken}
                      className={`${styles.timeBtn} ${taken ? styles.taken : ''} ${form.time_slot === slot ? styles.selected : ''}`}
                      onClick={() => {
                        if (!taken) {
                          setForm(f => ({ ...f, time_slot: slot }))
                          setTimeout(() => setStep(4), 200)
                        }
                      }}
                    >
                      {slot}
                      {taken && <span className={styles.takenLabel}>Bezet</span>}
                    </button>
                  )
                })}
              </div>
            )}
            <button className={styles.btnBack} onClick={() => setStep(2)}>← Terug</button>
          </div>
        )}

        {/* STEP 4: Personal details */}
        {step === 4 && (
          <div className={styles.stepPanel}>
            <h2 className={styles.stepTitle}>Jouw gegevens</h2>

            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>Dienst</span>
                <strong>{selectedService?.name}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Datum</span>
                <strong>
                  {form.date && format(new Date(form.date + 'T00:00:00'), 'EEEE d MMMM', { locale: nl })}
                </strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Tijdstip</span>
                <strong>{form.time_slot}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Prijs</span>
                <strong>{selectedService?.price}</strong>
              </div>
            </div>

            <div className={styles.formFields}>
              <div className={styles.formRow}>
                <label>Naam *</label>
                <input
                  type="text"
                  placeholder="Jouw volledige naam"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <label>Telefoonnummer *</label>
                <input
                  type="tel"
                  placeholder="06 12345678"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <label>E-mail <span className={styles.optional}>(optioneel)</span></label>
                <input
                  type="email"
                  placeholder="jouw@email.nl"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={styles.input}
                />
              </div>
              <div className={styles.formRow}>
                <label>Opmerking <span className={styles.optional}>(optioneel)</span></label>
                <textarea
                  placeholder="Bijv. gewenste stijl of speciale wensen…"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className={styles.textarea}
                  rows={3}
                />
              </div>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            <div className={styles.formActions}>
              <button className={styles.btnBack} onClick={() => setStep(3)}>← Terug</button>
              <button
                className={styles.btnPrimary}
                onClick={handleSubmit}
                disabled={submitting || !form.name || !form.phone}
              >
                {submitting ? 'Bezig…' : 'Bevestig afspraak'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
