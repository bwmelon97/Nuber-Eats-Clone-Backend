import { EntityRepository, Repository } from "typeorm";
import { Category } from "../entities/category.entity";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

    /* Category가 없는 경우 새로 만들고, 있으면 그대로 사용할 수 있음 */
    async getOrCreate (name: string): Promise<Category> {
        try {
            const categoryName = name.trim().toLowerCase()
            let category = await this.findOne({ name: categoryName })
        
            if (!category) {
                const categorySlug = categoryName.replace(/ /g, '-')
                category = await this.save(
                    this.create({ name: categoryName, slug: categorySlug })
                )
            }
            return category;
        } catch (error) { throw Error(error) }
    }

}