/**
 * Work matcher utilities for normalizing book metadata and generating
 * local work hashes to group editions of the same intellectual work.
 */

/**
 * Normalizes a string for matching by:
 * 1. Converting to lowercase
 * 2. Removing all non-alphanumeric non-space characters
 * 3. Collapsing multiple spaces to a single space
 * 4. Stripping leading articles ("the", "a", "an")
 * 5. Trimming whitespace
 */
export function normalizeForMatching(str: string): string {
    let result = str.toLowerCase();
    result = result.replace(/[^a-z0-9 ]/g, '');
    result = result.replace(/ +/g, ' ');
    result = result.trim();
    result = result.replace(/^(the|an|a) /, '');
    return result.trim();
}

/**
 * Generates a 16-character hex hash from a normalized title and primary author.
 * Used to group editions of the same work without external work IDs.
 *
 * The hash is the first 16 hex characters of SHA-256(normalizedTitle + "|" + normalizedAuthor).
 */
export async function generateLocalWorkHash(
    title: string,
    primaryAuthor: string
): Promise<string> {
    const normalizedTitle = normalizeForMatching(title);
    const normalizedAuthor = normalizeForMatching(primaryAuthor);
    const input = `${normalizedTitle}|${normalizedAuthor}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = new Uint8Array(hashBuffer);
    const hexString = Array.from(hashArray)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return hexString.substring(0, 16);
}
