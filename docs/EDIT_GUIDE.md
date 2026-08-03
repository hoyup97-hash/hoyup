# 콘텐츠 수정 가이드 (EDIT_GUIDE.md)

이 문서는 **코드를 몰라도** 사이트의 프로젝트 내용을 바꾸는 방법을 설명한다.
프로젝트(캐러셀 히어로 + 카드 그리드)의 제목·설명·수치·이미지·순서는 모두
`data/projects.json` 한 파일에서만 관리한다. 이 파일만 고치면 메인 페이지의
**캐러셀과 카드 그리드가 함께** 바뀐다. HTML/CSS/JS는 건드리지 않는다.

> 기준 문서는 `docs/PLAN.md`다. 스펙이 바뀌면 코드보다 PLAN.md를 먼저 고친다.

---

## 0. projects.json 필드 설명

각 프로젝트는 아래 필드를 가진 객체 하나다.

| 필드 | 뜻 | 값 |
|---|---|---|
| `id` | 내부 식별자 (영문·숫자·하이픈) | 예: `"campaign-2026"` |
| `status` | 상태 | `"live"`(공개) 또는 `"coming-soon"`(준비 중) |
| `title` | 프로젝트명 | 예: `"예산 25%의 캠페인"` |
| `tagline` | 한 줄 설명 | 예: `"공공데이터와 직접 만든 도구로…"` |
| `metric` | 핵심 수치 | `{ "value": "25%", "label": "경쟁자 대비 예산" }` 또는 `null` |
| `image` | 썸네일 이미지 경로 | 예: `"assets/img/campaign.webp"` 또는 `null` |
| `imageAlt` | 이미지 대체 텍스트(접근성) | 예: `"캠페인 홈페이지 화면"` |
| `detailUrl` | 상세 페이지 주소 | 예: `"projects/campaign-2026/"` 또는 `null` |

동작 규칙(자동):
- **배열 순서 = 캐러셀 슬라이드 순서 = 카드 그리드 순서.** 위에 있을수록 먼저 나온다.
- `status`가 `"coming-soon"`이면 → 회색 플레이스홀더 + "준비 중" 배지 + "자세히" 버튼 비활성.
- `image`가 `null`이면 → 이미지 자리에 회색 플레이스홀더 박스가 표시된다. 경로만 채우면 사진이 나온다.
- `metric`이 `null`이면 → 수치 표시를 건너뛴다.
- `detailUrl`이 `null`이면 → "자세히 보기" 버튼이 비활성(클릭 무동작)이 된다.

---

## 1. 더미 프로젝트를 진짜 프로젝트로 교체하는 법

현재 배열에는 준비 중인 더미가 2개 있다(`placeholder-1`, `placeholder-2`).
이 중 하나를 실제 프로젝트로 바꾸는 예시다.

### 준비물
1. 썸네일 이미지 1장을 `assets/img/` 폴더에 넣는다. (권장: WebP, 가로:세로 = 16:9)
   예) `assets/img/data-dashboard.webp`
2. 상세 페이지가 있다면 그 주소를 확인한다. (없으면 이 단계는 건너뛰고 `detailUrl`을 `null`로 둔다.)

### 수정 전 (`data/projects.json`의 세 번째 항목)

```json
{
  "id": "placeholder-1",
  "status": "coming-soon",
  "title": "프로젝트 1",
  "tagline": "준비 중입니다",
  "metric": null,
  "image": null,
  "imageAlt": "",
  "detailUrl": null
}
```

### 수정 후

```json
{
  "id": "data-dashboard",
  "status": "live",
  "title": "실시간 데이터 대시보드",
  "tagline": "공공데이터를 수집·시각화해 의사결정을 돕는 대시보드",
  "metric": { "value": "8종", "label": "연동 공공데이터 소스" },
  "image": "assets/img/data-dashboard.webp",
  "imageAlt": "실시간 데이터 대시보드 화면",
  "detailUrl": null
}
```

### 바뀌는 점
- `status`를 `"coming-soon"` → `"live"`로 바꿔 "준비 중" 배지를 없앤다.
- `title`·`tagline`을 실제 내용으로 채운다.
- `metric`에 핵심 수치 1개를 넣는다. (수치가 마땅치 않으면 `null` 그대로 둔다.)
- `image`에 넣은 이미지 경로를, `imageAlt`에 그 이미지 설명을 적는다.
- 상세 페이지를 아직 안 만들었다면 `detailUrl`은 `null`로 둔다. → "자세히 보기"가 비활성 상태로 유지된다.
  상세 페이지를 만든 뒤 `"projects/data-dashboard/"` 처럼 주소를 채우면 버튼이 활성화된다.

> 저장하고 브라우저를 새로고침하면 캐러셀 3번째 슬라이드와 그리드 3번째 카드가 동시에 바뀐다.

---

## 2. 슬라이드(프로젝트) 순서를 바꾸는 법

배열에서 **객체의 위치만 통째로 옮기면** 된다. 다른 필드는 건드리지 않는다.
아래는 1번(`campaign-2026`)과 2번(`auto-trading`)의 순서를 맞바꾸는 예시다.

### 수정 전 (앞부분만 발췌)

```json
{
  "projects": [
    {
      "id": "campaign-2026",
      "status": "live",
      "title": "예산 25%의 캠페인",
      "tagline": "공공데이터와 직접 만든 도구로 혼자 설계·운영한 선거 캠페인",
      "metric": { "value": "25%", "label": "경쟁자 대비 예산" },
      "image": null,
      "imageAlt": "",
      "detailUrl": "projects/campaign-2026/"
    },
    {
      "id": "auto-trading",
      "status": "live",
      "title": "가상자산 자동매매 시스템",
      "tagline": "Python과 API로 직접 설계한 매매 로직을 실전 운용 중",
      "metric": { "value": "실측 검증", "label": "슬리피지·오버피팅" },
      "image": null,
      "imageAlt": "",
      "detailUrl": "projects/auto-trading/"
    }
  ]
}
```

### 수정 후 (auto-trading을 맨 앞으로)

```json
{
  "projects": [
    {
      "id": "auto-trading",
      "status": "live",
      "title": "가상자산 자동매매 시스템",
      "tagline": "Python과 API로 직접 설계한 매매 로직을 실전 운용 중",
      "metric": { "value": "실측 검증", "label": "슬리피지·오버피팅" },
      "image": null,
      "imageAlt": "",
      "detailUrl": "projects/auto-trading/"
    },
    {
      "id": "campaign-2026",
      "status": "live",
      "title": "예산 25%의 캠페인",
      "tagline": "공공데이터와 직접 만든 도구로 혼자 설계·운영한 선거 캠페인",
      "metric": { "value": "25%", "label": "경쟁자 대비 예산" },
      "image": null,
      "imageAlt": "",
      "detailUrl": "projects/campaign-2026/"
    }
  ]
}
```

이제 캐러셀은 자동매매가 `PROJECT 01`, 캠페인이 `PROJECT 02`로 표시된다.
슬라이드 번호(`PROJECT 01`, `02`…)는 배열 순서에 따라 자동으로 매겨지므로 직접 바꿀 필요가 없다.
카드 그리드의 순서도 함께 바뀐다.

> `<head>`의 JSON-LD ItemList(검색엔진용 프로젝트 목록)는 별도로 `index.html`에 있다.
> 순서를 크게 바꾸거나 프로젝트를 추가·삭제했다면, `index.html`의 ItemList `position`
> 순서도 맞춰 주면 검색 노출이 더 정확해진다. (선택 사항)

---

## 3. 자주 하는 실수 (JSON 문법)

- 각 항목 끝에는 쉼표(`,`)를 붙이되, **마지막 항목 뒤에는 쉼표를 붙이지 않는다.**
- 문자열은 반드시 큰따옴표(`"`)로 감싼다. 작은따옴표(`'`)는 오류다.
- 값이 없음을 뜻할 때는 따옴표 없이 `null`이라고 쓴다. (`"null"`이 아니다.)
- 수정 후 저장이 안 되거나 화면이 비면, JSON 문법 오류일 가능성이 높다.
  온라인 JSON 검사기(jsonlint 등)에 붙여 넣어 확인한다.

---

## 4. 미디어 유튜브 영상 넣기 (참고)

메인 ⑥ 미디어 섹션의 대표 영상은 `index.html`에서 관리한다.
`data-yt-id=""` 부분에 유튜브 영상 ID를 넣으면 썸네일과 재생 버튼이 자동으로 생긴다.
(영상은 클릭할 때만 로드되는 facade 방식이라 페이지가 느려지지 않는다.)

```html
<!-- 수정 전 -->
<div class="media__video" data-yt-id="" data-yt-title="대표 토론 출연">

<!-- 수정 후 (영상 주소가 youtube.com/watch?v=abc123 이면 v= 뒤의 값) -->
<div class="media__video" data-yt-id="abc123" data-yt-title="매일신문 금요비대위 출연">
```
