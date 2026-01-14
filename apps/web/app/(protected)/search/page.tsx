import { SearchHeader } from '@/components/search/search-header';
import { SearchBar } from '@/components/search/search-bar';
import { TrendingTags } from '@/components/search/trending-tags';
import { TopPicks } from '@/components/search/top-picks';
import { BrowseGenre } from '@/components/search/browse-genre';

export default function SearchPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
            <SearchHeader />
            <SearchBar />
            <TrendingTags />
            <TopPicks />
            <BrowseGenre />
        </div>
    );
}
