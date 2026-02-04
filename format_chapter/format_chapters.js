const fs = require('fs');

// ========== 配置常量 ==========
const INPUT_PATH = "temp/original_chapters.txt";
const OUTPUT_PATH = "temp/formatted_chapters.txt";
// =============================

function cn2num(cn) {
    if (/^\d+$/.test(cn)) {
        return parseInt(cn, 10);
    }

    const mapping = {
        '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
        '五': 5, '六': 6, '七': 7, '八': 8, '九': 9
    };
    const unitValue = { '十': 10, '百': 100 };

    let result = 0;
    let current = 0;
    let i = 0;

    while (i < cn.length) {
        const char = cn[i];
        if (mapping[char] !== undefined) {
            current = mapping[char];
        } else if (unitValue[char] !== undefined) {
            const unit = unitValue[char];
            if (current === 0) {
                current = unit;
            } else {
                current = current * unit;
            }
            result += current;
            current = 0;
        }
        i++;
    }

    return result + current;
}

function extractChapterNum(title) {
    const match = title.match(/第(.+?)章/);
    if (match) {
        return cn2num(match[1]);
    }
    return null;
}

function extractChapterContent(title) {
    const content = title.replace(/第.+?章[、：：\s]*/, '').trim('、： ');
    return content;
}

function formatChapterFile(inputPath, outputPath) {
    const content = fs.readFileSync(inputPath, 'utf-8');
    const lines = content.split('\n');
    const output = [];

    let currentPart = 0;
    let lastChapterNum = 0;

    for (const line of lines) {
        if (!line.trim()) {
            output.push(line);
            continue;
        }

        const match = line.match(/【([^】]+)】/);
        if (!match) {
            output.push(line);
            continue;
        }

        const title = match[1];

        if (!title.includes('第') || !title.includes('章')) {
            output.push(title);
            continue;
        }

        const chapterNum = extractChapterNum(title);
        if (chapterNum === null) {
            output.push(line);
            continue;
        }

        if (chapterNum === 1 || chapterNum < lastChapterNum) {
            currentPart++;
        }
        lastChapterNum = chapterNum;

        const chapterContent = extractChapterContent(title);
        const partStr = String(currentPart).padStart(2, '0');
        const chapterStr = String(chapterNum).padStart(4, '0');
        const newTitle = `第${partStr}${chapterStr}章 ${chapterContent}`;

        output.push(`【${newTitle}】`);
    }

    fs.writeFileSync(outputPath, output.join('\n'), 'utf-8');
    console.log(`完成！已保存到 ${outputPath}`);
}

formatChapterFile(INPUT_PATH, OUTPUT_PATH);
