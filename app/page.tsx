import { GlobalNav } from "@/components/GlobalNav"
import { DashboardHeader } from "@/components/DashboardHeader"
import { CourseCard } from "@/components/CourseCard"
import { RightSidebar } from "@/components/RightSidebar"
import { InteractiveBackground } from "@/components/ui/InteractiveBackground"

const courses = [
    {
        title: "CPSC 310: Game Development",
        code: "CPSC 310",
        term: "Fall 2024",
        color: "#8B5CF6", // Violet
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop",
        href: "/ubc-survival"
    }
]

export default function Home() {
    return (
        <div className="flex min-h-screen bg-[#F5F5F5] relative">
            <InteractiveBackground />
            <GlobalNav />

            <div className="flex-1 ml-[84px] flex">
                <main className="flex-1 p-6 md:p-8">
                    <DashboardHeader />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {courses.map((course, index) => (
                            <CourseCard
                                key={index}
                                {...course}
                            />
                        ))}
                    </div>
                </main>

                <RightSidebar />
            </div>
        </div>
    )
}
