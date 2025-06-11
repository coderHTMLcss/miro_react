import { type ApiSchemas } from "@/shared/api/schema";
import { BoardsFavoriteToggle } from "../ui/boards-favorite-toggle";
import { BoardsListCard } from "../ui/boards-list-card";
import { Button } from "@/shared/ui/kit/button";
import { useUpdateFavorite } from "../model/use-update-favorite";
import { useBoardDelete } from "../model/use-boards-delete";

export function BoardCard({ board }: { board: ApiSchemas["Board"] }) {
    const deleteBoard = useBoardDelete();
    const updateFavorite = useUpdateFavorite();

    return (
        <BoardsListCard
            key={board.id}
            board={board}
            rightTopActions={
                <BoardsFavoriteToggle
                    isFavorite={updateFavorite.isOptimisticFavorite(board)}
                    onToggle={() => updateFavorite.toggle(board)}
                />
            }
            bottomActions={
                <Button
                    variant="destructive"
                    disabled={deleteBoard.getIsPending(board.id)}
                    onClick={() => deleteBoard.deleteBoard(board.id)}
                >
                    Видалити
                </Button>
            }
        />
    );
}