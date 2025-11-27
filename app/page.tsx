import { GlobalNav } from "@/components/GlobalNav"
import { DashboardHeader } from "@/components/DashboardHeader"
import { CourseCard } from "@/components/CourseCard"
import { RightSidebar } from "@/components/RightSidebar"

const courses = [
  {
    title: "CS 101: Introduction to Computer Science",
    code: "CS 101",
    term: "Fall 2024",
    color: "#4A90E2", // Blue
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "MATH 101: Calculus I",
    code: "MATH 101",
    term: "Fall 2024",
    color: "#E24A4A", // Red
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "HIST 202: World History",
    code: "HIST 202",
    term: "Fall 2024",
    color: "#F5A623", // Orange
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "CHEM 101: General Chemistry",
    code: "CHEM 101",
    term: "Fall 2024",
    color: "#7ED321", // Green
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "ENG 101: English Composition",
    code: "ENG 101",
    term: "Fall 2024",
    color: "#9013FE", // Purple
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "ART 101: Art History",
    code: "ART 101",
    term: "Fall 2024",
    color: "#50E3C2", // Teal
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop"
  }
]

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
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
