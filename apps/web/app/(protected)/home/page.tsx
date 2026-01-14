import { WelcomeHeader } from '@/components/home/welcome-header';
import { CurrentlyReading } from '@/components/home/currently-reading';
import { ReadingStats } from '@/components/home/reading-stats';
import { BookTabs } from '@/components/home/book-tabs';
import { DailyGoal } from '@/components/home/daily-goal';
import { ForYou } from '@/components/home/for-you';

export default function Home() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 lg:flex-row lg:gap-8 lg:p-6">
            {/* Main Content */}
            <div className="min-w-0 flex-1">
                <WelcomeHeader streakDays={5} />
                <CurrentlyReading />
                <BookTabs />
            </div>

            {/* Sidebar Widgets */}
            <div className="w-full space-y-6 lg:w-72 lg:shrink-0">
                <ReadingStats />
                <DailyGoal />
                <ForYou />
            </div>
        </div>
    );
}
