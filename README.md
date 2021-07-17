# Nuber-Eats-Clone
Nuber Eats Clone Coding Project

### Local Tunnel로 Backend Server 접근하기
```bash
$ npx localtunnel --port 3000 --subdomain soogeun 
```

### mysql server start
```bash
$ sudo service mysql start
$ mysql -u root -p
```

### 추가로 공부할 내용
 * TypeORM 에서 cursor 기반 Pagination 구현
 * SQL 문법 공부하기


## 작업할 것
* Search Restaurant는 첫 번째로 Name 기준으로 검색한 뒤, 두 번째는 Category의 Name을 찾기
* category name 기반으로 검색하는 부분에서 문제가 있음. 
  fast food / Coffee / Bakery가 제 기능 못하는 것으로 보아 slug 문제인듯? (사이 띄어쓰기, 대문자 오류) `[O]`
  -> slug 기반으로 찾는 것으로 변경 but 아직 불완전하다고 볼 수 있음
  -> Test가 필요한 이유 !
* myRestaurants query 만들기
* create uploads module -> AWS 저장 후 file url 리턴

* category는 admin 계정만이 추가할 수 있도록 함 (createRestaurant에서 임의의 카테고리 생성을 제어)
* admin role의 유저 만들기
* restaurant의 category는 nullable true하도록 설정
* restaurant의 category가 여러 개 담길 수 있도록 하기 (ManyToMany)
* restaurant를 생성할 때 원하는 카테고리가 없는 경우 admin에게 요청하는 뮤테이션 제공
* update Category, delete Category도 만들기
* Search Restaurant의 search input에 대해 적절한 output을 도출하는 함수를 구상하기

* changeOrderStatus의 조건문 코드 리팩터링하기
* changeOrderStatus 테스팅
* getCookedOrders: Delivery가 Pickup 할 order 찾기
* Create Order 테스트하기
* getMyOrders -> 문제점이 많은 코드
* (나중에) Create Order: input option이 올바르지 않은 경우 handling 필요
* payment 작업
* CRON Job (특정 시간 간격으로 자동으로 함수를 실행하도록 하는 것) - payment 강의 안에 있다.

## Notion에 정리할 것
* entity에 InputType 데코레이터를 추가하지 않는 경우, input DTO에 사용할 수 없다.
* Entity에 JSON type 저장하기 - (Relation을 깔끔히 관리)                                                (CreateOrder)
    -> Chicken Dish의 옵션이 [spicy, mexican] 이었다가 다음날 [spicy, galic, bulgogi] 로 변경되었을 때, 이전 데이터들에 영향을 주지 않을 수 있음
* 동일한 Object를 가리키는 Entity라도 Owner 파트와 Client 파트를 구분할 필요가 있는 경우                    (CreateOrder)

* pubsub은 데모용 목적으로 만들어짐. production에 사용하려면 radis-pubsub을 이용할것. (이건 나중에)