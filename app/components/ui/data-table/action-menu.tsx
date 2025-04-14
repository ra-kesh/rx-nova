import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Power } from "lucide-react"

interface ActionMenuProps<T> {
  item: T
  onUpdate?: (item: T) => void
  onEdit?: (item: T) => void
}

export function ActionMenu<T extends { _id: string; isActive?: boolean }>({ 
  item,
  onUpdate,
  onEdit
}: ActionMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit?.(item)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        {onUpdate && (
          <DropdownMenuItem
            onClick={() => onUpdate(item)}
          >
            <Power className="mr-2 h-4 w-4" />
            {item.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}