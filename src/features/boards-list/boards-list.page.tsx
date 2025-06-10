
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { Link, href } from "react-router-dom";

import { Switch } from "@/shared/ui/kit/switch";
import { useBoardsList } from "./use-boards-list";
import { useBoardsFilter } from "./use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";
import { useBoardsCreate } from "./use-boards-create";
import { useBoardDelete } from "./use-boards-delete";
import { useUpdateFavorite } from "./use-update-favorite";
import { Plus, StarIcon } from "lucide-react";
import { BoardsListLayout, BoardsListLayoutFilters, BoardsListLayoutHeader } from "./boards-list-layout";
import { type ViewMode, ViewModeToggle } from "./view-mode-toggle";
import { useState } from "react";
import { BoardsSearchInput } from "./boards-search-input";
import { BoardsSortSelect } from "./boards-sort-select";


type BoardsSortOption = "createdAt" | "updatedAt" | "lastOpenedAt" | "name";

function BoardsListPage() {
    const boardsFilters = useBoardsFilter();
    const boardsQuery = useBoardsList({
        sort: boardsFilters.sort,
        search: useDebouncedValue(boardsFilters.search, 300)
    });
    const createBoard = useBoardsCreate();
    const deleteBoard = useBoardDelete();
    const updateFavorite = useUpdateFavorite();

    const [viewMode, setViewMode] = useState<ViewMode>("cards");

    return (
        <BoardsListLayout
            header={
                <BoardsListLayoutHeader
                    title="Дошки"
                    description="Список ваших дошок для управління завданнями"
                    actions={
                        <Button
                            type="submit"
                            disabled={createBoard.isPending}
                            onClick={() => createBoard.createBoard({})}
                        >
                            <Plus />
                            Створити дошку
                        </Button>
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
                            value="cards" // This should be dynamic based on user preference
                            onChange={(viewMode) => setViewMode(viewMode)}
                        />
                    }
                />
            }
        >

            {boardsQuery.isPending ? (
                <div className="text-center py-10">Завантаження...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boardsQuery.boards.map((board) => (
                            <Card key={board.id} className="relative">
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                    <Switch
                                        checked={updateFavorite.isOptimisticFavorite(board)}
                                        onCheckedChange={() => updateFavorite.toggle(board)}
                                    />
                                    <span className="text-sm text-gray-500">
                                        <StarIcon />
                                    </span>
                                </div>
                                <CardHeader>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            asChild
                                            variant="link"
                                            className="text-left justify-start h-auto p-0"
                                        >
                                            <Link to={href(ROUTES.BOARD, { boardId: board.id })}>
                                                <span className="text-xl font-medium">
                                                    {board.name}
                                                </span>
                                            </Link>
                                        </Button>
                                        <div className="text-sm text-gray-500">
                                            Створено: {new Date(board.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Останнє відкриття:{" "}
                                            {new Date(board.lastOpenedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardFooter>
                                    <Button
                                        variant="destructive"
                                        disabled={deleteBoard.getIsPending(board.id)}
                                        onClick={() => deleteBoard.deleteBoard(board.id)}
                                    >
                                        Видалити дошку
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {boardsQuery.boards.length === 0 && !boardsQuery.isPending && (
                        <div className="text-center py-10">Дошки не знайдені</div>
                    )}

                    {boardsQuery.hasNextPage && (
                        <div ref={boardsQuery.cursorRef} className="text-center py-8">
                            {boardsQuery.isFetchingNextPage && "Завантаження додаткових дошок..."}
                        </div>
                    )}
                </>
            )}
        </BoardsListLayout>
    )
}

export const Component = BoardsListPage;