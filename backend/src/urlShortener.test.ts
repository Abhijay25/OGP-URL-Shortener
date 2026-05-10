import { describe, it, expect } from 'vitest';
import { validateUrl } from './urlShortener';

describe('validateUrl', () => {
    it('accepts a valid http URL', () => {
        expect(() => validateUrl('http://example.com')).not.toThrow();
    });

    it('accepts a valid https URL', () => {
        expect(() => validateUrl('https://example.com/some/path?q=1')).not.toThrow();
    });

    it('rejects a non-http protocol', () => {
        expect(() => validateUrl('ftp://example.com')).toThrow('Invalid URL: must start with http:// or https://');
    });

    it('rejects a plain string with no protocol', () => {
        expect(() => validateUrl('example.com')).toThrow('Invalid URL: must start with http:// or https://');
    });

    it('rejects an empty string', () => {
        expect(() => validateUrl('')).toThrow('Invalid URL: must start with http:// or https://');
    });
});
