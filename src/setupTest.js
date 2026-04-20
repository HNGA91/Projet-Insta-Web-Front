import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
	cleanup();
    vi.clearAllMocks();
});

// mock fetch global
global.fetch = vi.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve({ success: true }),
	}),
);
