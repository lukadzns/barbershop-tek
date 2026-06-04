export const SERVICES = [
  { id: 'haircut', name: 'Knippen', price: '€15', duration: '30 min' },
  { id: 'haircut-beard', name: 'Knippen + Baard', price: '€25', duration: '45 min' },
  { id: 'beard', name: 'Baard trimmen', price: '€12', duration: '20 min' },
  { id: 'shave', name: 'Scheerschaap (klassiek scheren)', price: '€20', duration: '30 min' },
  { id: 'kids', name: 'Kinderknippen (t/m 12 jaar)', price: '€12', duration: '25 min' },
  { id: 'fade', name: 'Fade / Skin Fade', price: '€18', duration: '35 min' },
]

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30',
]

// 0 = Sunday, 1 = Monday, ...
export const CLOSED_DAYS = [0] // Closed on Sunday

export const OPENING_HOURS = {
  weekdays: '09:00 – 19:00',
  saturday: '09:00 – 18:00',
  sunday: 'Gesloten',
}

export const SHOP_INFO = {
  name: 'Barbershop Tek',
  address: 'Willem II Straat 78A',
  city: '5038 BJ Tilburg',
  phone: '06 81958516',
  googleMaps: 'https://maps.google.com/?q=Willem+II+Straat+78A+Tilburg',
}
