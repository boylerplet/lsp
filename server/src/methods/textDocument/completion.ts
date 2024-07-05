import { RequestMessage } from "../../server";
import { TextDocumentIdentifier, documents } from "../../documents";
import * as fs from 'fs'
import log from "../../log";

// const words = fs.readFileSync('../../words.txt').toString().split('\n')
// const items = words.map((word) => { return { label: word } })

// console.log(items)
const words = ['typescript', 'lua', 'javascript']

type CompletionItem = {
    label: string,
}

interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

interface Position {
    line: number;
    character: number;
}

interface TextDocumentPositionParams {
    textDocument: TextDocumentIdentifier;
    position: Position;
}

export interface CompletionParams extends TextDocumentPositionParams { }

export const completion = (message: RequestMessage): CompletionList | null => {
    const params = message.params as CompletionParams;
    const content = documents.get(params.textDocument.uri)

    if (!content) {
        return null;
    }

    const currentLine = content.split('\n')[params.position.line]
    const lineUntilCursor = currentLine.slice(0, params.position.character)

    const currentPrefix = lineUntilCursor.replace(/.*\W(.*?)/, "$1")

    const items = words.filter(word => {
        return word.startsWith(currentPrefix)
    }).slice(0, 100).map(word => {
        return { label: word }
    })

    return {
        isIncomplete: true,
        items: items,
    }
}