import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class PokemonSlot {
  @PrimaryColumn()
  id: number; // El slotId (0, 1, 2...)

  @Column({ default: 'Ninguno' })
  name: string;

  @Column({ default: 0 })
  level: number;

  @Column({ nullable: true })
  spriteUrl: string;
}