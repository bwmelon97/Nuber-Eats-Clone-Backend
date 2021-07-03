import { EntityRepository, Repository } from "typeorm";
import { GetCategoryOutput } from "../dtos/get-category.dto";
import { Category } from "../entities/category.entity";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

    nameInputToNameAndSlug(nameInput: string): [string, string] {
        const name = nameInput.trim().toLowerCase()
        const slug = name.replace(/ /g, '-')
        return [name, slug]
    }

    async getByName (nameInput: string): Promise<GetCategoryOutput> {
        try {
            const [ name ] = this.nameInputToNameAndSlug(nameInput)
            const category = await this.findOne({ name })
            if (!category) throw Error("Category doesn't exist.")
            return { ok: true, category }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to find category."
            }
        }

    }

    /* Category가 없는 경우 새로 만들고, 있으면 그대로 사용할 수 있음 */
    async getOrCreate (nameInput: string): Promise<Category> {
        try {
            const [name, slug] = this.nameInputToNameAndSlug(nameInput)
            let category = await this.findOne({ name })
        
            if (!category) {
                category = await this.save( this.create({ name, slug }) )
            }
            return category;
        } catch (error) { throw Error(error) }
    }

}