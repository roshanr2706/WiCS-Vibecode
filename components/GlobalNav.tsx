import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, Calendar, Inbox, History, CircleHelp, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItemProps {
    icon: React.ReactNode
    label: string
    href: string
}

function NavItem({ icon, label, href }: NavItemProps) {
    const pathname = usePathname()
    // Check if the current path starts with the href (for nested routes)
    // But handle root path "/" specifically to avoid matching everything
    const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href)

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link
                        href={href}
                        className={`group flex flex-col items-center justify-center w-full py-3 transition-colors ${isActive ? "bg-white text-[#2D3B45]" : "text-white hover:bg-[#2D3B45]"
                            }`}
                    >
                        <div className={`mb-1 ${isActive ? "text-[#2D3B45]" : "text-white"}`}>{icon}</div>
                        <span className="text-[10px] font-medium leading-tight text-center hidden md:block">{label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-[#2D3B45] text-white border-none">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export function GlobalNav() {
    return (
        <nav className="fixed left-0 top-0 h-full w-[84px] bg-[#2D3B45] flex flex-col items-center py-4 z-50 shadow-lg">
            <div className="mb-6">
                <Link href="/" className="block">
                    {/* Placeholder for Logo */}
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        LOGO
                    </div>
                </Link>
            </div>

            <div className="flex-1 w-full flex flex-col gap-1">
                <NavItem
                    icon={<User className="w-6 h-6" />}
                    label="Account"
                    href="/account"
                />
                <NavItem
                    icon={<LayoutDashboard className="w-6 h-6" />}
                    label="Dashboard"
                    href="/"
                />
                <NavItem
                    icon={<BookOpen className="w-6 h-6" />}
                    label="Courses"
                    href="/courses"
                />
                <NavItem
                    icon={<Calendar className="w-6 h-6" />}
                    label="Calendar"
                    href="/calendar"
                />
                <NavItem
                    icon={<Inbox className="w-6 h-6" />}
                    label="Inbox"
                    href="/inbox"
                />
                <NavItem
                    icon={<History className="w-6 h-6" />}
                    label="History"
                    href="/history"
                />
                <NavItem
                    icon={<CircleHelp className="w-6 h-6" />}
                    label="Help"
                    href="/help"
                />
            </div>
        </nav>
    )
}
