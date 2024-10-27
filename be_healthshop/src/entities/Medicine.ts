import { Entity, Column, Timestamp, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class Medicine {

    @Column({ primary: true, length: 20 })
    kfa_code: string

    @Column({ length: 200 })
    name: string

    @Column({ nullable: true })
    image: string

    @Column({ type: "decimal", precision: 8, scale: 4 })
    fix_price: number

    @Column({ nullable: true })
    description: string

    @ManyToOne(() => User, (user) => user.medicines)
    user: User

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: Timestamp

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Timestamp

}