## 실행 안 되는 에러

현재 노드 버전이 `10.24.1`로 설정되어 있어서 nest 앱을 실행하기 위한 최소 버전인 12 버전보다 낮기 때문에 실행이 되지 않습니다.

새로운 터미널을 실행하고 아래의 명령어를 실행하면 제대로 작동됩니다.

```bash
$ nvm install 14.15.1  # Node Version Upgrade
$ yarn start:dev
```

---

## Error: doesn't execute Nest App

Current node version is `10.24.1`, which is below than 12 ver (min version to running Nest app).

Try this command. Then it works !

```bash
$ nvm install 14.15.1  # upgrade Node Version
$ yarn install
$ yarn start:dev
```

.

---

.

# Today's Objects
Unit test

아래 테스트 파일들에서 Stmts(statements)가 전부 100%가 나오도록
```
- podcasts.service.spec.ts  [o]
- jwt.service.spec.ts       [o]
- users.service.spec.ts     [o]
```

```bash
$ npm run test:cov
```



---

## Assignment log

### 5.12.
유저 인증과 유저 CRUD

호스트(Host) 역할의 유저는 Podcast를 만들어서 Episode를 업로드 /
리스너(Listener) 유저들이 팟캐스트를 구독하여 에피소드를 듣기

`users` module with entities, services and resolvers

```
- Users should be able to login with a password.
- There should be only oneuser entity 
- but your entity should support two roles 'Host' and 'Listener'.
- Create Guards to protect private resolvers.
- Use JWT as authentication method.
- Create a decorator to get the logged in user.
```

Resolver에 들어갈 Mutation & Quary
```
- createAccount [o]
- login         [o]
- editProfile   [o]
- seeProfile    [o]
```

패스워드는 반드시 bcrypt를 이용하여 hash화 /
EditProfile에서 패스워드를 변경할 경우 꼭 다시 hashing을 해야 

JwtModule을 만들어서 구현하시면 보너스 점수