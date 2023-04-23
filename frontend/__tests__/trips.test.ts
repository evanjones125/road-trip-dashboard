const { describe, expect } = require('@jest/globals');

describe('trips tests', () => {
  it('should create a trip in the database', () => {
    addTrip('locationTest', '2024-01-01', '');
    expect('test').toEqual('fail');
  });

  it('should be able to delete a trip in the database', () => {
    expect('test').toEqual('fail');
  });
});
