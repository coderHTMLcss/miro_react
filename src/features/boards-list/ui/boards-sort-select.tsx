import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/kit/select";

export type BoardsSortOption =
    | "createdAt"
    | "updatedAt"
    | "lastOpenedAt"
    | "name";

interface BoardsSortSelectProps {
    value: BoardsSortOption;
    onValueChange: (value: BoardsSortOption) => void;
}

export function BoardsSortSelect({
    value,
    onValueChange,
}: BoardsSortSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger id="sort" className="w-full">
                <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="lastOpenedAt">За датою відкриття</SelectItem>
                <SelectItem value="createdAt">За датою створення</SelectItem>
                <SelectItem value="updatedAt">За датою оновлення</SelectItem>
                <SelectItem value="name">За іменем</SelectItem>
            </SelectContent>
        </Select>
    );
}