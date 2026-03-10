const { formatDate } = require('./utils');

test('formats ISO date correctly', () => {
    const isoDate = '2024-09-22T00:00:00Z';
    const formattedDate = formatDate(isoDate);
    expect(formattedDate).toBe('22/09/2024');
});


test.each([
    { isoDate: '2024-09-22T00:00:00Z', expected: '22/09/2024' },
    { isoDate: '2022-01-01T12:00:00Z', expected: '01/01/2022' },
    // { isoDate: '2023-12-31T23:59:59Z', expected: '31/12/2023' },
    { isoDate: '2020-02-29T00:00:00Z', expected: '29/02/2020' },
    { isoDate: '1970-01-01T00:00:00Z', expected: '01/01/1970' },
    // { isoDate: '2021-04-30T23:59:59Z', expected: '30/04/2021' }
])('formats ISO date $isoDate correctly', ({ isoDate, expected }) => {
    const formattedDate = formatDate(isoDate);
    expect(formattedDate).toBe(expected);
});

