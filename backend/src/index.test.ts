import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from './index';
import { prisma } from './urlShortener';

beforeEach(async () => {
    await prisma.url.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('GET /health', () => {
    it('returns status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });
});

describe('POST /shorten', () => {
    it('returns a short URL for a valid URL', async () => {
        const res = await request(app)
            .post('/shorten')
            .send({ url: 'https://example.com' });
        expect(res.status).toBe(200);
        expect(res.body.shortUrl).toMatch(/^http:\/\/localhost:3000\/\w+$/);
    });

    it('accepts a custom alias', async () => {
        const res = await request(app)
            .post('/shorten')
            .send({ url: 'https://example.com', customAlias: 'myalias' });
        expect(res.status).toBe(200);
        expect(res.body.shortUrl).toBe('http://localhost:3000/myalias');
    });

    it('rejects a duplicate alias', async () => {
        await request(app).post('/shorten').send({ url: 'https://example.com', customAlias: 'taken' });
        const res = await request(app).post('/shorten').send({ url: 'https://other.com', customAlias: 'taken' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/already taken/);
    });

    it('rejects an invalid URL', async () => {
        const res = await request(app).post('/shorten').send({ url: 'not-a-url' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Invalid URL/);
    });
});

describe('GET /:shortCode', () => {
    it('redirects to the original URL', async () => {
        const shortenRes = await request(app)
            .post('/shorten')
            .send({ url: 'https://example.com', customAlias: 'redir' });
        expect(shortenRes.status).toBe(200);

        const res = await request(app).get('/redir').redirects(0);
        expect(res.status).toBe(302);
        expect(res.headers['location']).toBe('https://example.com');
    });

    it('returns 404 for an unknown short code', async () => {
        const res = await request(app).get('/doesnotexist');
        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/not found/i);
    });
});

describe('GET /history', () => {
    it('returns an empty list when no URLs exist', async () => {
        const res = await request(app).get('/history');
        expect(res.status).toBe(200);
        expect(res.body.urls).toEqual([]);
    });

    it('returns shortened URLs in reverse chronological order', async () => {
        await request(app).post('/shorten').send({ url: 'https://first.com', customAlias: 'first' });
        await request(app).post('/shorten').send({ url: 'https://second.com', customAlias: 'second' });

        const res = await request(app).get('/history');
        expect(res.status).toBe(200);
        expect(res.body.urls).toHaveLength(2);
        expect(res.body.urls[0].shortCode).toBe('second');
        expect(res.body.urls[1].shortCode).toBe('first');
    });
});
