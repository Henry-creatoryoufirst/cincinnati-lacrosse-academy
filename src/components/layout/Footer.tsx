import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Brand */}
          <div style={{ maxWidth: '400px' }}>
            <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', textDecoration: 'none' }}>
              Cincinnati Lacrosse Academy
            </Link>
            <p style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
              World-class lacrosse training in Cincinnati. Building complete players
              from youth to collegiate level.
            </p>
          </div>

          {/* External Links */}
          <div>
            <h4 className="footer-title">Connect</h4>
            <ul className="footer-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <li><a href="https://youtube.com/@cincinnatilaax" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              <li><a href="https://podcasts.apple.com" target="_blank" rel="noopener noreferrer">Podcast</a></li>
              <li><a href="https://youprjct.com" target="_blank" rel="noopener noreferrer">You.Prjct App</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Cincinnati Lacrosse Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
