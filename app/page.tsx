'use client'
import Link from 'next/link'
import { SERVICES, OPENING_HOURS, SHOP_INFO } from '@/lib/constants'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={`container ${styles.navInner}`}>
          <Link href="/" className={styles.navLogo}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="20" y1="18" x2="80" y2="18" stroke="#D4A017" strokeWidth="6" strokeLinecap="round"/>
              <line x1="50" y1="18" x2="50" y2="50" stroke="#D4A017" strokeWidth="6" strokeLinecap="round"/>
              <line x1="50" y1="50" x2="30" y2="82" stroke="#D4A017" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <span>Barbershop Tek</span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#diensten">Diensten</a>
            <a href="#over-ons">Over ons</a>
            <a href="#contact">Contact</a>
            <Link href="/booking" className={styles.navCta}>Boek nu</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} aria-hidden />
        <div className={`container ${styles.heroContent}`}>
          <p className={styles.heroSub}>Tilburg · Willem II Straat 78A</p>
          <h1 className={styles.heroTitle}>
            <span>Barbershop</span>
            <span className={styles.heroGold}>Tek</span>
          </h1>
          <p className={styles.heroDesc}>
            Vakmanschap in elke knip. Stijl die voor zichzelf spreekt.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/booking" className={styles.btnPrimary}>Afspraak maken</Link>
            <a href="#diensten" className={styles.btnGhost}>Bekijk diensten</a>
          </div>
          <div className={styles.heroRating}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingText}>4,3 / 5 · 80 reviews op Google</span>
          </div>
        </div>
        <div className={styles.heroScroll} aria-hidden>
          <span />
        </div>
      </section>

      {/* SERVICES */}
      <section id="diensten" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Tarieven</span>
            <h2 className={styles.sectionTitle}>Onze diensten</h2>
          </div>
          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => (
              <div key={s.id} className={styles.serviceCard}>
                <div className={styles.serviceInfo}>
                  <h3>{s.name}</h3>
                  <span className={styles.serviceDuration}>{s.duration}</span>
                </div>
                <span className={styles.servicePrice}>{s.price}</span>
              </div>
            ))}
          </div>
          <div className={styles.servicesCta}>
            <Link href="/booking" className={styles.btnPrimary}>Direct boeken</Link>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div className={styles.divider} aria-hidden />

      {/* ABOUT */}
      <section id="over-ons" className={styles.section}>
        <div className="container">
          <div className={styles.aboutLayout}>
            <div className={styles.aboutText}>
              <span className={styles.sectionTag}>Over ons</span>
              <h2 className={styles.sectionTitle}>Vakmanschap<br />staat voorop</h2>
              <p>
                Barbershop Tek staat in het hart van Tilburg en is al jaren een vaste plek voor mannen die stijl serieus nemen. 
                Tek is een echte vakman: vriendelijk, snel en altijd scherp in zijn werk.
              </p>
              <p>
                Van een klassieke fade tot een traditioneel scheerbeurt met het scheerschaap — bij ons ben je in goede handen. 
                Geen afspraak nodig, maar online boeken gaat nog makkelijker.
              </p>
              <div className={styles.aboutStats}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>80+</span>
                  <span className={styles.statLabel}>Google reviews</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>4,3</span>
                  <span className={styles.statLabel}>Gemiddelde score</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>10+</span>
                  <span className={styles.statLabel}>Jaar ervaring</span>
                </div>
              </div>
            </div>
            <div className={styles.aboutQuotes}>
              <blockquote className={styles.quote}>
                <p>&ldquo;Beste barbershop in Zuid-Nederland. Altijd een super strak kapsel en gezellig in de stoel. Tek is een held!&rdquo;</p>
                <cite>— Mark van Schijndel</cite>
              </blockquote>
              <blockquote className={styles.quote}>
                <p>&ldquo;Tek was jarenlang mijn vaste kapper. Super vriendelijk, kan er snel terecht en levert altijd goed werk.&rdquo;</p>
                <cite>— Bart Bongers</cite>
              </blockquote>
              <blockquote className={styles.quote}>
                <p>&ldquo;Zeer tevreden over deze kapper, hij zegt niet veel maar zijn werk spreekt voor hem.&rdquo;</p>
                <cite>— A.G.</cite>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* HOURS + CONTACT */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.contactPattern} aria-hidden />
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.contactBlock}>
              <span className={styles.sectionTag}>Openingstijden</span>
              <h2 className={styles.sectionTitle}>Wanneer open?</h2>
              <table className={styles.hoursTable}>
                <tbody>
                  <tr><td>Maandag – Vrijdag</td><td>{OPENING_HOURS.weekdays}</td></tr>
                  <tr><td>Zaterdag</td><td>{OPENING_HOURS.saturday}</td></tr>
                  <tr><td>Zondag</td><td className={styles.closed}>{OPENING_HOURS.sunday}</td></tr>
                </tbody>
              </table>
              <p className={styles.walkIn}>Walk-ins welkom · Boeken aanbevolen</p>
            </div>

            <div className={styles.contactBlock}>
              <span className={styles.sectionTag}>Contact & Locatie</span>
              <h2 className={styles.sectionTitle}>Vind ons</h2>
              <div className={styles.contactDetails}>
                <div className={styles.contactRow}>
                  <span className={styles.contactIcon}>📍</span>
                  <div>
                    <p>{SHOP_INFO.address}</p>
                    <p>{SHOP_INFO.city}</p>
                    <a href={SHOP_INFO.googleMaps} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                      Routebeschrijving →
                    </a>
                  </div>
                </div>
                <div className={styles.contactRow}>
                  <span className={styles.contactIcon}>📞</span>
                  <a href={`tel:${SHOP_INFO.phone.replace(/\s/g, '')}`}>{SHOP_INFO.phone}</a>
                </div>
              </div>
              <Link href="/booking" className={styles.btnPrimary} style={{ marginTop: '2rem', display: 'inline-block' }}>
                Afspraak boeken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <p className={styles.footerLogo}>Barbershop Tek</p>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} Barbershop Tek · Tilburg</p>
        </div>
      </footer>
    </div>
  )
}
