import { MigrationInterface, QueryRunner } from "typeorm";

export class Healthshop1729934083245 implements MigrationInterface {
    name = 'Healthshop1729934083245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medicine" ("kfa_code" character varying(20) NOT NULL, "name" character varying(200) NOT NULL, "image" character varying, "fix_price" numeric(8,4) NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userUsrId" integer, CONSTRAINT "PK_802271f0574b705545517852e30" PRIMARY KEY ("kfa_code"))`);
        await queryRunner.query(`CREATE TABLE "user" ("usr_id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "username" character varying(15) NOT NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9ecc40e9e25b3d9cfdda1c6fb8" PRIMARY KEY ("usr_id"))`);
        await queryRunner.query(`ALTER TABLE "medicine" ADD CONSTRAINT "FK_0bfe87a23af4e073e601e691ee2" FOREIGN KEY ("userUsrId") REFERENCES "user"("usr_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medicine" DROP CONSTRAINT "FK_0bfe87a23af4e073e601e691ee2"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "medicine"`);
    }

}
