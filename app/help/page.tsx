import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F5] p-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-[#2D3B45] hover:text-[#4a5c6a] transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-[#2D3B45] mb-6">Help & Documentation</h1>

                <div className="space-y-8 text-[#4a5c6a]">
                    <section>
                        <h2 className="text-xl font-semibold text-[#2D3B45] mb-3">Dashboard</h2>
                        <p className="leading-relaxed">
                            The dashboard is your central hub. Here you can see all your enrolled courses.
                            Click on a course card to access its specific content. The "CPSC 310: Game Development"
                            course features the "UBC Survival" game.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#2D3B45] mb-3">Calendar</h2>
                        <p className="leading-relaxed">
                            Use the calendar to track your assignments, exams, and events.
                            You can add new events by clicking on a date. Watch out for exam days—they might get a bit chaotic!
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#2D3B45] mb-3">UBC Survival Game</h2>
                        <p className="leading-relaxed">
                            Experience the life of a CPSC 310 student. Manage your stats:
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                            <li><strong>Survival:</strong> Keep this above 0 to stay in the game.</li>
                            <li><strong>Serotonin:</strong> Affects your mental state and event outcomes.</li>
                            <li><strong>Chaos:</strong> Higher chaos leads to more unpredictable events.</li>
                        </ul>
                        <p className="mt-2 leading-relaxed">
                            Make choices in events to progress through the semester. Good luck!
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-[#2D3B45] mb-3">Navigation</h2>
                        <p className="leading-relaxed">
                            Use the sidebar on the left to navigate between the Dashboard, Calendar, and other sections.
                            The "Back to Dashboard" button will always take you home.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
