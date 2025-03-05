import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/__mocks__/server";

beforeAll(() => server.start());

afterAll(() => server.stop());
