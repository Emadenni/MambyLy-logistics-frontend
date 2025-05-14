import { server } from './src/__mocks__/server';

beforeAll(() => {
  server.start();

  class IntersectionObserverMock {
    constructor(callback: any, options?: any) {}
    observe(target: any) {}
    unobserve(target: any) {}
    disconnect() {}
  }
  global.IntersectionObserver = IntersectionObserverMock as any;
});

afterAll(() => server.stop());
function beforeAll(arg0: () => void) {
  throw new Error('Function not implemented.');
}

function afterAll(arg0: () => void) {
  throw new Error('Function not implemented.');
}

