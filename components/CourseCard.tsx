import { Megaphone, FileText, MessageSquare, Folder } from "lucide-react"
import Link from "next/link"

interface CourseCardProps {
    title: string
    code: string
    term: string
    color: string
    image?: string
    href?: string
}

export function CourseCard({ title, code, term, color, image, href = "#" }: CourseCardProps) {
    return (
        <div className="group flex flex-col bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-[260px]">
            {/* Card Header / Image */}
            <div
                className="h-36 w-full relative"
                style={{ backgroundColor: color }}
            >
                {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={image}
                        alt=""
                        className="w-full h-full object-cover opacity-50 mix-blend-multiply"
                    />
                )}
                <div className="absolute top-3 right-3">
                    <div className="bg-black/20 hover:bg-black/40 p-1 rounded cursor-pointer transition-colors">
                        <div className="w-1 h-1 bg-white rounded-full mb-0.5" />
                        <div className="w-1 h-1 bg-white rounded-full mb-0.5" />
                        <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col">
                <Link href={href} className="block">
                    <h3 className="text-[#2D3B45] font-bold text-sm leading-tight mb-1 group-hover:underline line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-1 truncate">{code}</p>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wide">{term}</p>
                </Link>
            </div>

            {/* Card Actions */}
            <div className="px-4 pb-3 flex items-center gap-4">
                <Link href="#" className="text-gray-400 hover:text-[#2D3B45] transition-colors">
                    <Megaphone className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#2D3B45] transition-colors">
                    <FileText className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#2D3B45] transition-colors">
                    <MessageSquare className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#2D3B45] transition-colors">
                    <Folder className="w-5 h-5" />
                </Link>
            </div>
        </div>
    )
}
