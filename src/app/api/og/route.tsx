import { ImageResponse } from 'next/og';

const size = { width: 1200, height: 630 };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasEmoji = searchParams.has('emoji');
  const emoji = hasEmoji ? searchParams.get('emoji') : '🏷️';

  return new ImageResponse(
    (
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
      </div>
    ),
    {
      ...size,
    }
  );
}
