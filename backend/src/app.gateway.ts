import { InjectRepository } from '@nestjs/typeorm';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PokemonSlot } from './entities/pokemon-slot.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    @InjectRepository(PokemonSlot)
    private readonly repository: Repository<PokemonSlot>,
  ) {}
  // Cuando una página (/pkmn/0) se conecta, le enviamos su estado actual
  handleConnection(client: Socket) {}

  @SubscribeMessage('update_pokemon')
  async handleUpdate(
    @MessageBody()
    data: {
      slotId: number;
      pokemonId: number;
      isShiny: boolean;
    },
  ) {
    console.log('--- EVENTO RECIBIDO ---');
    console.log('Datos desde el cliente:', data);

    await this.repository.save({
      id: data.slotId,
      pokemonId: data.pokemonId,
      isShiny: data.isShiny,
    });

    // 2. Avisamos a todo el mundo del cambio
    this.server.emit('pokemon_changed', data);
  }

  @SubscribeMessage('request_initial_state')
  async handleInitialState() {
    // Cuando el front haga: socket.emit('request_initial_state')
    // El servidor devuelve esto:

    var slots = (await this.repository.find()).map((s) => {
      return {
        id: s.id,
        pokemonId: s.pokemonId,
        isShiny: s.isShiny,
      };
    });
    console.log(slots);
    return { event: 'initial_state', data: { slots } };
  }
}
