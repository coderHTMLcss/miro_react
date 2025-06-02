import { rqClient } from "@/shared/api/instance";
import { CONFIG } from "@/shared/model/config";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { useQueryClient } from "@tanstack/react-query";
import { Link, href } from "react-router-dom";
import { Input } from "@/shared/ui/kit/input";
import { Label } from "@/shared/ui/kit/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/kit/select";
import { Switch } from "@/shared/ui/kit/switch";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/kit/tabs";
import type { ApiSchemas } from "@/shared/api/schema";
import { useBoardsList } from "./use-boards-list";
import { useBoardsFilter } from "./use-boards-filters";
import { useDebouncedValue } from "@/shared/lib/react";

type BoardsSortOption = "createdAt" | "updatedAt" | "lastOpenedAt" | "name";

function BoardsListPage() {
    const queryClient = useQueryClient();

    const boardsFilters = useBoardsFilter();
    const boardsQuery = useBoardsList({
        sort: boardsFilters.sort,
        search: useDebouncedValue(boardsFilters.search, 300)
    });


    const createBoardMutation = rqClient.useMutation("post", "/boards", {
        onSettled: async () => {
            await queryClient.invalidateQueries(
                rqClient.queryOptions("get", "/boards")
            );
        },
    });

    const deleteBoardMutation = rqClient.useMutation(
        "delete",
        "/boards/{boardId}",
        {
            onSettled: async () => {
                await queryClient.invalidateQueries(
                    rqClient.queryOptions("get", "/boards")
                );
            },
        }
    );

    const toggleFavoriteMutation = rqClient.useMutation(
        "put",
        "/boards/{boardId}/favorite",
        {
            onSettled: async () => {
                await queryClient.invalidateQueries(
                    rqClient.queryOptions("get", "/boards")
                );
            },
        }
    );

    const handleToggleFavorite = (board: ApiSchemas["Board"]) => {
        toggleFavoriteMutation.mutate({
            params: { path: { boardId: board.id } },
            body: { isFavorite: !board.isFavorite },
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Дошки {CONFIG.API_BASE_URL}</h1>

            <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                    <Label htmlFor="search">Пошук</Label>
                    <Input
                        id="search"
                        placeholder="Введіть назву дошки..."
                        value={boardsFilters.search}
                        onChange={(e) => boardsFilters.setSearch(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="flex flex-col">
                    <Label htmlFor="sort">Сортування</Label>
                    <Select
                        value={boardsFilters.sort}
                        onValueChange={(value) => boardsFilters.setSort(value as BoardsSortOption)}
                    >
                        <SelectTrigger id="sort" className="w-full">
                            <SelectValue placeholder="Сортировка" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="lastOpenedAt">По даті відкриття</SelectItem>
                            <SelectItem value="createdAt">По даті створення</SelectItem>
                            <SelectItem value="updatedAt">По даті оновлення</SelectItem>
                            <SelectItem value="name">По імені</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                    <TabsTrigger value="all">
                        Всі дошки
                    </TabsTrigger>
                    <TabsTrigger value="favorites">
                        Обрані
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mb-8">
                <form
                    className="flex gap-4 items-end"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createBoardMutation.mutate({});
                        e.currentTarget.reset();
                    }}
                >
                    <div className="flex-grow">
                        <Label htmlFor="board-name">Назва нової дошки</Label>
                        <Input
                            id="board-name"
                            name="name"
                            placeholder="Введіть назву..."
                        />
                    </div>
                    <Button type="submit" disabled={createBoardMutation.isPending}>
                        Створити дошку
                    </Button>
                </form>
            </div>

            {boardsQuery.isPending ? (
                <div className="text-center py-10">Завантаження...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boardsQuery.boards.map((board) => (
                            <Card key={board.id} className="relative">
                                <div className="absolute top-2 right-2 flex items-center gap-2">
                                    <Switch
                                        checked={board.isFavorite}
                                        onCheckedChange={() => handleToggleFavorite(board)}
                                    />
                                    <span className="text-sm text-gray-500">
                                        {board.isFavorite ? "В доданому" : ""}
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
                                        disabled={deleteBoardMutation.isPending}
                                        onClick={() =>
                                            deleteBoardMutation.mutate({
                                                params: { path: { boardId: board.id } },
                                            })
                                        }
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
        </div>
    );
}

export const Component = BoardsListPage;