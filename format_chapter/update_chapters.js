const fs = require('fs');

// ========== 配置常量 ==========
const INPUT_PATH = "temp/original_novel.txt";
const MAP_PATH = "temp/chapters_map.json";
const OUTPUT_PATH = "temp/updated_novel.txt";
// =============================

function applyComparison(inputPath, comparisonPath, outputPath) {
    const lines = fs.readFileSync(inputPath, 'utf-8').split('\n');
    const comparison = JSON.parse(fs.readFileSync(comparisonPath, 'utf-8'));

    const output = lines.map(line => {
        const trimmed = line.trim();
        return comparison[trimmed] !== undefined ? comparison[trimmed] : line;
    });

    fs.writeFileSync(outputPath, output.join('\n'), 'utf-8');
    console.log(`已完成！已保存到 ${outputPath}`);
}

applyComparison(INPUT_PATH, MAP_PATH, OUTPUT_PATH);
