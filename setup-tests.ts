import { beforeAll, afterEach, afterAll } from "vitest"; 
import { server } from "./src/__mocks__/server"; 
import { cleanup } from "@testing-library/react"; 
import '@testing-library/jest-dom'; 


beforeAll(() => server.listen());


afterEach(() => {
  cleanup();
  server.resetHandlers(); 
});

afterAll(() => server.close());
