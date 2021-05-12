import { CoreOutput } from "src/common/dtos/core-output.dto";
import { User } from "../entities/user.entity";


export class UserOutput extends CoreOutput {
    user?: User;
}