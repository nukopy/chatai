import { Chat } from "../components/Chat";
import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "ChatAI - AIメンター" },
		{ name: "description", content: "AI技術を活用した対話型メンタリング体験" },
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Chat />;
}
