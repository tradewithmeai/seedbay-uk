import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const alt = 'SeedBay — UK Seed Exchange'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 60%, #86efac 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 24, lineHeight: 1 }}>🌱</div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: '#14532d',
            marginBottom: 20,
            letterSpacing: '-2px',
          }}
        >
          SeedBay.co.uk
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#166534',
            marginBottom: 32,
            textAlign: 'center',
          }}
        >
          UK Seed Exchange — Buy, Swap &amp; Give Away Seeds
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#15803d',
            background: 'rgba(255,255,255,0.6)',
            padding: '12px 28px',
            borderRadius: '999px',
          }}
        >
          No fees · No middleman · Contact sellers directly
        </div>
      </div>
    ),
    size,
  )
}
