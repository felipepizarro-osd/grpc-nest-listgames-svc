import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientGrpc } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import {
  GAMES_SERVICE_NAME,
  GamesServiceClient,
  GetGameResponse,
} from './proto/games.pb';
import { Listgames } from './listgames.entity';
import {
  CreateListGamesRequest,
  CreateListGamesResponse,
} from './proto/listgames.pb';
@Injectable()
export class ListgamesService implements OnModuleInit {
  private gamesService: GamesServiceClient;

  @Inject(GAMES_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectRepository(Listgames)
  private readonly repository: Repository<Listgames>;

  public onModuleInit() {
    this.gamesService =
      this.client.getService<GamesServiceClient>(GAMES_SERVICE_NAME);
  }
  public async createListGames(
    data: CreateListGamesRequest,
  ): Promise<CreateListGamesResponse> {
    const game: GetGameResponse = await firstValueFrom(
      //TODO: fix this potentially undefined error by checking if game is assigned to a list or create a new list with only one game
      this.gamesService.getGame({ id: data.gameid }),
    );
    if (game.status >= HttpStatus.NOT_FOUND) {
      return {
        status: game.status,
        error: ['Game not found'],
        listId: null,
      };
    }
    const listgames: Listgames = new Listgames();
    listgames.name = data.name;
    listgames.gameid = data.gameid;
    listgames.userId = data.userId;
    await this.repository.save(listgames);
  }
}
