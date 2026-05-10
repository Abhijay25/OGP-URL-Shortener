import 'dotenv/config';
import { customAlphabet } from 'nanoid';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL']! });
export const prisma = new PrismaClient({ adapter });

export function validateUrl(url: string): void {
    try {
        const { protocol } = new URL(url);
        if (!['http:', 'https:'].includes(protocol)) throw new Error();
    } catch {
        throw new Error('Invalid URL: must start with http:// or https://');
    }
}

export async function shortenUrl(originalUrl: string, customAlias?: string): Promise<string> {
    validateUrl(originalUrl);

    const code = customAlias ?? nanoid();

    const existing = await prisma.url.findUnique({ where: { shortCode: code } });
    if (existing) throw new Error(`Alias "${code}" is already taken`);

    await prisma.url.create({ data: { shortCode: code, originalUrl } });
    return code;
}

export async function resolveUrl(shortCode: string): Promise<string | null> {
    const record = await prisma.url.findUnique({ where: { shortCode } });
    return record?.originalUrl ?? null;
}

export async function getAllUrls() {
    return prisma.url.findMany({ orderBy: { createdAt: 'desc' } });
}
