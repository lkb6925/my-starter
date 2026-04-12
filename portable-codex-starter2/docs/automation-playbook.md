# 운영 가이드

이 문서는 `starter2`를 낮용 Codespaces + Codex 세트로 쓰기 위한 문서다.

핵심 전제:

- 낮: `starter2`
- 밤: OMX + Hermes on VM

이 둘을 섞지 않는 것이 중요하다.

## 1. starter2가 하는 일

현재 포함:

- `AGENTS.md`
- `.codex/agents/`
- `.agents/skills/`
- `.codex/config.toml`
- `.devcontainer/`

현재 하는 일:

- Codespaces 기본 환경 준비
- Codex 역할 분리
- MCP 기본값 제공
- 인터랙티브 구현/리뷰/탐색 지원

## 2. starter2가 하지 않는 일

의도적으로 제외:

- Gemini checker
- pre-push gate
- GitHub/Copilot instruction 계층
- GitHub workflow 자동화
- 야간 공장형 재시도 루프
- OMX 팀 런타임 대체

이런 건 VM의 OMX + Hermes가 맡는다.

## 3. Codespaces 계층

현재 포함:

- `.devcontainer/devcontainer.json`
- `.devcontainer/scripts/post-create.sh`
- `.devcontainer/scripts/update-content.sh`

현재 하는 일:

- Node 20, Rust, GitHub CLI 설치
- VS Code extension 추천
- `openFiles`로 `README.md`, `AGENTS.md` 열기
- recommended secrets 제안
- `updateContentCommand`로 의존성 준비
- `postCreateCommand`로 세션 후처리

## 4. 낮 작업 원칙

추천 작업:

- UI/UX 디테일 수정
- 가벼운 버그 수정
- 로컬 테스트
- 코드 리뷰와 리팩터
- MCP를 통한 사실 확인

추천 종료 조건:

- commit / push까지 마무리

이걸 해두지 않으면 밤에 VM이 pull할 때 코드가 꼬인다.

## 5. MCP 운영

기본:

- `openaiDeveloperDocs`
- `context7`

선택:

- `chrome_devtools`
- `OpenAPI`
- `Postgres MCP`
- `markitdown`

원칙:

- 로컬 코드 먼저
- MCP는 기본 1개
- 필요할 때만 2개

자세한 건 [mcp-setup.md](mcp-setup.md)를 보면 된다.

## 6. 야간 OMX와의 handoff

권장 순서:

1. 낮에 Codespaces에서 수정
2. 로컬 검증
3. commit / push
4. 밤에 VM에서 `git pull`
5. OMX 공장 가동

즉 starter2는 handoff 전 정밀 세공 레이어라고 보면 된다.

## 7. 설치 후 체크리스트

1. starter2 설치
2. `doctor` 실행
3. `.codex/config.toml` 확인
4. `CONTEXT7_API_KEY`가 필요하면 Codespaces secret 추가
5. 낮 작업 후 반드시 push

## 공식 문서

- Codespaces recommended secrets:
  `https://docs.github.com/en/enterprise-cloud%40latest/codespaces/setting-up-your-project-for-codespaces/configuring-dev-containers/specifying-recommended-secrets-for-a-repository`
- Codespaces openFiles:
  `https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/configuring-dev-containers/automatically-opening-files-in-the-codespaces-for-a-repository`
