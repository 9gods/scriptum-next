import type { icons } from "lucide-react";

export interface EmptyStateProps {
	title?: string;
	description?: string;
	actionText?: string;
	actionHref?: string;
	icon?: keyof typeof icons;
	className?: string;
}
