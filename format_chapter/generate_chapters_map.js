const fs = require('fs');

// ========== 配置常量 ==========
const ORIGINAL_PATH = "temp/original_chapters.txt";
const FORMATTED_PATH = "temp/formatted_chapters.txt";
const OUTPUT_PATH = "temp/chapters_map.json";
// =============================

function compareToJson(originalPath, newPath, outputPath) {
    const original = fs.readFileSync(originalPath, 'utf-8').split('\n');
    const newContent = fs.readFileSync(newPath, 'utf-8').split('\n');

    const result = {};

    for (let i = 0; i < original.length; i++) {
        const orig = original[i].trim();
        const newLine = i < newContent.length ? newContent[i].trim() : '';

        if (orig !== newLine) {
            result[orig] = newLine;
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`JSON对比文件已生成: ${outputPath}`);
    console.log(`共 ${Object.keys(result).length} 处变化`);
}

compareToJson(ORIGINAL_PATH, FORMATTED_PATH, OUTPUT_PATH);
