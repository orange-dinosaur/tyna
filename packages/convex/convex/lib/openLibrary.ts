/**
 * Open Library API client for ISBN-based work lookups.
 * Used by the enrichment processor to resolve Open Library work IDs.
 */

export interface OpenLibraryWorkResult {
    workId: string; // e.g., "/works/OL45883W"
}

/**
 * Parse an Open Library ISBN response to extract the work ID.
 * Exported for testability (Property 24).
 *
 * @param data - The parsed JSON response from the Open Library ISBN endpoint
 * @returns The work result with the extracted work ID, or null if no works array is present
 */
export function parseOpenLibraryResponse(
    data: Record<string, unknown>
): OpenLibraryWorkResult | null {
    const works = data.works as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(works) || works.length === 0) {
        return null;
    }

    const key = works[0]?.key;
    if (typeof key !== 'string') {
        return null;
    }

    return { workId: key };
}

/**
 * Look up a work by ISBN via the Open Library API.
 *
 * - Returns the Open Library work ID on success.
 * - Returns `null` if the ISBN is not found (404).
 * - Throws on network or server errors so the enrichment processor can retry.
 */
export async function lookupByIsbn(
    isbn: string
): Promise<OpenLibraryWorkResult | null> {
    const url = `${process.env.OPEN_LIBRARY_BASE_URL}/isbn/${encodeURIComponent(isbn)}.json`;

    const response = await fetch(url);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Open Library API error: ${response.status} ${response.statusText}`
        );
    }

    const data = (await response.json()) as Record<string, unknown>;
    return parseOpenLibraryResponse(data);
}
