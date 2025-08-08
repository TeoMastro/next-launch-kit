import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

// Pagination Component
export const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
	totalCount,
	limit,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	totalCount: number;
	limit: number;
}) => {
	const tLayout = useTranslations("Layout");

	const startItem = (currentPage - 1) * limit + 1;
	const endItem = Math.min(currentPage * limit, totalCount);

	return (
		<div className="flex items-center justify-between px-2 py-4">
			<div className="text-sm text-muted-foreground">
				{tLayout("showing")} {startItem} {tLayout("to")} {endItem}{" "}
				{tLayout("of")} {totalCount} {tLayout("results")}
			</div>

			<div className="flex items-center space-x-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(1)}
					disabled={currentPage <= 1}
				>
					<ChevronsLeft className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1}
				>
					<ChevronLeft className="h-4 w-4" />
					{tLayout("previous")}
				</Button>

				<div className="text-sm px-2">
					{tLayout("page")} {currentPage} {tLayout("of")} {totalPages}
				</div>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages}
				>
					{tLayout("next")}
					<ChevronRight className="h-4 w-4" />
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(totalPages)}
					disabled={currentPage >= totalPages}
				>
					<ChevronsRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};
