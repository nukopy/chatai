import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Welcome } from "./welcome";

describe("Welcome component", () => {
	it("renders welcome message", () => {
		const testMessage = "Hello from test";
		render(<Welcome message={testMessage} />);

		expect(screen.getByText("What's next?")).toBeInTheDocument();
		expect(screen.getByText(testMessage)).toBeInTheDocument();
	});

	it("renders React Router logo", () => {
		render(<Welcome message="test" />);

		const logos = screen.getAllByAltText("React Router");
		expect(logos).toHaveLength(2); // light and dark versions
	});

	it("renders navigation links", () => {
		render(<Welcome message="test" />);

		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(2);

		const docsLink = links.find(
			(link) => link.getAttribute("href") === "https://reactrouter.com/docs",
		);
		expect(docsLink).toBeInTheDocument();
		expect(docsLink).toHaveTextContent("React Router Docs");

		const discordLink = links.find(
			(link) => link.getAttribute("href") === "https://rmx.as/discord",
		);
		expect(discordLink).toBeInTheDocument();
		expect(discordLink).toHaveTextContent("Join Discord");
	});
});
