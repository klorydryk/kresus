import {
    getRepository,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    Repository
} from 'typeorm';

import User from './users';
import { unwrap } from '../../helpers';

@Entity()
export default class Category {
    @PrimaryGeneratedColumn()
    id;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ManyToOne(type => User, { cascade: true, onDelete: 'CASCADE', nullable: false })
    @JoinColumn()
    user;

    @Column('integer')
    userId;

    // Label of the category.
    @Column('varchar')
    label;

    // Hexadecimal RGB format.
    @Column('varchar', { nullable: true })
    color;

    // Static methods

    static renamings = {
        title: 'label'
    };

    static async find(userId, categoryId): Promise<Category | undefined> {
        return await repo().findOne({ where: { id: categoryId, userId } });
    }

    static async exists(userId, categoryId): Promise<boolean> {
        const found = await Category.find(userId, categoryId);
        return !!found;
    }

    static async all(userId): Promise<Category[]> {
        return await repo().find({ userId });
    }

    // Doesn't insert anything in db, only creates a new instance and normalizes its fields.
    static cast(args): Category {
        return repo().create(args);
    }

    static async create(userId, attributes): Promise<Category> {
        const category = repo().create({ userId, ...attributes });
        return await repo().save(category);
    }

    static async destroy(userId, categoryId): Promise<void> {
        await repo().delete({ id: categoryId, userId });
    }

    static async destroyAll(userId): Promise<void> {
        await repo().delete({ userId });
    }

    static async update(userId, categoryId, fields): Promise<Category> {
        await repo().update({ userId, id: categoryId }, fields);
        return unwrap(await Category.find(userId, categoryId));
    }
}

let REPO: Repository<Category> | null = null;
function repo(): Repository<Category> {
    if (REPO === null) {
        REPO = getRepository(Category);
    }
    return REPO;
}
