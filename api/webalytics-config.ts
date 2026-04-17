import type { VercelRequest, VercelResponse } from '@vercel/node';

// Exposes Webalytics config to the SPA at runtime. Values come from Vercel
// env vars set on the project; nothing is baked into the bundle.
//
// `publicToken` is origin-bound and read-only by design (see
// @jlaviole90/dashboard-angular README), so it's safe to hand to the browser.
export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const host = process.env['WEBALYTICS_HOST'] || '';
    const siteId = process.env['WEBALYTICS_SITE_ID'] || '';
    const publicToken = process.env['WEBALYTICS_PUBLIC_TOKEN'] || '';
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
    return res.status(200).json({ host, siteId, publicToken });
}
