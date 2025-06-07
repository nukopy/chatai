import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Chat } from "./Chat";

// Mock clipboard API
Object.assign(navigator, {
	clipboard: {
		writeText: vi.fn(() => Promise.resolve()),
	},
});

describe("Chat Component", () => {
	test("renders Mentor AI title", () => {
		render(<Chat />);
		expect(screen.getByText("Mentor AI")).toBeInTheDocument();
	});

	test("renders welcome message when no messages", () => {
		render(<Chat />);
		expect(screen.getByText("Mentor AI へようこそ")).toBeInTheDocument();
		expect(
			screen.getByText("何でもお気軽にお話しください。"),
		).toBeInTheDocument();
	});

	test("renders message input placeholder", () => {
		render(<Chat />);
		expect(
			screen.getByPlaceholderText("メッセージを入力してください..."),
		).toBeInTheDocument();
	});

	test("allows typing in message input", () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);
		fireEvent.change(input, { target: { value: "テストメッセージ" } });
		expect(input).toHaveValue("テストメッセージ");
	});

	test("sends message on form submit", async () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);
		const submitButton = screen.getByTitle("送信");

		fireEvent.change(input, { target: { value: "こんにちは" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("こんにちは")).toBeInTheDocument();
		});

		// Check that input is cleared after sending
		expect(input).toHaveValue("");
	});

	test("sends message on Enter key press", async () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);

		fireEvent.change(input, { target: { value: "Enter送信テスト" } });
		fireEvent.keyDown(input, { key: "Enter", shiftKey: false });

		await waitFor(() => {
			expect(screen.getByText("Enter送信テスト")).toBeInTheDocument();
		});
	});

	test("does not send message on Shift+Enter", () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);

		fireEvent.change(input, { target: { value: "改行テスト" } });
		fireEvent.keyDown(input, { key: "Enter", shiftKey: true });

		// Message should not be sent (should not appear in message area with proper styling)
		expect(screen.queryByText("改行テスト")?.closest('.justify-end')).not.toBeInTheDocument();
		// Input should still have the value
		expect(input).toHaveValue("改行テスト");
	});

	test("does not send empty messages", () => {
		render(<Chat />);
		const submitButton = screen.getByTitle("送信");

		// Try to send empty message
		fireEvent.click(submitButton);

		// No user message divs should be added
		expect(screen.queryByTestId("user-message")).not.toBeInTheDocument();
		// Welcome message should still be visible
		expect(screen.getByText("Mentor AI へようこそ")).toBeInTheDocument();
	});

	test("does not send whitespace-only messages", () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);
		const submitButton = screen.getByTitle("送信");

		fireEvent.change(input, { target: { value: "   " } });
		fireEvent.click(submitButton);

		// No user message divs should be added
		expect(screen.queryByTestId("user-message")).not.toBeInTheDocument();
		// Welcome message should still be visible
		expect(screen.getByText("Mentor AI へようこそ")).toBeInTheDocument();
	});

	test("shows loading state after sending message", async () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);
		const submitButton = screen.getByTitle("送信");

		fireEvent.change(input, { target: { value: "ローディングテスト" } });
		fireEvent.click(submitButton);

		// Should show loading animation
		await waitFor(() => {
			const loadingDots = document.querySelectorAll(".animate-pulse");
			expect(loadingDots.length).toBeGreaterThan(0);
		});
	});

	test("receives AI response after user message", async () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);

		fireEvent.change(input, { target: { value: "こんにちは" } });
		fireEvent.keyDown(input, { key: "Enter", shiftKey: false });

		// Wait for AI response
		await waitFor(
			() => {
				expect(
					screen.getByText(
						"こんにちは！メンターAIです。どのようなことでお悩みでしょうか？お気軽にお話しください。",
					),
				).toBeInTheDocument();
			},
			{ timeout: 2000 },
		);
	});


	test("displays user and AI messages with correct styling", async () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);

		fireEvent.change(input, { target: { value: "ユーザーメッセージ" } });
		fireEvent.keyDown(input, { key: "Enter", shiftKey: false });

		await waitFor(() => {
			const userMessage = screen.getByText("ユーザーメッセージ");
			const aiMessage = screen.getByText(
				"こんにちは！メンターAIです。どのようなことでお悩みでしょうか？お気軽にお話しください。",
			);

			// Check that user message has the correct parent styling (right alignment)
			expect(userMessage.closest(".justify-end")).toBeInTheDocument();
			// Check that AI message has the correct parent styling (left alignment)
			expect(aiMessage.closest(".justify-start")).toBeInTheDocument();

			// Check that user message has gray background
			expect(userMessage.closest(".bg-gray-800")).toBeInTheDocument();
		});
	});

	test("prevents duplicate submissions while loading", async () => {
		render(<Chat />);
		const input = screen.getByPlaceholderText(
			"メッセージを入力してください...",
		);
		const submitButton = screen.getByTitle("送信");

		fireEvent.change(input, { target: { value: "重複テスト" } });
		fireEvent.click(submitButton);

		// Try to submit again immediately while loading
		fireEvent.change(input, { target: { value: "重複テスト2" } });
		fireEvent.click(submitButton);

		// Should only have one user message
		await waitFor(() => {
			const userMessages = screen.getAllByTestId("user-message");
			expect(userMessages).toHaveLength(1);
			expect(screen.getByText("重複テスト")).toBeInTheDocument();
			expect(screen.queryByText("重複テスト2")?.closest('.justify-end')).not.toBeInTheDocument();
		});
	});
});
