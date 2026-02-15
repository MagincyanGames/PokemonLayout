import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppGateway } from './app.gateway'; // Lo crearemos ahora
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonSlot } from './entities/pokemon-slot.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // Se creará en la raíz del backend
      entities: [PokemonSlot],
      synchronize: true, // Auto-crea las tablas (solo para desarrollo)
    }),
    TypeOrmModule.forFeature([PokemonSlot]),
  ],
  providers: [AppGateway],
})
export class AppModule {}
