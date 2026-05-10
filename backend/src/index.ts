import express from 'express';
import cors from 'cors';
import { shortenUrl, resolveUrl, getAllUrls } from './urlShortener';

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.get('/history', async (_req, res) => {
    try {
        const urls = await getAllUrls();
        res.json({
            urls: urls.map((u: { shortCode: string; originalUrl: string; createdAt: Date }) => ({
                shortCode: u.shortCode,
                shortUrl: `http://localhost:${PORT}/${u.shortCode}`,
                originalUrl: u.originalUrl,
                createdAt: u.createdAt.toISOString(),
            })),
        });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.post('/shorten', async (req, res) => {
    const { url, customAlias } = req.body as { url: string; customAlias?: string };

    try {
        const code = await shortenUrl(url, customAlias);
        res.json({ shortUrl: `http://localhost:${PORT}/${code}` });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

app.get('/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    const originalUrl = await resolveUrl(shortCode);

    if (!originalUrl) {
        res.status(404).json({ error: 'Short URL not found' });
        return;
    }

    res.redirect(302, originalUrl);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
