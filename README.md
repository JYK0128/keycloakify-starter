<!-- 주요 명령어 -->
npx keycloakify add-story
npx keycloakify eject-page

<!-- 개발 -->
yarn storybook

<!-- 빌드 -->
yarn build-keycloak-theme
docker build -t my-keycloak .

<!-- 실행(컴포즈) -->
docker-compose up -d    (백실행)
docker-compose up -d --build    (갱신 & 백실행)
docker-compose logs -f  (로그)
docker-compose down     (종료)

<!-- 실행 -->
docker run -d --rm -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin -v "${PWD}/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar":/opt/keycloak/providers/keycloak-theme.jar my-keycloak:latest start-dev

<!-- 실행(콘솔) -->
docker run --rm -ti -p 8080:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin -v "${PWD}/dist_keycloak/keycloak-theme-for-kc-all-other-versions.jar":/opt/keycloak/providers/keycloak-theme.jar my-keycloak:latest start-dev

<!-- 구현 정보 -->
// keyclock all configs - 도커 빌드 시 사용
<https://www.keycloak.org/server/all-config>

// 이메일 스코프
<https://developers.google.com/oauthplayground/>

// google auth console
<https://console.cloud.google.com/apis/credentials>

// google apppasswords - XOauth2 미지원
<https://myaccount.google.com/apppasswords>

// recapcha

- iframe 설정 header => realm settings => security defenses
- X-Frame-Options:  
=> SAMEORIGIN
=> ALLOW-FROM <https://www.google.com>

- frames-*
=> frame-src 'self'; frame-ancestors 'self'; object-src 'none';
=> frame-src 'self' <https://www.google.com/>

// git 커밋 재정리
git reset --soft HEAD~n
