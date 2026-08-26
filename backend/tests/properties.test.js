import { expect, jest } from '@jest/globals';
import request from 'supertest';

const mockQuery = jest.fn();

jest.unstable_mockModule('../config/pool.js', () => ({
    default: {
        query: mockQuery
    }
}));

const {default: app} = await import('../app.js');

test('GET /api/properties/:id returns a property', async () => {
    mockQuery.mockResolvedValueOnce([
        [
            {
                L_ListingID: 12345,
                L_City: 'Other',
                L_SystemPrice: 300000
            }
        ]
    ]);

    const response = await request(app).get('/api/properties/12345');

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
        Property: {
            L_ListingID: 12345,
            L_City: 'Other',
            L_SystemPrice: 300000
        }
    });
});