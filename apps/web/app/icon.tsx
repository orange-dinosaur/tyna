import { readFile } from 'fs/promises';
import { join } from 'path';

export const size = {
    width: 32,
    height: 32,
};

export const contentType = 'image/x-icon';

export default async function Icon() {
    // Read the favicon from the packages directory
    const faviconPath = join(
        process.cwd(),
        '..',
        '..',
        'packages',
        'assets',
        'src',
        'icons',
        'favicon.ico'
    );

    const faviconBuffer = await readFile(faviconPath);

    return new Response(new Uint8Array(faviconBuffer), {
        headers: {
            'Content-Type': 'image/x-icon',
        },
    });
}
