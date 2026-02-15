import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class PokemonSlot {
  @PrimaryColumn()
  id: number; // El slotId (0, 1, 2...)

  @Column({ default: 0 })
  pokemonId: number;

  @Column({ default: false })
  isShiny: boolean;

  
}