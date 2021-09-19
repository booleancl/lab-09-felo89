const {
  getAllArtists,
  saveArtist,
  updateArtist,
  removeArtist,
} = require('./artists.controller');

const responseData = [];
jest.mock('../models', () => ({
  Artist: {
    findAll: () => responseData
  },
}));

describe('Artist', (done) => {
  const statusMock = { json: jest.fn(data => data) };
  const responseMock = { status: () => statusMock };

  test('should get all artist', async () => {
    const artists = await getAllArtists(null, responseMock);
    expect(artists).toBe(responseData);
  });
});
