import Link from "next/link"
import { X, Megaphone, FileEdit, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TodoItemProps {
    icon: React.ReactNode
    title: string
    course: string
    points: string
    date: string
}

function TodoItem({ icon, title, course, points, date }: TodoItemProps) {
    return (
        <div className="flex gap-3 mb-4 group">
            <div className="mt-1 text-gray-500">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <Link href="#" className="text-sm font-medium text-[#2D3B45] hover:underline line-clamp-2 leading-tight">
                        {title}
                    </Link>
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-xs text-gray-500 truncate">{course}</p>
                <p className="text-xs text-gray-400">{points} • {date}</p>
            </div>
        </div>
    )
}

export function RightSidebar() {
    return (
        <aside className="w-[280px] hidden xl:block pl-6 border-l border-gray-200 min-h-screen">
            <div className="mb-6">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">To Do</h2>
                <TodoItem
                    icon={<Megaphone className="w-4 h-4" />}
                    title="Read Chapter 4"
                    course="CS 101: Intro to CS"
                    points="10 pts"
                    date="Nov 28 at 11:59pm"
                />
                <TodoItem
                    icon={<FileEdit className="w-4 h-4" />}
                    title="Project Proposal"
                    course="HIST 202: World History"
                    points="50 pts"
                    date="Nov 30 at 11:59pm"
                />
                <TodoItem
                    icon={<FileEdit className="w-4 h-4" />}
                    title="Lab Report 3"
                    course="CHEM 101: General Chemistry"
                    points="25 pts"
                    date="Dec 2 at 11:59pm"
                />
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Coming Up</h2>
                    <Link href="#" className="text-xs text-[#2D3B45] hover:underline">View Calendar</Link>
                </div>
                <TodoItem
                    icon={<CalendarDays className="w-4 h-4" />}
                    title="Midterm Exam"
                    course="MATH 101: Calculus I"
                    points="100 pts"
                    date="Dec 5 at 10:00am"
                />
            </div>

            <div className="mb-6">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Recent Feedback</h2>
                <div className="text-sm text-gray-500 italic">Nothing for now</div>
            </div>

            <Button variant="outline" className="w-full text-[#2D3B45] border-gray-300 hover:bg-gray-50">
                View Grades
            </Button>
        </aside>
    )
}
