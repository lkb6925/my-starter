# MCP 설정 가이드

이 문서는 Portable Codex Starter에 외부 문서/시스템 연결을 붙일 때 보는 운영 문서다.

실사용 핵심만 말하면:

1. 기본 설치 후 `.codex/config.toml`을 유지한다.
2. OpenAI Docs와 Context7은 이미 기본으로 들어가 있다고 생각하면 된다.
3. `.codex/mcp-servers.example.toml`에서 필요한 선택형 MCP만 추가한다.
4. 실제 명령과 인자는 각 MCP 서버의 공식 문서를 보고 채운다.

## 기본 원칙

- MCP는 많이 붙일수록 좋은 게 아니다.
- 항상 "실제로 자주 쓰는 것"만 켠다.
- 기본 추천은 문서형 2개 + 작업 특화형 1개 정도다.
- 운영 부담이 큰 MCP는 주석 상태로 두고 필요할 때만 켠다.
- GitHub 작업은 별도 GitHub MCP보다 GitHub plugin/connector를 우선한다.

## 라우팅 규칙

- 먼저 로컬 코드와 테스트를 본다.
- MCP는 한 번에 하나를 기본으로 쓴다.
- 첫 번째 MCP로 부족할 때만 두 번째 MCP를 붙여 검증한다.

### 기본 역할 분담

- `openaiDeveloperDocs`: OpenAI 전용 문서
- `context7`: 일반 프레임워크/라이브러리 문서
- `OpenAPI`: API 계약
- `Postgres MCP`: 실제 DB 스키마
- `chrome_devtools`: 브라우저 런타임 검증

### 기본 라우팅

- OpenAI 기능 작업 -> `openaiDeveloperDocs`
- 일반 앱/프레임워크 작업 -> `context7`
- API 요청/응답/인증/경로 질문 -> `OpenAPI`
- 테이블/컬럼/제약/마이그레이션 영향 질문 -> `Postgres MCP`
- 브라우저 콘솔/네트워크/DOM/수화(hydration) 문제 -> `chrome_devtools`

### 조합 규칙

- OpenAI 기능 작업: `openaiDeveloperDocs` -> 프레임워크 결합이 필요할 때만 `context7`
- 일반 기능 작업: `context7` -> API 연동이 있을 때만 `OpenAPI`
- API 버그: `OpenAPI` -> 런타임 불일치 확인이 필요할 때만 `chrome_devtools`
- DB 작업: `Postgres MCP`
- 프론트 런타임 버그: `chrome_devtools` -> 요청/응답 불일치가 의심될 때만 `OpenAPI`

### 하지 말아야 할 것

- `openaiDeveloperDocs`로 충분한데 `context7`를 같이 켜기
- 문서형 MCP로 실제 런타임 동작을 추정하기
- 문서형 MCP로 실제 DB 스키마를 추정하기
- `chrome_devtools`를 문서 검색용으로 쓰기
- `OpenAPI`가 있는데 `Postgres MCP`로 API 계약을 추정하기

### Postgres MCP 안전 규칙

- 기본은 read-only 스키마 점검이다.
- 허용: 테이블, 컬럼, 타입, nullability, 인덱스, 제약, FK, enum, 마이그레이션 영향 확인
- 금지 기본값: `INSERT`, `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`, `ALTER`, 기타 파괴적 SQL
- 가능하면 production보다 dev/staging을 우선한다.
- row inspection보다 schema inspection을 우선한다.
- 코드와 실제 스키마가 다르면 불일치를 명시적으로 보고한다.
- 스키마 변경이 필요하면 `Postgres MCP`로 확인만 하고, 실제 변경은 repo 안의 migration 파일 생성으로 처리한다.
- production이면 직접 변경은 무조건 거부한다.

## 안전한 DB 작업 워크플로우

### 1. 읽기 전용 스키마 확인

- `Postgres MCP`로 현재 테이블/컬럼/제약 상태 확인
- 코드가 가정하는 스키마와 실제 스키마 비교
- 불일치가 있으면 먼저 그 차이를 명시

### 2. migration 생성

- 필요한 변경점을 정리
- repo 안에서 migration 파일 또는 migration 코드 생성
- 필요한 repository/model/query 코드 수정
- migration은 생성만 하고 `Postgres MCP`로 직접 적용하지 않음

### 3. production 규칙

- production 연결이면 `Postgres MCP`는 읽기 전용 참고 도구로만 사용
- production 대상 write/DDL은 기본 거부
- production 작업이 필요해도 여기서는 migration 생성과 검증까지만 수행

## 추천 우선순위

### 1. OpenAI 개발자 문서

가장 안전한 기본값이다.

이미 기본 설정에 들어 있다:

```toml
[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"
```

용도:

- OpenAI API 사용법 확인
- 모델 선택
- 최신 파라미터/기능 확인

### 2. Context7

용도:

- 최신 라이브러리 문서 검색
- 프레임워크 사용법 확인
- 가입 후 API 키를 넣으면 anonymous rate limit 없이 더 안정적으로 동작

이미 기본 설정에 들어 있다:

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

권장 설정:

1. `https://context7.com/dashboard` 에서 API 키 발급
2. Codespaces secret 이름을 `CONTEXT7_API_KEY` 로 추가
3. Codespace를 다시 열거나 새로 만든다

현재 세션에 바로만 쓰고 싶으면 터미널에서:

```bash
export CONTEXT7_API_KEY="네_발급_키"
```

영구적으로 Codespaces에 넣고 싶으면:

- GitHub repo `Settings -> Codespaces -> Secrets`
- 이름: `CONTEXT7_API_KEY`
- 값: 발급받은 키

설정 후 확인:

```bash
node scripts/doctor.mjs --target /path/to/your-project
```

`CONTEXT7_API_KEY (set)` 으로 보이면 starter 기준 준비는 끝이다.

### 3. Chrome DevTools MCP

용도:

- 브라우저 재현
- 콘솔/네트워크 확인
- UI 디버깅

이건 서버가 떠 있어야만 유용하다.

### 4. Markitdown

용도:

- 문서/파일 변환
- 긴 자료를 LLM 친화적 텍스트로 바꾸기

## 운영 추천 조합

### 문서 중심 개발

- `openaiDeveloperDocs`
- `context7`

### 프론트엔드 디버깅

- `chrome_devtools`
- `context7`

### 문서/분석 작업

- `markitdown`
- `openaiDeveloperDocs`

### API 계약 중심 작업

- `OpenAPI`
- 필요하면 `chrome_devtools`

### DB/쿼리 작업

- `Postgres MCP`

## 설정 방식

가장 안전한 방식은 starter 기본 설정을 유지하고, 필요한 MCP만 추가로 붙이는 것이다.

기본 예시는 이미 starter의 `.codex/config.toml`에 들어가 있다:

```toml
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[agents]
max_threads = 4
max_depth = 1

[mcp_servers.openaiDeveloperDocs]
url = "https://developers.openai.com/mcp"

[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
```

여기에 `OpenAPI`, `Postgres MCP`, `chrome_devtools`, `markitdown` 중 필요한 것만 상황에 따라 추가하면 된다.

## 주의할 점

- MCP를 너무 많이 켜면 오히려 판단 비용이 늘어난다.
- 문서형 MCP 2개를 기본으로 쓰고, 나머지는 작업 성격에 따라 하나씩 더 붙이는 편이 좋다.
- 인증이 필요한 MCP는 토큰/시크릿 설계가 먼저다.
- MCP가 있다고 항상 검색부터 하는 게 아니라, 로컬 코드와 repo 규칙을 먼저 본다.
- GitHub 작업은 GitHub plugin으로 충분한 경우가 많다.

## 같이 보면 좋은 문서

- [운영 자동화 가이드](automation-playbook.md)
- [품질 게이트 가이드](quality-gates.md)
