export type TextSearchMatch = {
    text: string;
    matches: boolean;
}

export const findTextSearchMatches = (text: string, searchTerm: string): TextSearchMatch[] => {
    if(searchTerm === "") return [{text, matches: false}];

    const result: TextSearchMatch[] = [];
    let appendIndex = 0;

    for(let i = 0; i < text.length; i++) {
        const currentLetter = text[i].toLocaleLowerCase();
        const firstTermLetter = searchTerm[0].toLocaleLowerCase();
        const nextLetter = text[i + 1]?.toLocaleLowerCase();

        if(result[appendIndex] === undefined) result[appendIndex] = {text: "", matches: false}
        if(currentLetter !== firstTermLetter) result[appendIndex].text += text[i]
        if(currentLetter !== firstTermLetter && nextLetter === firstTermLetter) appendIndex++;

        if(currentLetter === firstTermLetter) {
            let matchCount = 0;
            
            for(let j = 0; j < searchTerm.length; j++) {
                if(i + j > text.length - 1) break;
                const currentLetter = text[i + j].toLowerCase();
                const searchLetter = searchTerm[j].toLowerCase();

                if(currentLetter != searchLetter) break;
                matchCount++;
            }

            if(matchCount === searchTerm.length) {
                result[appendIndex] = {text: text.substring(i, i + matchCount), matches: true};
                i += matchCount - 1;
                appendIndex += 1;
            }else {
                result[appendIndex].text += text.substring(i, i + matchCount); 
                i += matchCount - 1;
            }
        }
    }

    return result;
}
