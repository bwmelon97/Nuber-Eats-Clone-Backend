import { PaginationInput } from "src/common/dtos/pagination.dto";
import { GetRestaurantsOutput } from "./get-restaurants.dto";

export class GetMyRestaurantsInput extends PaginationInput {}
export class GetMyRestaurantsOutput extends GetRestaurantsOutput {}