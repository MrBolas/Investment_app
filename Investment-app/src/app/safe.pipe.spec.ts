import { SafePipe } from './safe.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafePipe', () => {
  it('should create an instance', () => {
    let sanitizer:DomSanitizer;
    const pipe = new SafePipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
