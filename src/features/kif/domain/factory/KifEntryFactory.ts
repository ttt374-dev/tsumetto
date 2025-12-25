import type { KifData, KifEntry } from '../../types'
import { v4 } from 'uuid'
import { parseKif } from '../parser'
import { createKifData } from './createKifData';

// TODO: move to utils/
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

export function isDuplicatedTitle(title: string, entries: KifEntry[]): boolean {
    const existingTitles = new Set(entries.map(e => e.title));
    return existingTitles.has(title)
}
export async function createKifEntryFromText(text: string, filename: string, entries: KifEntry[], extraEntries: KifEntry[]): Promise<KifEntry> {
    const kifData = parseKif(text);
    // ファイル名と拡張子を分離
    const { basename, ext } = splitFilename(filename)
    const title = basename + ext


    // 重複チェック（既存＋追加分）
    let newTitle = basename + ext;
    let counter = 1;
    const existingTitles = new Set([...entries, ...extraEntries].map(e => e.title));
    while (existingTitles.has(title)) {
        newTitle = `${basename}(${counter})${ext}`;
        counter++;
    }
    

    const entry: KifEntry = {
        id: v4(),
        title: newTitle,
        kifData: kifData,
        createdAt: Date.now(),
    };
    return entry
}

//////////////////
// 初期化関数
