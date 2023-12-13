#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const [fileListPath] = process.argv.slice(2);

if (!fileListPath) {
  console.log(
    '사용 방법:\n\n' +
    '1. 변경을 시작한 커밋 해시를 확보합니다.\n' +
    '2. 다음 명령어로 변경된 파일 목록을 sample.txt에 저장합니다:\n' +
    '   git diff --name-only {시작커밋해시} HEAD > sample.txt\n' +
    '3. "diffout sample.txt"를 실행하여 변경된 파일을 추출합니다.\n' +
    '4. "output" 폴더에서 추출된 파일을 확인합니다.'
  );
  process.exit();
}

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