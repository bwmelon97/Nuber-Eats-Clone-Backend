# Nuber-Eats Clone / Backend

## User Module
### Entity
* id
* createdAt
* updatedAt

* email
* password
* role

### funcs
* Create Account
* Log In
* See Profile
* Edit Profile
* Verify Email


## 작업할 것
* order subscription (pubsub)
* implement Subscription
  - change order status -> client, owner, delivery subscribe
  - cooked order -> delivery subscribe

* changeOrderStatus의 조건문 코드 리팩터링하기
* changeOrderStatus 테스팅
* getCookedOrders: Delivery가 Pickup 할 order 찾기
* Create Order 테스트하기
* getMyOrders -> 문제점이 많은 코드
* (나중에) Create Order: input option이 올바르지 않은 경우 handling 필요

## Notion에 정리할 것
* entity에 InputType 데코레이터를 추가하지 않는 경우, input DTO에 사용할 수 없다.
* Entity에 JSON type 저장하기 - (Relation을 깔끔히 관리)                                                (CreateOrder)
    -> Chicken Dish의 옵션이 [spicy, mexican] 이었다가 다음날 [spicy, galic, bulgogi] 로 변경되었을 때, 이전 데이터들에 영향을 주지 않을 수 있음
* 동일한 Object를 가리키는 Entity라도 Owner 파트와 Client 파트를 구분할 필요가 있는 경우                    (CreateOrder)

* pubsub은 데모용 목적으로 만들어짐. production에 사용하려면 radis-pubsub을 이용할것. (이건 나중에)