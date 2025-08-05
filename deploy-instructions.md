# React Zen Editor 배포 가이드

## 1. NPM 로그인 확인
```bash
npm whoami
```

## 2. 패키지명 중복 확인 (선택사항)
```bash
npm view react-zen-editor
```
만약 이미 존재한다면 package.json에서 이름을 변경해주세요.

## 3. 최종 빌드
```bash
npm run build
```

## 4. 배포 실행
```bash
npm publish
```

## 5. 배포 확인
https://www.npmjs.com/package/react-zen-editor 에서 확인

## 패키지 설치 테스트
```bash
npm install react-zen-editor
```

## 버전 업데이트 시
```bash
# 패치 버전 (1.0.0 → 1.0.1)
npm version patch

# 마이너 버전 (1.0.0 → 1.1.0)  
npm version minor

# 메이저 버전 (1.0.0 → 2.0.0)
npm version major

# 업데이트 후 재배포
npm publish
```