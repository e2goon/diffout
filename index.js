#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const [fileListPath] = process.argv.slice(2);
const newFolder = path.join(process.cwd(), 'output', fileListPath);
const filesToCopy = fs.readFileSync(fileListPath, "utf8").split("\n");

filesToCopy.forEach(file => {
  const trimmedFile = file.trim();

  if (!trimmedFile) return;

  const sourcePath = path.join(process.cwd(), trimmedFile);
  const destPath = path.join(newFolder, trimmedFile);

  try {
    // 파일 존재 여부 확인
    if (!fs.existsSync(sourcePath)) {
      console.warn(`원본 파일이 존재하지 않습니다: ${sourcePath}`);
      return;
    }

    // 동일한 파일이 대상 경로에 존재하는지 확인
    if (fs.existsSync(destPath)) {
      console.warn(`대상 경로에 동일한 파일이 이미 존재합니다: ${destPath}`);
      return;
    }

    // 상위 폴더 생성
    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    // 파일 복사
    fs.copyFileSync(sourcePath, destPath);
    console.log(`파일 복사 성공: ${sourcePath} > ${destPath}`);
  } catch(err) {
    console.error(`파일 복사 중 오류 발생: ${err}`);
  }
});