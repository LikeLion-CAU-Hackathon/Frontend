<div align="center">
  <h1> 🦁🎄Likelion Postbox: 2025 Advent Calendar🎄🦁 </h1>
  <img width="75%" height="1080" alt="메인 타이틀 이미지" src="https://github.com/user-attachments/assets/7ea6d7be-5d4b-4ad3-ba7d-f78c2f30d197" />
</div>
<p align="center">
  <strong>
    2025 중앙대학교 멋쟁이사자만을 위한 24일간의 기록 <br>
  </strong>
  배포 URL: <a href="likelionpostbox.netlify.app/">likelionpostbox.netlify.app</a>
</p>
<br>


## 🙇🏻‍♀️ Introduction

### 기획 배경
<strong>우리에게는 '공유된 시간'을 '우리만의 추억'으로 재정의할 창구가 필요합니다.</strong>
- 10개월간의 해커톤과 프로젝트, 업무적 대화 속에 묻혀버린 사적인 이야기들
- 38명 대규모 커뮤니티에서 필연적으로 발생하는 소외감과 피상적인 관계
- Slack과 Notion은 마음이 아닌, 업무를 나누는 공간 

## 📸 DEMO

### 서비스 미리보기
<img width="393" height="852" alt="최종_로그인" src="https://github.com/user-attachments/assets/b9d3dd46-feee-4a10-9f63-26761294efff" />
<img width="393" height="852" alt="캘린더" src="https://github.com/user-attachments/assets/e73a37d5-281b-4899-832f-14fe0eaeeb63" />
<img width="393" height="852" alt="오늘의 질문" src="https://github.com/user-attachments/assets/1b3b984b-d0bf-4022-bed0-4820716f319b" />
<img width="393" height="852" alt="answer-list" src="https://github.com/user-attachments/assets/77ef9276-e188-43bb-9819-dd153a8fdfa5" />

<br>


## 💡 Tech Stack
|Frontend|Backend|Deployment|Other|
|:------:|:------:|:------:|:------:|
|<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/></a>|<img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=flat-square&logo=Spring Boot&logoColor=white"/></a><br><img src="https://img.shields.io/badge/Java-007396?style=flat-square&logo=Java&logoColor=white"/></a><br><img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/></a>|<img src="https://img.shields.io/badge/Vercel-111011?style=flat-square&logo=Vercel&logoColor=white"/></a>|<img src="https://img.shields.io/badge/Swagger-85EA2E?style=flat-square&logo=Swagger&logoColor=white"/></a>

```
- Frontend : React, TypeScript
- Backend : Spring Boot, Java
- Database : MySQL
- Deployment : Vercel
- API Documentation : Swagger
```
<br>


## 🗂️ Database
<img width="1470" height="1140" alt="ERD" src="https://github.com/user-attachments/assets/70ee5796-0de4-4302-8c93-43a85029ebc6" />

<br>


## 📂 Directory Structure

### Frontend

페이지 중심 구조에서 발생한 로직 과밀 문제를 해결하기 위해, hooks / utils / apis 레이어를 기준으로 책임을 재정의하고 전반적인 리팩토링을 주도했습니다.
```
src
├── App.css
├── App.tsx
├── apis
│   ├── answer
│   │   ├── answer.api.ts
│   │   └── like.api.ts
│   ├── auth.ts
│   ├── axiosInstance.ts
│   ├── question
│   │   └── question.api.ts
│   └── user
│       └── user.api.ts
├── assets
│   └── images
│       ├── background
│       │   ├── bg1.png
│       │   ├── bg10.png
│       │   ├── bg2.png
│       │   ├── bg3.png
│       │   ├── bg4.png
│       │   ├── bg5.png
│       │   ├── bg6.png
│       │   ├── bg7.png
│       │   ├── bg8.png
│       │   ├── bg9.png
│       │   └── cover.png
│       ├── comments
│       │   ├── comment.svg
│       │   ├── heart-filled.svg
│       │   ├── heart.svg
│       │   ├── react-icons
│       │   │   └── ai
│       │   │       └── AiOutlineMessage.svg
│       │   └── x.svg
│       ├── envelope
│       │   ├── bottom_fold.png
│       │   ├── letter_background.png
│       │   ├── side_fold.png
│       │   └── top_fold.png
│       ├── login
│       │   ├── google-login-button.png
│       │   └── loginlong.png
│       ├── send.svg
│       └── stamp
│           ├── expiredStamp.png
│           ├── stamp.png
│           ├── stamp1.png
│           ├── stamp10.png
│           ├── stamp11.png
│           ├── stamp12.png
│           ├── stamp13.png
│           ├── stamp14.png
│           ├── stamp15.png
│           ├── stamp16.png
│           ├── stamp17.png
│           ├── stamp18.png
│           ├── stamp19.png
│           ├── stamp2.png
│           ├── stamp20.png
│           ├── stamp21.png
│           ├── stamp22.png
│           ├── stamp23.png
│           ├── stamp24.png
│           ├── stamp3.png
│           ├── stamp4.png
│           ├── stamp5.png
│           ├── stamp6.png
│           ├── stamp7.png
│           ├── stamp8.png
│           └── stamp9.png
├── components
│   ├── calendar
│   │   ├── CalendarCard.tsx
│   │   └── LetterContent.tsx
│   ├── common
│   │   ├── AnswerCard.tsx
│   │   ├── Footer.tsx
│   │   ├── button
│   │   │   └── AnswerButton.tsx
│   │   ├── googleloginbutton
│   │   │   ├── GoogleLoginButton.module.css
│   │   │   └── GoogleLoginButton.tsx
│   │   ├── modal
│   │   │   └── Modal.tsx
│   │   └── overlay
│   │       └── Overlay.tsx
│   └── layout
│       └── fixedscreenlayout
│           ├── FixedScreenLayout.module.css
│           └── FixedScreenLayout.tsx
├── constants
│   ├── baseURL.ts
│   └── oauth.ts
├── hooks
│   ├── useAnswerListAccess.ts
│   ├── useAnswerListAnimation.ts
│   ├── useAnswerListData.ts
│   ├── useAnswerListNavigation.ts
│   ├── useAnswerListSlider.ts
│   ├── useAnswerSubmit.ts
│   ├── useAuthTokenHandler.ts
│   ├── useCalendar.ts
│   ├── useCommentProfile.ts
│   ├── useCommentsReplies.ts
│   ├── useLike.ts
│   ├── useQuestion.ts
│   └── useUserProfile.ts
├── index.css
├── main.tsx
├── pages
│   ├── answer
│   │   ├── Answer.module.css
│   │   └── Answer.tsx
│   ├── answer-list
│   │   ├── AnswerListPage.tsx
│   │   └── components
│   │       ├── AnswerGrid.tsx
│   │       └── AnswerSlide.tsx
│   ├── calendar
│   │   ├── CalendarPage.tsx
│   │   ├── LetterPage.tsx
│   │   └── components
│   │       ├── CalendarOverlay.tsx
│   │       ├── CardGrid.tsx
│   │       └── LetterEnvelope.tsx
│   ├── comments
│   │   ├── Comments.module.css
│   │   └── Comments.tsx
│   └── login
│       ├── Login.module.css
│       ├── Login.tsx
│       └── styles
│           └── global.css
├── router
│   └── PrivateRoute.tsx
├── types
│   ├── answerList.ts
│   └── card.ts
└── utils
    ├── answer.ts
    ├── comments.ts
    ├── date.ts
    ├── dayToKorean.ts
    ├── likedAnswers.ts
    ├── random.ts
    ├── stampLoader.ts
    ├── storage.ts
    └── token.ts
```
<br>

## 👨‍👩‍👧‍👧 Team
| 조윤빈 | 권정주 | [강지혜](https://github.com/Jihaeee) | [최영현](https://github.com/) | [김윤형](https://github.com/) | [오지원](https://github.com/) |[천재홍](https://github.com/) |
| :----------------------------------------: | :----------------------------------------: |:----------------------------------------: | :----------------------------------------: | :----------------------------------------: | :----------------------------------------: | :----------------------------------------: 
| Project Manager | Designer | Frontend Developer | Frontend Developer | Backend Developer | Backend Developer | Backend Developer |
