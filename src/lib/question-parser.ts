/**
 * Parse question content dengan format:
 * "Instruksi\n$$$\n`code dengan //code// markers`"
 *
 * \n$$$\n = separator antara instruksi dan kode
 * //code// = marker untuk posisi input/blank
 */

export interface ParsedQuestion {
    instruction: string
    codeBlocks: CodeBlock[]
}

export interface CodeBlock {
    parts: CodePart[]
}

export interface CodePart {
    type: "text" | "blank"
    content: string
}

/**
 * Parse question content menjadi instruction dan code blocks
 * dengan tracking posisi blank (//code// markers)
 */
export function parseQuestionContent(content: string): ParsedQuestion {
    // Split by \n$$$\n untuk pisahkan instruksi dan kode
    const [instructionRaw, ...codeRaw] = content.split(/\n\$\$\$\n/)

    const instruction = instructionRaw?.trim() || ""
    const codeContent = codeRaw.join("\n$$$\n")

    // Parse code blocks dengan //code// markers
    // Keluarkan backticks jika ada, tapi JANGAN trim leading whitespace
    let cleanedCode = codeContent.replace(/^`\n?|`\n?$/g, "")

    // Trim hanya leading/trailing newlines, bukan spaces
    cleanedCode = cleanedCode.replace(/^\n+|\n+$/g, "")

    // Split code menjadi lines untuk better rendering - PRESERVE indentation
    const lines = cleanedCode.split("\n")

    const codeBlocks: CodeBlock[] = lines.map((line) => {
        const parts: CodePart[] = []
        let currentPos = 0

        // Find all //code// markers dalam line
        const codeMarkerRegex = /\/\/code\/\//g
        let match

        while ((match = codeMarkerRegex.exec(line)) !== null) {
            // Add text sebelum marker (INCLUDING leading spaces)
            if (match.index > currentPos) {
                parts.push({
                    type: "text",
                    content: line.substring(currentPos, match.index),
                })
            }

            // Add blank marker
            parts.push({
                type: "blank",
                content: "",
            })

            currentPos = match.index + match[0].length
        }

        // Add remaining text (INCLUDING trailing spaces)
        if (currentPos < line.length) {
            parts.push({
                type: "text",
                content: line.substring(currentPos),
            })
        }

        // Jika tidak ada marker, keseluruhan line adalah text (PRESERVE leading spaces)
        if (parts.length === 0) {
            parts.push({
                type: "text",
                content: line,
            })
        }

        return { parts }
    })

    return {
        instruction,
        codeBlocks,
    }
}

/**
 * Flatten code blocks menjadi single string untuk display/comparison
 */
export const flattenCodeBlocks = (codeBlocks: CodeBlock[]): string => {
    return codeBlocks
        .map((block) =>
            block.parts
                .map((part) => (part.type === "text" ? part.content : ""))
                .join(""),
        )
        .join("\n")
}

/**
 * Extract blank positions (indices) dari code blocks
 * Berguna untuk tracking urutan answer
 */
export const getBlankPositions = (
    codeBlocks: CodeBlock[],
): { blockIndex: number; partIndex: number }[] => {
    const positions: { blockIndex: number; partIndex: number }[] = []

    codeBlocks.forEach((block, blockIndex) => {
        block.parts.forEach((part, partIndex) => {
            if (part.type === "blank") {
                positions.push({ blockIndex, partIndex })
            }
        })
    })

    return positions
}

/**
 * Get total number of blanks dalam code blocks
 */
export const getBlankCount = (codeBlocks: CodeBlock[]): number => {
    return codeBlocks.reduce((count, block) => {
        return (
            count + block.parts.filter((part) => part.type === "blank").length
        )
    }, 0)
}
