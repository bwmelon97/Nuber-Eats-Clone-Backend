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
$ yarn start:dev
```
