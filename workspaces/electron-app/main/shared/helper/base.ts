import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class base {
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
  
  @DeleteDateColumn()
  public deletedAt: Date;
}
