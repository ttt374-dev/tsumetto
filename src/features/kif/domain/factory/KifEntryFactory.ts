import type { KifData, KifEntry } from '../../types'
import { v4 } from 'uuid'
import { parseKif } from '../parser'
import { createKifData } from './KifDataFactory';
import { Title } from '@mui/icons-material';

export function splitFilename(filename: string): { basename: string, ext: string } {
    let basename = filename;
    let ext = "";
    const dotIndex = filename.lastIndexOf(".");
    if (dotIndex >= 0) {
        basename = filename.slice(0, dotIndex);
        ext = filename.slice(dotIndex);
    }
    return { basename, ext }
}

export function validateTitle(title: string, entries: KifEntry[]): boolean {
    const existingTitles = new Set(entries.map(e => e.title));
    return existingTitles.has(title)
}

export function resolveUniqTitle(filename: string, existingEntries: KifEntry[]): string {
    // ファイル名と拡張子を分離
    const { basename, ext } = splitFilename(filename)
    const title = basename + ext

    let newTitle = basename + ext;
    let counter = 1;
    const existingTitles = new Set([...existingEntries].map(e => e.title));
    while (existingTitles.has(title)) {
        newTitle = `${basename}(${counter})${ext}`;
        counter++;
    }    
    return newTitle
}
export function createKifEntryFromText(text: string, title?: string): KifEntry | null {
    const kifDataResult = parseKif(text);
    if (kifDataResult.ok === false) return null
    return createKifEntry({
        title: title,
        kifData: kifDataResult.value,
    }
    )
}

export function createKifEntry( partial?: Partial<KifEntry>): KifEntry {
  return {
    id: v4(),
    title: 'untitled',
    kifData: createKifData(),
    createdAt: Date.now(),
    ...partial,
  };
}
