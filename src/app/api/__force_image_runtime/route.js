import { ImageResponse } from 'next/og'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 32,
          background: 'white',
          width: '100%',
          height: '100%',
        }}
      >
        force optimizer
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  )
}
