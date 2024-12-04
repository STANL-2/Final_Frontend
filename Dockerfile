# Node.js 이미지 사용
FROM node:16

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Vite 개발 서버 실행
CMD ["npm", "run", "dev"]

# Vite 개발 서버 포트
EXPOSE 5173
