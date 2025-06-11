import { type ApiSchemas } from "@/shared/api/schema";
import { BoardsFavoriteToggle } from "../ui/boards-favorite-toggle";
import { BoardsListItem } from "../ui/boards-list-item";
import { DropdownMenuItem } from "@/shared/ui/kit/dropdown-menu";
import { useBoardDelete } from "../model/use-boards-delete";
import { useUpdateFavorite } from "../model/use-update-favorite";

export function BoardItem({ board }: { board: ApiSchemas["Board"] }) {
    const deleteBoard = useBoardDelete();
    const updateFavorite = useUpdateFavorite();

    return (
        <BoardsListItem
            key={board.id}
            board={board}
            rightActions={
                <BoardsFavoriteToggle
                    isFavorite={updateFavorite.isOptimisticFavorite(board)}
                    onToggle={() => updateFavorite.toggle(board)}
                />
            }
            menuActions={
                <DropdownMenuItem
                    variant="destructive"
                    disabled={deleteBoard.getIsPending(board.id)}
                    onClick={() => deleteBoard.deleteBoard(board.id)}
                >
                    Видалити
                </DropdownMenuItem>
            }
        />
    );
}