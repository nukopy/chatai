import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Chat from "./Chat";

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe("Chat", () => {
  it("renders initial AI message", () => {
    render(<Chat />);
    expect(screen.getByText(/こんにちは！元気そうですね/)).toBeInTheDocument();
  });

  it("renders input field with placeholder", () => {
    render(<Chat />);
    expect(screen.getByPlaceholderText("Ask anything")).toBeInTheDocument();
  });

  it("renders header with title", () => {
    render(<Chat />);
    expect(screen.getByText("ChatAI")).toBeInTheDocument();
  });

  it("sends message when Enter is pressed", async () => {
    render(<Chat />);
    const textarea = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(textarea, { target: { value: "テストメッセージ" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(screen.getByText("テストメッセージ")).toBeInTheDocument();
    expect(textarea).toHaveValue("");
  });

  it("does not send message when Shift+Enter is pressed", () => {
    render(<Chat />);
    const textarea = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(textarea, { target: { value: "テストメッセージ" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(textarea).toHaveValue("テストメッセージ");
  });

  it("shows loading indicator when sending message", async () => {
    render(<Chat />);
    const textarea = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(textarea, { target: { value: "テストメッセージ" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    // Check for loading dots
    const loadingDots = screen.getAllByText("", { 
      selector: ".animate-bounce" 
    });
    expect(loadingDots).toHaveLength(3);
  });

  it("displays AI response after loading", async () => {
    render(<Chat />);
    const textarea = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(textarea, { target: { value: "テストメッセージ" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() => {
      expect(screen.getByText(/確かに、そういうアプリって面白そうですね/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it("does not send empty message", () => {
    render(<Chat />);
    const textarea = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(textarea, { target: { value: "   " } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    // Should not add any new messages beyond the initial one
    const messages = screen.getAllByText(/こんにちは！元気そうですね|確かに、そういうアプリって/);
    expect(messages).toHaveLength(1);
  });

  it("copies message content when copy button is clicked", async () => {
    render(<Chat />);
    
    // Hover over a message to show action buttons
    const messageDiv = screen.getByText(/こんにちは！元気そうですね/).closest(".group");
    expect(messageDiv).toBeInTheDocument();
    
    fireEvent.mouseEnter(messageDiv!);
    
    const copyButtons = screen.getAllByTitle("コピー");
    expect(copyButtons.length).toBeGreaterThan(0);
    
    fireEvent.click(copyButtons[0]);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining("こんにちは！元気そうですね")
    );
  });

  it("displays user messages on the right side", async () => {
    render(<Chat />);
    const textarea = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(textarea, { target: { value: "ユーザーメッセージ" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    const userMessageContainer = screen.getByText("ユーザーメッセージ").closest(".justify-end");
    expect(userMessageContainer).toBeInTheDocument();
  });

  it("displays AI messages on the left side with background", () => {
    render(<Chat />);
    
    const aiMessageContainer = screen.getByText(/こんにちは！元気そうですね/).closest(".bg-gray-800");
    expect(aiMessageContainer).toBeInTheDocument();
    expect(aiMessageContainer).toHaveClass("rounded-2xl");
  });
});