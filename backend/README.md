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
* Order Item Entity 만들기
* Create Order

## Notion에 정리할 것
* Entity에 JSON type 저장하기 - (Relation을 깔끔히 관리)
    -> Chicken Dish의 옵션이 [spicy, mexican] 이었다가 다음날 [spicy, galic, bulgogi] 로 변경되었을 때, 이전 데이터들에 영향을 주지 않을 수 있음
* 동일한 Object를 가리키는 Entity라도 Owner 파트와 Client 파트를 구분할 필요가 있는 경우