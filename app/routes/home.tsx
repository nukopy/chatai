import { Chat } from "../components/Chat";
import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "AIメンターチャット" },
		{ name: "description", content: "AI技術を活用した対話型メンタリング体験" },
	];
}

export default function Home() {
	return <Chat />;
}
