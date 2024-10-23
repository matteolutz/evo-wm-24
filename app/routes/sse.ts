import { json } from '@remix-run/node';

export const loader = () => json({ success: true }, 200);
