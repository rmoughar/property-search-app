import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fetchFilteredProperties, fetchMultipleProperties, fetchNaturalFilters, fetchOpenHouseById, fetchPropertyById } from '../src/api/client';

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
            text: async () => "Failed to fetch"
        });

        await expect(fetchFilteredProperties({})).rejects.toThrow('Failed to fetch');
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
        expect(mockFetch).toHaveBeenCalledWith('/api/properties?city=Ann Arbor&beds=3&', {signal: undefined});
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    test("returns property data by id", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                Property: {
                    L_ListingID: 12345
                }
            })
        });

        const result = await fetchPropertyById(12345);

        expect(result.Property.L_ListingID).toBe(12345);
        expect(mockFetch).toHaveBeenCalledWith('/api/properties/12345');
    });

    test('returns error when fetching property by id fails', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            text: async () => "Property ID not recognized!"
        });
        
        await expect(fetchPropertyById(12345)).rejects.toThrow("Property ID not recognized!");
    });

    test('returns open house data by id', async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                Openhouses: [
                    {id: 1},
                    {id: 2}
                ]
            })
        });
        
        const result = await fetchOpenHouseById(12345);

        expect(result.Openhouses).toHaveLength(2);
        expect(mockFetch).toHaveBeenCalledWith('/api/properties/12345/openhouses');
    });

    test('returns error when fetching open house by id fails', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            text: async () => "Property ID not recognized!"
        });
        
        await expect(fetchOpenHouseById(12345)).rejects.toThrow("Property ID not recognized!");
    });

    test("returns multiple properties", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                total:2,
                Properties: [
                    {L_ListingID: 12345},
                    {L_ListingID: 67890}
                ]
                
            })
        });

        const result = await fetchMultipleProperties([12345,67890]);

        expect(result.total).toBe(2);
        expect(result.Properties).toHaveLength(2);
        expect(mockFetch).toHaveBeenCalledWith('/api/properties/ids/12345,67890?', { signal: undefined });
    });

    test('returns error when fetching multiple properties fails', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            text: async () => "No properties found!"
        });
        
        await expect(fetchMultipleProperties([123,456])).rejects.toThrow("No properties found!");
    });

    test("returns natural search results", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                city: 'Other',
                beds: 3
            })
        });

        const result = await fetchNaturalFilters('3 bedroom homes in Other');

        expect(result).toEqual({city: 'Other', beds: 3});

        expect(mockFetch).toHaveBeenCalledWith('/api/search/natural', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: "3 bedroom homes in Other"
                })
            }
        );

    });

    test('returns error whennatural search fails', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            text: async () => "Search failed"
        });
        
        await expect(fetchNaturalFilters('3 bedroom homes')).rejects.toThrow("Search failed");
    });



});