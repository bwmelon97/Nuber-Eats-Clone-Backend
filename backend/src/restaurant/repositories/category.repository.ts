import { EntityRepository, Repository } from "typeorm";
import { GetCategoryOutput } from "../dtos/get-category.dto";
import { Category } from "../entities/category.entity";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

    originalNameToNameAndSlug(name: string): [string, string] {
        const categoryName = name.trim().toLowerCase()
        const categorySlug = categoryName.replace(/ /g, '-')
        return [categoryName, categorySlug]
    }

    async getByName (originalName: string): Promise<GetCategoryOutput> {
        try {
            const [ name ] = this.originalNameToNameAndSlug(originalName)
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
    async getOrCreate (originalName: string): Promise<Category> {
        try {
            const [categoryName, categorySlug] = this.originalNameToNameAndSlug(originalName)
            let category = await this.findOne({ name: categoryName })
        
            if (!category) {
                category = await this.save(
                    this.create({ name: categoryName, slug: categorySlug })
                )
            }
            return category;
        } catch (error) { throw Error(error) }
    }

}