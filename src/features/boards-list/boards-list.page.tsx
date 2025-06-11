import { useState } from "react";
import { Button } from "@/shared/ui/kit/button";
import { useBoardsList } from "./model/use-boards-list";
import { useBoardsFilter } from "./model/use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";
// import { useCreateBoard } from "./model/use-create-board";

import { PlusIcon } from "lucide-react";
import {
    BoardsListLayout,
    BoardsListLayoutContent,
    BoardsListLayoutFilters,
    BoardsListLayoutHeader,
} from "./ui/boards-list-layout";
import { type ViewMode, ViewModeToggle } from "./ui/view-mode-toggle";
import { BoardsSortSelect } from "./ui/boards-sort-select";
import { BoardsSearchInput } from "./ui/boards-search-input";
import { BoardItem } from "./compose/board-item";
import { BoardCard } from "./compose/board-card";
// import { BoardsSidebar } from "./ui/boards-sidebar";
// import {
//     TemplatesGallery,
//     TemplatesModal,
//     useTemplatesModal,
// } from "@/features/board-templates";

function BoardsListPage() {
    const boardsFilters = useBoardsFilter();
    const boardsQuery = useBoardsList({
        sort: boardsFilters.sort,
        search: useDebouncedValue(boardsFilters.search, 300),
    });

    // const templatesModal = useTemplatesModal();

    // const createBoard = useCreateBoard();

    const [viewMode, setViewMode] = useState<ViewMode>("list");

    return (
        <>
            {/* <TemplatesModal /> */}
            <BoardsListLayout
                // templates={<TemplatesGallery />}
                // sidebar={<BoardsSidebar />}
                header={
                    <BoardsListLayoutHeader
                        title="Дошки"
                        description="Тут ви можете переглядати та керувати своїми дошками"
                        actions={
                            <>
                                {/* <Button variant="outline" onClick={() => templatesModal.open()}>
                                    Вибрати шаблон
                                </Button>
                                <Button
                                    disabled={createBoard.isPending}
                                    onClick={createBoard.createBoard}
                                >
                                    <PlusIcon />
                                    Створити дошку
                                </Button> */}
                            </>
                        }
                    />
                }
                filters={
                    <BoardsListLayoutFilters
                        sort={
                            <BoardsSortSelect
                                value={boardsFilters.sort}
                                onValueChange={boardsFilters.setSort}
                            />
                        }
                        filters={
                            <BoardsSearchInput
                                value={boardsFilters.search}
                                onChange={boardsFilters.setSearch}
                            />
                        }
                        actions={
                            <ViewModeToggle
                                value={viewMode}
                                onChange={(value) => setViewMode(value)}
                            />
                        }
                    />
                }
            >
                <BoardsListLayoutContent
                    isEmpty={boardsQuery.boards.length === 0}
                    isPending={boardsQuery.isPending}
                    isPendingNext={boardsQuery.isFetchingNextPage}
                    cursorRef={boardsQuery.cursorRef}
                    hasCursor={boardsQuery.hasNextPage}
                    mode={viewMode}
                    renderList={() =>
                        boardsQuery.boards.map((board) => (
                            <BoardItem key={board.id} board={board} />
                        ))
                    }
                    renderGrid={() =>
                        boardsQuery.boards.map((board) => (
                            <BoardCard key={board.id} board={board} />
                        ))
                    }
                />
            </BoardsListLayout>
        </>
    );
}

export const Component = BoardsListPage;