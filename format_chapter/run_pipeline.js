const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

// ========== 脚本列表 ==========
const SCRIPTS = {
    prepare: 'node prepare_novel.js',
    extract: 'node extract_chapters.js',
    format: 'node format_chapters.js',
    compare: 'node compare_chapters.js',
    generateMap: 'node generate_chapters_map.js',
    update: 'node update_chapters.js'
};
// =============================

function runScript(name, command) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  执行: ${name}`);
    console.log('='.repeat(60));
    console.log(`命令: ${command}\n`);

    try {
        execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
        return true;
    } catch (error) {
        console.log(`\n错误: ${name} 执行失败`);
        return false;
    }
}

function showManualStep() {
    console.log('\n' + '='.repeat(60));
    console.log('  ⚠️  手动介入步骤');
    console.log('='.repeat(60));
    console.log('');
    console.log('请按以下步骤操作:');
    console.log('');
    console.log('1. 打开 temp/diff_chapters.txt');
    console.log('2. 检查格式化后的章节标题是否有问题');
    console.log('3. 如果有问题，修改该行中 "新:" 后面的值');
    console.log('4. 保存文件');
    console.log('5. 运行: node fix_chapters.js');
    console.log('');
    console.log('完成后请回到此处进行选择。');
    console.log('');
}

async function askUser() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('\n请选择:\n  1. 手动介入完成 (直接回车)\n  2. 手动介入未完成\n\n请输入 (直接回车选择1): ', (answer) => {
            rl.close();
            // 默认值为1
            resolve(answer.trim() === '2' ? '2' : '1');
        });
    });
}

async function main() {
    console.log('\n' + '='.repeat(60));
    console.log('  章节格式化 pipeline');
    console.log('='.repeat(60));
    console.log('');

    // 步骤 1-4: 自动执行
    const steps = [
        { name: '准备原始小说', command: SCRIPTS.prepare, desc: '将当前目录的 txt 复制到 temp/original_novel.txt' },
        { name: '提取章节', command: SCRIPTS.extract, desc: '提取章节标题到 temp/original_chapters.txt' },
        { name: '格式化章节', command: SCRIPTS.format, desc: '格式化章节标题到 temp/formatted_chapters.txt' },
        { name: '生成对比文件', command: SCRIPTS.compare, desc: '生成差异报告 temp/diff_chapters.txt' }
    ];

    for (const step of steps) {
        console.log(`\n[步骤] ${step.name}`);
        console.log(`[说明] ${step.desc}`);

        if (!runScript(step.name, step.command)) {
            console.log('\nPipeline 已终止');
            process.exit(1);
        }
    }

    // 显示手动介入说明
    showManualStep();

    // 等待用户选择
    const answer = await askUser();

    if (answer === '1') {
        console.log('\n继续执行后续步骤...\n');

        // 步骤 5-6: 继续执行
        const finalSteps = [
            { name: '生成章节映射', command: SCRIPTS.generateMap, desc: '生成 JSON 映射 temp/chapters_map.json' },
            { name: '更新原始小说', command: SCRIPTS.update, desc: '根据映射更新小说 temp/updated_novel.txt' }
        ];

        for (const step of finalSteps) {
            console.log(`\n[步骤] ${step.name}`);
            console.log(`[说明] ${step.desc}`);

            if (!runScript(step.name, step.command)) {
                console.log('\nPipeline 已终止');
                process.exit(1);
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('  ✅ Pipeline 执行完成！');
        console.log('='.repeat(60));
        console.log('');
        console.log('生成的文件:');
        console.log('  - temp/original_novel.txt    (原始小说)');
        console.log('  - temp/original_chapters.txt (提取的章节)');
        console.log('  - temp/formatted_chapters.txt (格式化后的章节)');
        console.log('  - temp/diff_chapters.txt     (差异报告)');
        console.log('  - temp/chapters_map.json    (章节映射)');
        console.log('  - temp/updated_novel.txt    (更新后的小说)');
        console.log('');
    } else {
        console.log('\n已退出 Pipeline');
        console.log('你可以稍后重新运行此脚本继续执行。');
        process.exit(0);
    }
}

main();
