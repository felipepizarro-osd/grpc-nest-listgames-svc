import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListgamesController } from './listgames.controller';
import { ListgamesService } from './listgames.service';
import { Listgames } from './listgames.entity';
import { GAMES_PACKAGE_NAME, GAMES_SERVICE_NAME } from './proto/games.pb';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GAMES_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50053',
          package: GAMES_PACKAGE_NAME,
          protoPath: 'node_modules/grpc-nest-proto/proto/games.proto',
        },
      },
    ]),
    TypeOrmModule.forFeature([Listgames]),
  ],
  controllers: [ListgamesController],
  providers: [ListgamesService],
})
export class ListgamesModule {}
