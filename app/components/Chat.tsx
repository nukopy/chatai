import { useState } from "react";

export interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
}

export function Chat() {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			content: "こんにちは！私はあなたのAIメンターです。どんなことでも相談してくださいね。",
			role: "assistant",
			timestamp: new Date(),
		},
	]);
	const [inputMessage, setInputMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSendMessage = async () => {
		if (!inputMessage.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: inputMessage,
			role: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputMessage("");
		setIsLoading(true);

		// TODO: AI統合機能の実装（この段階では仮の応答）
		setTimeout(() => {
			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: `${inputMessage}について考えてみますね。現在は基本的なチャット機能の実装段階です。`,
				role: "assistant",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, assistantMessage]);
			setIsLoading(false);
		}, 1000);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="flex flex-col h-screen bg-base-100">
			{/* ヘッダー */}
			<div className="navbar bg-primary text-primary-content">
				<div className="flex-1">
					<h1 className="text-xl font-bold">AIメンターチャット</h1>
				</div>
			</div>

			{/* チャット表示エリア */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`chat ${message.role === "user" ? "chat-end" : "chat-start"}`}
					>
						<div className="chat-image avatar">
							<div className="w-10 rounded-full">
								{message.role === "user" ? (
									<div className="bg-primary text-primary-content w-10 h-10 rounded-full flex items-center justify-center">
										<span className="text-sm">あ</span>
									</div>
								) : (
									<div className="bg-secondary text-secondary-content w-10 h-10 rounded-full flex items-center justify-center">
										<span className="text-sm">AI</span>
									</div>
								)}
							</div>
						</div>
						<div className="chat-header">
							{message.role === "user" ? "あなた" : "AIメンター"}
							<time className="text-xs opacity-50 ml-1">
								{message.timestamp.toLocaleTimeString("ja-JP", {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</time>
						</div>
						<div
							className={`chat-bubble ${
								message.role === "user"
									? "chat-bubble-primary"
									: "chat-bubble-secondary"
							}`}
						>
							{message.content}
						</div>
					</div>
				))}

				{/* ローディング表示 */}
				{isLoading && (
					<div className="chat chat-start">
						<div className="chat-image avatar">
							<div className="w-10 rounded-full">
								<div className="bg-secondary text-secondary-content w-10 h-10 rounded-full flex items-center justify-center">
									<span className="text-sm">AI</span>
								</div>
							</div>
						</div>
						<div className="chat-header">AIメンター</div>
						<div className="chat-bubble chat-bubble-secondary">
							<span className="loading loading-dots loading-sm"></span>
						</div>
					</div>
				)}
			</div>

			{/* メッセージ入力エリア */}
			<div className="p-4 bg-base-200">
				<div className="flex gap-2">
					<textarea
						className="textarea textarea-bordered flex-1 resize-none"
						placeholder="メッセージを入力してください..."
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						rows={1}
						disabled={isLoading}
					/>
					<button
						className="btn btn-primary"
						onClick={handleSendMessage}
						disabled={!inputMessage.trim() || isLoading}
					>
						{isLoading ? (
							<span className="loading loading-spinner loading-sm"></span>
						) : (
							"送信"
						)}
					</button>
				</div>
				<div className="text-xs text-base-content/60 mt-2">
					Enterキーで送信、Shift+Enterで改行
				</div>
			</div>
		</div>
	);
}