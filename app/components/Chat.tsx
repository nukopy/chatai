import { useEffect, useRef, useState } from "react";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
}

export function Chat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isComposing, setIsComposing] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Need to scroll when messages change
	useEffect(() => {
		if (typeof window !== "undefined" && messagesEndRef.current?.scrollIntoView) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputValue.trim(),
			role: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsLoading(true);

		// Simulate AI response (replace with actual AI integration later)
		setTimeout(() => {
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				content:
					"こんにちは！メンターAIです。どのようなことでお悩みでしょうか？お気軽にお話しください。",
				role: "assistant",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, aiMessage]);
			setIsLoading(false);
		}, 1000);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey && !isComposing) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	const handleCompositionEnd = () => {
		setIsComposing(false);
	};

	return (
		<div className="flex flex-col h-screen bg-gray-900 text-white">
			{/* Header */}
			<header className="flex items-center justify-between p-4 border-b border-gray-700">
				<div className="flex items-center gap-3">
					<button type="button" className="p-2 hover:bg-gray-800 rounded-lg">
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							role="img"
							aria-label="メニュー"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<h1 className="text-xl font-medium">Mentor AI</h1>
				</div>
				<button type="button" className="p-2 hover:bg-gray-800 rounded-lg">
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="設定"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</button>
			</header>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 && (
					<div className="text-center text-gray-400 mt-20">
						<h2 className="text-2xl font-medium mb-2">Mentor AI へようこそ</h2>
						<p>何でもお気軽にお話しください。</p>
					</div>
				)}

				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${
							message.role === "user" ? "justify-end" : "justify-start"
						} group`}
					>
						{message.role === "user" && (
							<div data-testid="user-message" className="max-w-[80%] bg-gray-800 text-white p-4 rounded-2xl ml-auto">
								<div className="whitespace-pre-wrap">{message.content}</div>
							</div>
						)}
						{message.role === "assistant" && (
							<div className="max-w-[70%] text-white p-4">
								<div className="whitespace-pre-wrap">{message.content}</div>
							</div>
						)}
					</div>
				))}

				{isLoading && (
					<div className="flex justify-start">
						<div className="text-white p-4">
							<div className="flex items-center space-x-1">
								<div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
								<div
									className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
									style={{ animationDelay: "0.2s" }}
								/>
								<div
									className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
									style={{ animationDelay: "0.4s" }}
								/>
							</div>
						</div>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="p-4 border-t border-gray-700">
				<form onSubmit={handleSubmit} className="relative">
					<div className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
						<button
							type="button"
							className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg flex-shrink-0"
							title="添付ファイル"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
								aria-label="添付ファイル"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</button>

						<textarea
							ref={textareaRef}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
							onCompositionStart={handleCompositionStart}
							onCompositionEnd={handleCompositionEnd}
							placeholder="メッセージを入力してください..."
							rows={1}
							className="flex-1 bg-transparent text-white placeholder-gray-400 border-none outline-none resize-none min-h-[24px] max-h-32"
							disabled={isLoading}
						/>

						<button
							type="submit"
							disabled={!inputValue.trim() || isLoading}
							className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
							title="送信"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
								aria-label="送信"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
								/>
							</svg>
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
