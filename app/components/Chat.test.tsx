import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Chat } from "./Chat";

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe("Chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render initial empty state", () => {
    render(<Chat />);
    
    expect(screen.getByText("こんにちは！")).toBeInTheDocument();
    expect(screen.getByText("何について話し合いましょうか？")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ask anything")).toBeInTheDocument();
  });

  it("should render header with title", () => {
    render(<Chat />);
    
    expect(screen.getByText("ChatAI")).toBeInTheDocument();
  });

  it("should send a message when typing and pressing Enter", async () => {
    render(<Chat />);
    
    const input = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter" });
    
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
    });
    
    expect(input.value).toBe("");
  });

  it("should not send empty message", () => {
    render(<Chat />);
    
    const input = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter" });
    
    expect(screen.getByText("こんにちは！")).toBeInTheDocument();
    expect(screen.queryByText("   ")).not.toBeInTheDocument();
  });

  it("should allow line break with Shift+Enter", () => {
    render(<Chat />);
    
    const input = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(input, { target: { value: "Line 1" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", shiftKey: true });
    
    expect(input.value).toBe("Line 1");
  });

  it("should show loading state when sending message", async () => {
    render(<Chat />);
    
    const input = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter" });
    
    await waitFor(() => {
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
    
    // Check for loading animation dots
    const dots = screen.getAllByTestId ? screen.queryAllByTestId("loading-dot") : [];
    // Since we don't have test IDs, we check for the loading container structure
    expect(document.querySelector(".animate-bounce")).toBeInTheDocument();
  });

  it("should receive AI response after sending message", async () => {
    vi.useFakeTimers();
    
    render(<Chat />);
    
    const input = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(input, { target: { value: "Hello AI" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter" });
    
    await waitFor(() => {
      expect(screen.getByText("Hello AI")).toBeInTheDocument();
    });
    
    // Fast forward time to trigger AI response
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText(/ありがとうございます！メンタリングツールとして/)).toBeInTheDocument();
    });
    
    vi.useRealTimers();
  });

  it("should copy message content when copy button is clicked", async () => {
    render(<Chat />);
    
    const input = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(input, { target: { value: "Copy this message" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter" });
    
    await waitFor(() => {
      expect(screen.getByText("Copy this message")).toBeInTheDocument();
    });
    
    const copyButtons = screen.getAllByTitle("コピー");
    fireEvent.click(copyButtons[0]);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Copy this message");
  });

  it("should display messages with proper styling", async () => {
    vi.useFakeTimers();
    
    render(<Chat />);
    
    const input = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(input, { target: { value: "User message" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter" });
    
    await waitFor(() => {
      expect(screen.getByText("User message")).toBeInTheDocument();
    });
    
    vi.advanceTimersByTime(1000);
    
    await waitFor(() => {
      expect(screen.getByText(/ありがとうございます！/)).toBeInTheDocument();
    });
    
    // Check that AI message has background styling
    const aiMessageContainer = screen.getByText(/ありがとうございます！/).closest("div");
    expect(aiMessageContainer).toHaveClass("bg-gray-800");
    
    vi.useRealTimers();
  });

  it("should have action buttons for each message", async () => {
    render(<Chat />);
    
    const input = screen.getByPlaceholderText("Ask anything");
    
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter" });
    
    await waitFor(() => {
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
    
    // Should have copy, like, dislike, and play buttons
    expect(screen.getAllByTitle("コピー")).toHaveLength(1);
    expect(screen.getAllByTitle("いいね")).toHaveLength(1);
    expect(screen.getAllByTitle("よくない")).toHaveLength(1);
    expect(screen.getAllByTitle("再生")).toHaveLength(1);
  });
});