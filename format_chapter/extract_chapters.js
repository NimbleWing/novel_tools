const fs = require('fs');
const path = require('path');

// ========== 配置常量 ==========
const PATTERN = "【第.*章";
const INPUT_PATH = "temp/original_novel.txt";
const OUTPUT_PATH = "temp/original_chapters.txt";
// =============================

function extractChapters() {
    if (!fs.existsSync(INPUT_PATH)) {
        console.log(`错误: 找不到输入文件 ${INPUT_PATH}`);
        process.exit(1);
    }

    const content = fs.readFileSync(INPUT_PATH, 'utf-8');
    const lines = content.split('\n');
    const regex = new RegExp(PATTERN);

    const results = [];
    for (const line of lines) {
        if (regex.test(line)) {
            results.push(line.trim());
        }
    }

    fs.writeFileSync(OUTPUT_PATH, results.join('\n'), 'utf-8');
    console.log(`提取完成: ${INPUT_PATH} → ${OUTPUT_PATH}`);
    console.log(`共提取 ${results.length} 行`);
}

extractChapters();
