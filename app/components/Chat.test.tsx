import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Chat } from "./Chat";

// タイマーをモック化
vi.useFakeTimers();

describe("Chat component", () => {
	it("初期メッセージが表示される", () => {
		render(<Chat />);

		expect(screen.getByText("AIメンターチャット")).toBeInTheDocument();
		expect(
			screen.getByText("こんにちは！私はあなたのAIメンターです。どんなことでも相談してくださいね。"),
		).toBeInTheDocument();
	});

	it("メッセージ入力フィールドと送信ボタンが存在する", () => {
		render(<Chat />);

		const textarea = screen.getByPlaceholderText("メッセージを入力してください...");
		const sendButton = screen.getByRole("button", { name: "送信" });

		expect(textarea).toBeInTheDocument();
		expect(sendButton).toBeInTheDocument();
	});

	it("空のメッセージは送信できない", () => {
		render(<Chat />);

		const sendButton = screen.getByRole("button", { name: "送信" });
		expect(sendButton).toBeDisabled();
	});

	it("メッセージを入力すると送信ボタンが有効になる", async () => {
		const user = userEvent.setup();
		render(<Chat />);

		const textarea = screen.getByPlaceholderText("メッセージを入力してください...");
		const sendButton = screen.getByRole("button", { name: "送信" });

		await user.type(textarea, "テストメッセージ");

		expect(sendButton).not.toBeDisabled();
	});

	it("メッセージを送信すると表示される", async () => {
		const user = userEvent.setup();
		render(<Chat />);

		const textarea = screen.getByPlaceholderText("メッセージを入力してください...");
		const sendButton = screen.getByRole("button", { name: "送信" });

		await user.type(textarea, "テストメッセージ");
		await user.click(sendButton);

		expect(screen.getByText("テストメッセージ")).toBeInTheDocument();
		expect(textarea).toHaveValue("");
	});

	it("Enterキーでメッセージを送信できる", async () => {
		const user = userEvent.setup();
		render(<Chat />);

		const textarea = screen.getByPlaceholderText("メッセージを入力してください...");

		await user.type(textarea, "Enterキーテスト");
		await user.keyboard("{Enter}");

		expect(screen.getByText("Enterキーテスト")).toBeInTheDocument();
		expect(textarea).toHaveValue("");
	});

	it("Shift+Enterで改行される", async () => {
		const user = userEvent.setup();
		render(<Chat />);

		const textarea = screen.getByPlaceholderText("メッセージを入力してください...");

		await user.type(textarea, "1行目");
		await user.keyboard("{Shift>}{Enter}{/Shift}");
		await user.type(textarea, "2行目");

		expect(textarea).toHaveValue("1行目\n2行目");
	});

	it("メッセージ送信中はローディング状態になる", async () => {
		const user = userEvent.setup();
		render(<Chat />);

		const textarea = screen.getByPlaceholderText("メッセージを入力してください...");
		const sendButton = screen.getByRole("button", { name: "送信" });

		await user.type(textarea, "ローディングテスト");
		await user.click(sendButton);

		// ローディング中はボタンと入力フィールドが無効になる
		expect(sendButton).toBeDisabled();
		expect(textarea).toBeDisabled();

		// ローディングスピナーが表示される
		expect(screen.getByRole("button").querySelector(".loading-spinner")).toBeInTheDocument();
	});

	it("AI応答が時間差で表示される", async () => {
		const user = userEvent.setup();
		render(<Chat />);

		const textarea = screen.getByPlaceholderText("メッセージを入力してください...");
		const sendButton = screen.getByRole("button", { name: "送信" });

		await user.type(textarea, "AI応答テスト");
		await user.click(sendButton);

		// タイマーを進める
		vi.advanceTimersByTime(1000);

		await waitFor(() => {
			expect(screen.getByText("AI応答テストについて考えてみますね。現在は基本的なチャット機能の実装段階です。")).toBeInTheDocument();
		});
	});

	it("ユーザーとAIのメッセージが区別して表示される", async () => {
		const user = userEvent.setup();
		render(<Chat />);

		const textarea = screen.getByPlaceholderText("メッセージを入力してください...");
		const sendButton = screen.getByRole("button", { name: "送信" });

		await user.type(textarea, "区別テスト");
		await user.click(sendButton);

		// ユーザーメッセージの確認
		const userMessage = screen.getByText("区別テスト").closest(".chat");
		expect(userMessage).toHaveClass("chat-end");

		// AIメッセージの確認（初期メッセージ）
		const aiMessage = screen.getByText("こんにちは！私はあなたのAIメンターです。どんなことでも相談してくださいね。").closest(".chat");
		expect(aiMessage).toHaveClass("chat-start");
	});
});