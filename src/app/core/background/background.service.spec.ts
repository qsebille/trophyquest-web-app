import {TestBed} from '@angular/core/testing';

import {BackgroundService, DEFAULT_BACKGROUND_URL} from './background.service';

describe('BackgroundService', () => {
  let service: BackgroundService;

  beforeEach(() => {
    service = TestBed.inject(BackgroundService);
  });

  it('starts with the default background', () => {
    expect(service.image().url).toBe(DEFAULT_BACKGROUND_URL);
  });

  it.each([
    null,
    {url: null},
    {url: ''},
    {url: '   '},
    {url: 'https://[invalid]/image.jpg'},
    {url: 'https:/example.com/image.jpg'},
    {url: 'file:///image.jpg'},
  ])('restores the default background for %j', (background) => {
    service.setBackground({url: 'https://example.com/game.jpg'});
    service.setBackground(background);
    expect(service.image().url).toBe(DEFAULT_BACKGROUND_URL);
  });

  it.each([
    '  https://example.com/game(1).jpg?size=full  ',
    '//example.com/game.jpg',
    'assets/images/game.jpg',
  ])('uses a valid background URL (%s)', (url) => {
    service.setBackground({url});
    expect(service.image().url).toBe(url.trim());
  });
});
