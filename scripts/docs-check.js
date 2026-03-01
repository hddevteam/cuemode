#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function readFileSafe(relPath) {
    const absPath = path.join(repoRoot, relPath);
    if (!fs.existsSync(absPath)) {
        return null;
    }
    return fs.readFileSync(absPath, 'utf8');
}

function fileExists(relPath) {
    return fs.existsSync(path.join(repoRoot, relPath));
}

const errors = [];
const warnings = [];

// Required docs
const requiredFiles = ['DEVELOPMENT.md', 'project_docs/0-development.zh-CN.md'];
for (const file of requiredFiles) {
    if (!fileExists(file)) {
        errors.push(`Missing required document: ${file}`);
    }
}

// Deprecated docs that must not exist
const forbiddenFiles = [
    'DEVELOPMENT.zh-CN.md',
];
for (const file of forbiddenFiles) {
    if (fileExists(file)) {
        errors.push(`Deprecated document still exists: ${file}`);
    }
}

// Forbidden references (to removed legacy docs)
const scanTargets = [
    'README.md',
    'README.zh-CN.md',
    'CONTRIBUTING.md',
    'CONTRIBUTING.zh-CN.md',
    'DEVELOPMENT.md',
    'project_docs/0-development.zh-CN.md',
    'project_docs/README.md',
];

for (const relPath of scanTargets) {
    const content = readFileSafe(relPath);
    if (content === null) {
        warnings.push(`Skipped missing file in scan list: ${relPath}`);
        continue;
    }

    if (content.includes('DEVELOPMENT.zh-CN.md')) {
        errors.push(`Legacy link detected in ${relPath}: DEVELOPMENT.zh-CN.md`);
    }

}

// Sync marker checks
const enDoc = readFileSafe('DEVELOPMENT.md');
const zhDoc = readFileSafe('project_docs/0-development.zh-CN.md');

if (enDoc) {
    if (!enDoc.includes('Sync note:')) {
        errors.push('Missing sync marker in DEVELOPMENT.md ("Sync note:")');
    }
    if (!enDoc.includes('Last synchronized:')) {
        errors.push('Missing synchronization date in DEVELOPMENT.md ("Last synchronized:")');
    }
}

if (zhDoc) {
    if (!zhDoc.includes('同步说明：')) {
        errors.push('Missing sync marker in project_docs/0-development.zh-CN.md ("同步说明：")');
    }
    if (!zhDoc.includes('最后同步时间：')) {
        errors.push('Missing synchronization date in project_docs/0-development.zh-CN.md ("最后同步时间：")');
    }
}

if (warnings.length > 0) {
    console.log('⚠️  Docs check warnings:');
    for (const warning of warnings) {
        console.log(`  - ${warning}`);
    }
    console.log('');
}

if (errors.length > 0) {
    console.error('❌ Documentation checks failed:');
    for (const error of errors) {
        console.error(`  - ${error}`);
    }
    process.exit(1);
}

console.log('✅ Documentation checks passed.');
