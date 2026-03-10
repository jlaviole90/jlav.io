import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { passphrase } = req.body ?? {};
    const expected = process.env.BIRDCAM_PASSPHRASE;
    const streamUrl = process.env.BIRDCAM_STREAM_URL;

    if (!expected || !streamUrl) {
        return res.status(500).json({ error: 'Not configured' });
    }

    if (!passphrase || passphrase !== expected) {
        return res.status(401).json({ error: 'Invalid passphrase' });
    }

    return res.status(200).json({ streamUrl });
}
