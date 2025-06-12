import { useState } from "react";
import { useBoardsList } from "./model/use-boards-list";

import {
    BoardsLayoutContentGroups,
    BoardsListLayout,
    BoardsListLayoutCards,
    BoardsListLayoutContent,
    BoardsListLayoutHeader,
    BoardsListLayoutList,
} from "./ui/boards-list-layout";
import { type ViewMode, ViewModeToggle } from "./ui/view-mode-toggle";

import { useRecentGroups } from "./model/use-recent-group";

import { BoardCard } from "./compose/board-card";
import { BoardItem } from "./compose/board-item";
import { BoardsSidebar } from "./ui/boards-sidebar";

function BoardsListPage() {
    const boardsQuery = useBoardsList({
        sort: "lastOpenedAt",
    });

    const [viewMode, setViewMode] = useState<ViewMode>("list");

    const recentGroups = useRecentGroups(boardsQuery.boards);

    return (
        <BoardsListLayout
            sidebar={<BoardsSidebar />}
            header={
                <BoardsListLayoutHeader
                    title="Останні дошки"
                    description="Тут ви можете переглядати та керувати своїми останніми дошками"
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
            >
                <BoardsLayoutContentGroups
                    groups={recentGroups.map((group) => ({
                        items: {
                            list: (
                                <BoardsListLayoutList>
                                    {group.items.map((board) => (
                                        <BoardItem board={board} />
                                    ))}
                                </BoardsListLayoutList>
                            ),
                            cards: (
                                <BoardsListLayoutCards>
                                    {group.items.map((board) => (
                                        <BoardCard board={board} />
                                    ))}
                                </BoardsListLayoutCards>
                            ),
                        }[viewMode],
                        title: group.title,
                    }))}
                />
            </BoardsListLayoutContent>
        </BoardsListLayout>
    );
}

export const Component = BoardsListPage;