const fs = require('fs');

const INPUT_PATH = "temp/updated_novel.txt";
const OUTPUT_PATH = "temp/final_novel.txt";

const PATTERNS_TO_REMOVE = [
    "aabook_readfile",
];

function removeMeaninglessLines(inputPath, outputPath) {
    const content = fs.readFileSync(inputPath, 'utf-8');
    const lines = content.split('\n');
    const output = [];

    let removedCount = 0;

    for (const line of lines) {
        const trimmed = line.trim();
        if (PATTERNS_TO_REMOVE.includes(trimmed)) {
            removedCount++;
            continue;
        }
        output.push(line);
    }

    fs.writeFileSync(outputPath, output.join('\n'), 'utf-8');
    console.log(`已完成！已保存到 ${outputPath}`);
    console.log(`共删除 ${removedCount} 行无意义内容`);
}

removeMeaninglessLines(INPUT_PATH, OUTPUT_PATH);
