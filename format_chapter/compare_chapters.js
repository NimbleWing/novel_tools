const fs = require('fs');

// ========== 配置常量 ==========
const ORIGINAL_PATH = "temp/original_chapters.txt";
const FORMATTED_PATH = "temp/formatted_chapters.txt";
const OUTPUT_PATH = "temp/diff_chapters.txt";
// =============================

function compareFiles(originalPath, newPath, outputPath) {
    const original = fs.readFileSync(originalPath, 'utf-8').split('\n');
    const newContent = fs.readFileSync(newPath, 'utf-8').split('\n');

    const maxLines = Math.max(original.length, newContent.length);
    const output = [];
    let changedCount = 0;

    output.push('='.repeat(80));
    output.push('章节标题格式统一 - 对比文件');
    output.push('='.repeat(80));
    output.push('');
    output.push(`原文件: ${originalPath} (${original.length} 行)`);
    output.push(`新文件: ${newPath} (${newContent.length} 行)`);
    output.push('统一格式: 【第XXXXX章 标题】 (数字补零到5位)');
    output.push('='.repeat(80));
    output.push('');

    for (let i = 0; i < maxLines; i++) {
        const orig = i < original.length ? original[i].trim() : '(无)';
        const newLine = i < newContent.length ? newContent[i].trim() : '(无)';

        if (orig !== newLine) {
            changedCount++;
            output.push(`--- 第${String(i + 1).padStart(5, '0')}行 ---`);
            output.push(`原: ${orig}`);
            output.push(`新: ${newLine}`);
            output.push('');
        }
    }

    output.push('='.repeat(80));
    output.push(`统计: 总行数=${maxLines}, 有变化的行数=${changedCount}`);

    fs.writeFileSync(outputPath, output.join('\n'), 'utf-8');
    console.log(`对比文件已生成: ${outputPath} (共${changedCount}处变化)`);
}

compareFiles(ORIGINAL_PATH, FORMATTED_PATH, OUTPUT_PATH);
