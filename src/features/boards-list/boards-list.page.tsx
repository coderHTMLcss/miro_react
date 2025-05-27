import { rqClient } from "@/shared/api/instance";
import { CONFIG } from "@/shared/model/config";
import { ROUTES } from "@/shared/model/routes";
import { Button } from "@/shared/ui/kit/button";
import { Card, CardFooter, CardHeader } from "@/shared/ui/kit/card";
import { useQueryClient } from "@tanstack/react-query";
import { href, Link } from "react-router-dom";

function BoardsListPage() {
    const queryClient = useQueryClient();
    const boards = rqClient.useQuery('get', '/boards');
    const { data } = rqClient.useQuery('post', '/auth/refresh');

    console.log('bords-list');


    const createBoardMutation = rqClient.useMutation('post', '/boards', {
        onSettled: async () => {
            await queryClient.invalidateQueries(rqClient.queryOptions('get', '/boards'));
        }
    });
    const deleteBoardMutation = rqClient.useMutation('delete', '/boards/{boardId}', {
        onSettled: async () => {
            await queryClient.invalidateQueries(rqClient.queryOptions('get', '/boards'));
        }
    });

    return (
        <div className="container mx-auto px-4 py-4">
            <h1>Boards list {CONFIG.API_BASE_URL}</h1>

            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const name = formData.get('name')?.toString() || '';
                createBoardMutation.mutate({
                    body: { name },
                });
            }}>
                <input type="text" name="name" />
                <button type="submit" disabled={createBoardMutation.isPending}>
                    Create board
                </button>
            </form>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {boards.data?.map((board) => (
                    <Card key={board.id}>
                        <CardHeader>
                            <Button asChild variant="link">
                                <Link to={href(ROUTES.BOARD, { boardId: board.id })}>
                                    {board.name}
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardFooter>
                            <Button
                                variant="destructive"
                                disabled={deleteBoardMutation.isPending}
                                onClick={() => deleteBoardMutation.mutate({ params: { path: { boardId: board.id } } })}>

                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </ul>

        </div>
    );
}

export const Component = BoardsListPage;