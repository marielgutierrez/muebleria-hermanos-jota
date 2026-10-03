

function EmailIcon() {
  return (
    <svg
      className="footer__icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      className="footer__icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 22c-1.83 0-3.615-.508-5.156-1.472l-3.706.972.988-3.62A9.925 9.925 0 0 1 2 12.05C2 6.5 6.53 2 12.05 2 17.5 2 22 6.5 22 12.05 22 17.5 17.5 22 12.05 22z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="footer__icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="logo__text logo__text--light">Hermanos Jota</span>
          <p>No solo comprás muebles; invertís en un legado.</p>
        </div>

        <div className="footer__block">
          <h3>Showroom y taller</h3>
          <address>
            Av. San Juan 2847
            <br />
            C1232AAB — Barrio de San Cristóbal
            <br />
            Ciudad Autónoma de Buenos Aires, Argentina
          </address>
          <p>Lun a Vie: 10:00 - 19:00 · Sáb: 10:00 - 14:00</p>
        </div>

        <div className="footer__block">
          <h3>Contacto</h3>
          <ul className="footer__list">
            <li>
              <a href="mailto:info@hermanosjota.com.ar" className="footer__link">
                <EmailIcon />
                info@hermanosjota.com.ar
              </a>
            </li>
            <li>
              <a href="mailto:ventas@hermanosjota.com.ar" className="footer__link">
                <EmailIcon />
                ventas@hermanosjota.com.ar
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/5491145678900"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                +54 11 4567-8900
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__block">
          <h3>Seguinos</h3>
          <ul className="footer__list">
            <li>
              <a
                href="https://instagram.com/hermanosjota_ba"
                className="footer__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
                @hermanosjota_ba
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Hermanos Jota. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;