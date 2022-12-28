import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
	@Column({ default: '' })
	firstName: string;

	@Column({ default: '' })
	lastName?: string;

	@Column({ default: '' })
	email: string;

	@Column({ default: '' })
	password: string;

	@Column({ default: '' })
	phone?: string;

	@Column({ default: '' })
	address: string;

	@Column({ default: false })
	gender: boolean;

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar' })
	createdBy: string;

	@CreateDateColumn()
	createdAt: Date;

	@Column({ type: 'varchar', nullable: true })
	UpdatedBy?: string;

	@CreateDateColumn({ nullable: true })
	UpdatedAt?: Date;

	@Column({ type: 'boolean', default: false })
	IsDeleted: boolean;
}
