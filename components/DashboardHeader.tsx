import { MoreVertical, LayoutGrid, List, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
    return (
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
            <h1 className="text-3xl font-normal text-[#2D3B45]">Dashboard</h1>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-[#2D3B45]">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <LayoutGrid className="h-4 w-4" />
                            <span>Card View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <List className="h-4 w-4" />
                            <span>List View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <Clock className="h-4 w-4" />
                            <span>Recent Activity</span>
                        </DropdownMenuItem>
                        <div className="h-px bg-gray-100 my-1" />
                        <DropdownMenuItem className="cursor-pointer">
                            Color Overlay
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
