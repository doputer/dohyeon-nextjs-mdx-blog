import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

const options = {
  width: 1200,
  height: 630,
  headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=31536000' },
};

export const GET = (request: NextRequest) => {
  const emoji = request.nextUrl.searchParams.get('emoji') || '🏷️';

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        fontSize: 512,
      }}
    >
      {emoji}
    </div>,
    options
  );
};
