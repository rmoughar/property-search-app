import { fetchFilteredProperties } from '../api/client';
import { describe, test, expect, vi, beforeEach } from 'vitest';

// Create vitest mock fetch
const mockFetch = vi.fn();

// Assign mock to global fetch
globalThis.fetch = mockFetch;

describe("fetchproperties", () => {
    beforeEach(() => {
        // rest any mock calls/implementations before each test runs
        mockFetch.mockReset();
    })

    test("returns property data when the request succeeds", async () => {
        
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                total:1,
                results: [
                    {id:123}
                ]
            })
        });

        const result = await fetchFilteredProperties({});

        expect(result.total).toBe(1);
        expect(result.results[0].id).toBe(123);
        expect(mockFetch).toHaveBeenCalledTimes(1);

    });

    test("returns error when the request fails", async () => {
        
        mockFetch.mockResolvedValue({
            ok: false,
            json: async () => ({
                total:1,
                results: [
                    {id:123}
                ]
            })
        });

        await expect(fetchFilteredProperties({})).rejects.toThrowError('Failed to fetch');
    });

    test("calls api with correct url", async () => {
        
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                total:1,
                results: [
                    {id:123}
                ]
            })
        });

        await fetchFilteredProperties({city: "Ann Arbor", beds: "3",  zipcode: ""});
        expect(mockFetch).toHaveBeenCalledWith('/api/properties?city=Ann Arbor&beds=3&');
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});