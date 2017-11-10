import { ToIterablePipe } from './to-iterable.pipe';

describe('ToIterablePipe', () => {
  it('create an instance', () => {
    const pipe = new ToIterablePipe();
    expect(pipe).toBeTruthy();
  });
});
