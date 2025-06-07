import Chat from "../components/Chat";
import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
	return [
		{ title: "ChatAI - AIメンタリングチャット" },
		{ name: "description", content: "AI メンターとの対話を通じてメンタルケアと成長をサポートするチャットアプリケーション" },
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

export default function Home({ loaderData }: Route.ComponentProps) {
	return <Chat />;
}
