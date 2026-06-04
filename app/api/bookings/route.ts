import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET: fetch booked slots for a given date
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  if (!date) {
    return NextResponse.json({ error: 'Date required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('time_slot')
    .eq('date', date)
    .neq('status', 'cancelled')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const bookedSlots = data.map((b) => b.time_slot)
  return NextResponse.json({ bookedSlots })
}

// POST: create new booking
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, phone, email, service, date, time_slot, notes } = body

  if (!name || !phone || !service || !date || !time_slot) {
    return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 })
  }

  // Check if slot is still available
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('date', date)
    .eq('time_slot', time_slot)
    .neq('status', 'cancelled')
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Dit tijdslot is al bezet. Kies een ander tijdstip.' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert([{ name, phone, email, service, date, time_slot, notes }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ booking: data }, { status: 201 })
}
