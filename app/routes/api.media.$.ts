import { json, LoaderFunctionArgs } from '@remix-run/node';
import * as path from 'path';
import * as fs from 'fs';

const BASE_DIR = process.env.MEDIA_BASE_DIR ?? '/Users/matteolutz/Desktop';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const fileName = params['*'];

  if (!fileName)
    return json({ error: 'File name is required' }, { status: 400 });

  const filePath = path.resolve(BASE_DIR, fileName);

  if (!filePath.startsWith(BASE_DIR)) {
    return json({ error: 'Invalid file name' }, { status: 400 });
  }

  const fileStat = await fs.promises.stat(filePath);
  if (!fileStat.isFile())
    return json({ error: 'File not found' }, { status: 404 });

  const fileStream = fs.createReadStream(filePath);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return new Response(fileStream, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': fileStat.size.toString()
    }
  });
};
