const fs = require('fs');

// ========== 配置常量 ==========
const DIFF_PATH = "temp/diff_chapters.txt";
const FORMATTED_PATH = "temp/formatted_chapters.txt";
// =============================

function parseDiff(diffPath) {
    const content = fs.readFileSync(diffPath, 'utf-8');
    const lines = content.split('\n');
    const changes = [];

    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();

        // 匹配 "--- 第00001行 ---" 格式
        const lineMatch = line.match(/^--- 第(\d+)行 ---$/);
        if (lineMatch) {
            const lineNum = parseInt(lineMatch[1], 10) - 1; // 转为0索引

            // 向下查找 "新: xxx"
            let j = i + 1;
            while (j < lines.length) {
                const nextLine = lines[j].trim();
                if (nextLine.startsWith('新: ')) {
                    const newValue = nextLine.substring(3); // 去掉 "新: "
                    changes.push({ lineNum, newValue });
                    break;
                }
                j++;
            }
            i = j;
        } else {
            i++;
        }
    }

    return changes;
}

function applyFix(formattedPath, changes) {
    if (!fs.existsSync(formattedPath)) {
        console.log(`错误: 找不到文件 ${formattedPath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(formattedPath, 'utf-8');
    const lines = content.split('\n');

    let appliedCount = 0;
    for (const change of changes) {
        if (change.lineNum >= 0 && change.lineNum < lines.length) {
            const oldValue = lines[change.lineNum];
            lines[change.lineNum] = change.newValue;
            console.log(`第 ${change.lineNum + 1} 行: 已修正`);
            console.log(`  旧: ${oldValue}`);
            console.log(`  新: ${change.newValue}`);
            appliedCount++;
        }
    }

    fs.writeFileSync(formattedPath, lines.join('\n'), 'utf-8');
    return appliedCount;
}

function main() {
    console.log('读取 diff 文件...');
    const changes = parseDiff(DIFF_PATH);
    console.log(`共 ${changes.length} 处修改\n`);

    if (changes.length === 0) {
        console.log('没有发现修改，跳过');
        return;
    }

    console.log('应用修正...');
    const appliedCount = applyFix(FORMATTED_PATH, changes);

    console.log(`\n完成！共修正 ${appliedCount} 行`);
    console.log(`已更新: ${FORMATTED_PATH}`);
}

main();
