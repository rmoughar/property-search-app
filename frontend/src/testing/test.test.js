import '@testing-library/jest-dom/vitest';
import { describe, test, expect } from 'vitest';

describe("math", () => {
    test("1 + 1", () => {
        expect(1 + 1).toBe(2);
    });
});