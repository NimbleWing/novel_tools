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

function formatChapterFile(inputPath, outputPath) {
    const content = fs.readFileSync(inputPath, 'utf-8');
    const lines = content.split('\n');
    const output = [];

    for (const line of lines) {
        if (!line.trim()) {
            output.push(line);
            continue;
        }

        const match = line.match(/【([^】]+)】/);
        if (match && match[1].includes('第') && match[1].includes('章')) {
            const title = match[1];
            const numMatch = title.match(/第(.+?)章/);

            if (numMatch) {
                const chapterNum = cn2num(numMatch[1]);
                const content = title.replace(/第.+?章[、：：\s]*/, '').trim('、： ');
                const newTitle = `第${String(chapterNum).padStart(5, '0')}章 ${content}`;
                output.push(`【${newTitle}】`);
            } else {
                output.push(line);
            }
        } else if (match) {
            output.push(match[1]);
        } else {
            output.push(line);
        }
    }

    fs.writeFileSync(outputPath, output.join('\n'), 'utf-8');
    console.log(`完成！已保存到 ${outputPath}`);
}

formatChapterFile(INPUT_PATH, OUTPUT_PATH);
