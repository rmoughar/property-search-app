import { beforeEach, expect, jest, test } from '@jest/globals';
import { LocalShellCallItemAction$outboundSchema, parameters1ToJSON, responseToJSON } from '@openrouter/sdk/models';
import request from 'supertest';

const mockQuery = jest.fn();


jest.unstable_mockModule('../config/pool.js', () => ({
    default: {
        query: mockQuery
    }
}));

const {default: app} = await import('../app.js');

beforeEach(() => {
    mockQuery.mockClear();
})

test('GET /api/properties returns properties', async() => {
    mockQuery.mockResolvedValueOnce([
        [{'COUNT(*)': 2}]
    ])
    .mockResolvedValueOnce([
        [
            {
                L_ListingID: 12345,
                L_City: 'Other',
                L_SystemPrice: 300000
            },
            {
                L_ListingID: 67890,
                L_City: 'Other',
                L_SystemPrice: 400000
            }
        ]
    ])

    const response = await request(app).get('/api/properties');
    expect(response.status).toBe(200);

    expect(response.body).toEqual({
        total:2,
        limit:20,
        offset:0,
        results: [
            {
                L_ListingID: 12345,
                L_City: 'Other',
                L_SystemPrice: 300000
            },
            {
                L_ListingID: 67890,
                L_City: 'Other',
                L_SystemPrice: 400000
            }
        ]
    })
});

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

test('GET /api/properties handles pagination', async () => {
    mockQuery
        .mockResolvedValueOnce([
            [{ 'COUNT(*)': 50 }]
        ])
        .mockResolvedValueOnce([
            [
                {
                    L_ListingID: 12345,
                    L_City: 'Other',
                    L_SystemPrice: 300000
                }
            ]
        ])

        const response = await request(app).get('/api/properties?limit=20&offset=20');

        expect(response.status).toBe(200);

        expect(response.body.limit).toBe(20);
        expect(response.body.offset).toBe(20);
        expect(response.body.total).toBe(50);
        expect(response.body.results).toHaveLength(1);
        
        expect(mockQuery).toHaveBeenLastCalledWith(
            'SELECT * FROM rets_property LIMIT ? OFFSET ?',[20,20]
        );
});

test('GET /api/properties applies filters', async () => {
    mockQuery
        .mockResolvedValueOnce([
            [{ 'COUNT(*)': 1 }]
        ])
        .mockResolvedValueOnce([
            [
                {
                    L_ListingID: 12345,
                    L_City: 'Other',
                    L_Zip: 96756,
                    L_SystemPrice: 300000,
                    L_Keyword2: 3,
                    LM_Dec_3: 2
                }
            ]
        ])

        const response = await request(app)
        .get('/api/properties')
        .query({
            city: 'Other',
            zipcode: 96756,
            minPrice: 250000,
            maxPrice: 350000,
            beds: 3,
            baths: 2
        });


    expect(response.status).toBe(200);

    expect(response.body.total).toBe(1);

    expect(response.body.results).toEqual([
        {
            L_ListingID: 12345,
            L_City: 'Other',
            L_Zip: 96756,
            L_SystemPrice: 300000,
            L_Keyword2: 3,
            LM_Dec_3: 2
        }
    ]);

    expect(mockQuery).toHaveBeenLastCalledWith(
        expect.stringContaining('L_City'),
        expect.arrayContaining([
            'Other',
            96756,
            250000,
            350000,
            3,
            2,
            20,
            0
        ])
    );
});

test('GET /api/properties supports 5+ beds and baths filters', async () => {
    mockQuery
        .mockResolvedValueOnce([
            [{ 'COUNT(*)': 1 }]
        ])
        .mockResolvedValueOnce([
            [
                {
                    L_ListingID: 12345,
                    L_Keyword2: 7,
                    LM_Dec_3: 8
                }
            ]
        ])

        const response = await request(app).get('/api/properties?beds=5&baths=5')


    expect(response.status).toBe(200);

    expect(response.body.results).toEqual([
        {
            L_ListingID: 12345,
            L_Keyword2: 7,
            LM_Dec_3: 8
        }
    ]);

    //most recent call since we do a COUNT(*) then a SELECT *
    const lastCall = mockQuery.mock.calls[1];

    //lastCall[0] is the sql query, lastCall[1] is the values array
    expect(lastCall[0]).toContain('L_Keyword2 >= ?');
    expect(lastCall[0]).toContain('LM_Dec_3 >= ?');
    expect(lastCall[1]).toEqual([5, 5, 20, 0]);
});

test.each([
    ['zipcode', 'abc'],
    ['minPrice', 'abc'],
    ['maxPrice', 'abc'],
    ['beds', 'abc'],
    ['baths', 'abc'],
    ['limit', 'abc'],
    ['offset', 'abc']
])(
    'GET /api/properties/rejects invalid inputs',
    async(parameter, value) => {
        const response = await request(app).get(`/api/properties?${parameter}=${value}`);

        expect(response.status).toBe(400);
        expect(mockQuery).not.toHaveBeenCalled();
    }
)