import { Entity, PrimaryGeneratedColumn, Column, Timestamp, OneToMany } from "typeorm"
import { Medicine } from "./Medicine"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    usr_id: number

    @Column({ length: 50 })
    name: string

    @Column({ length: 15 })
    username: string

    @Column()
    password: string

    @OneToMany(() => Medicine, (medicine) => medicine.user)
    medicines: Medicine[]

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: Timestamp

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    updated_at: Timestamp

}