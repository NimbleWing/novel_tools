const fs = require('fs');
const path = require('path');

const TEMP_DIR = 'temp';
const OUTPUT_NAME = 'original_novel.txt';

function main() {
    // 1. 检查并创建 temp 文件夹
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
        console.log(`创建文件夹: ${TEMP_DIR}`);
    }

    // 2. 查找当前目录下的所有 txt 文件
    const files = fs.readdirSync('.');
    const txtFiles = files.filter(f => f.endsWith('.txt') && f !== OUTPUT_NAME);

    // 3. 如果有多个 txt 文件，报错
    if (txtFiles.length === 0) {
        console.log('错误: 当前目录下没有找到 txt 文件');
        process.exit(1);
    }

    if (txtFiles.length > 1) {
        console.log('错误: 当前目录下有多个 txt 文件，请只保留一个');
        console.log('找到的文件:');
        txtFiles.forEach(f => console.log(`  - ${f}`));
        process.exit(1);
    }

    // 4. 获取唯一的 txt 文件
    const sourceFile = txtFiles[0];
    const destPath = path.join(TEMP_DIR, OUTPUT_NAME);

    // 5. 复制文件
    fs.copyFileSync(sourceFile, destPath);
    console.log(`完成: ${sourceFile} → ${destPath}`);
}

main();
