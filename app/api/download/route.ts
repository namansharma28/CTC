import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');
    const fileName = searchParams.get('filename');

    if (!fileUrl || !fileName) {
      return NextResponse.json({ error: 'Missing url or filename parameter' }, { status: 400 });
    }

    // Validate URL to prevent SSRF attacks
    try {
      const url = new URL(fileUrl);
      if (!url.hostname.includes('cloudinary.com') && !url.hostname.includes('res.cloudinary.com')) {
        return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the file from Cloudinary
    const response = await fetch(fileUrl, {
      headers: {
        'User-Agent': 'CTC-App/1.0',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: 'Failed to fetch file from source' }, { status: 500 });
    }

    const fileBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    // Sanitize filename to prevent path traversal
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-_]/g, '_');

    // Return the file with proper headers for download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${sanitizedFileName}"`,
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
