# Automation Playbook

이 문서는 `starter2`를 밤새 `tmux`에서 돌아가는 VM 하네스로 쓸 때의 운영 원칙을 정리한다.

## 목적

- Hermes, Codex CLI, OMX가 이미 설치된 환경에 덧씌운다
- 기존 런타임을 막지 않는다
- 최소 규칙만 추가한다
- handoff와 복구를 쉽게 만든다

## 권장 설치

기본 권장:

```bash
node scripts/install.mjs --target /path/to/your-project --with-config --core-only
```

이 방식은 `.devcontainer/`를 복사하지 않으므로 VM 서버에 불필요한 Codespaces 흔적을 남기지 않는다.

## 포함 요소

- `AGENTS.md`
- `.codex/agents/`의 4인방
- `.agents/skills/`
- `.omx/checkpoints/`
- `.codex/config.toml`
- `scripts/install.mjs`
- `scripts/doctor.mjs`

## 실행 원칙

- 질문보다 진행을 우선한다
- 실패하면 `tail -n 100` 수준으로 로그를 먼저 읽는다
- 프레임워크 문서는 `context7`를 먼저 쓴다
- DB 스키마는 read-only `postgres`로 먼저 확인한다
- 의미 있는 마일스톤마다 git commit 또는 체크포인트를 남긴다

## 하지 않는 일

- push 차단 훅
- GitHub workflow 게이트
- Gemini checker 루프
- 자체 장기 재시도 런타임
- Hermes / OMX / Codex CLI 대체

## handoff 규칙

- 커밋 메시지에 바뀐 점, 남은 TODO, 다음 액션을 남긴다
- 아침에 이어받을 수 있도록 중간 상태를 재현 가능하게 남긴다
- DB 관련 작업은 실제 스키마와 코드 가정의 차이를 명시한다
- `postgres` DSN은 실사용 전에 반드시 read-only 계정으로 교체한다
