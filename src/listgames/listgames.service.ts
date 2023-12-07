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
  AddGamesToListResponse,
  CreateListGamesRequest,
  CreateListGamesResponse,
  DeleteGameFromListResponse,
  GetGamesInListResponse,
} from './proto/listgames.pb';
import { 
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  ValidateIdResponse,
  
} from './proto/auth.pb'

@Injectable()
export class ListgamesService implements OnModuleInit {
  private gamesService: GamesServiceClient;
  private authService: AuthServiceClient;

  @Inject(GAMES_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientGrpc;

  @InjectRepository(Listgames)
  private readonly repository: Repository<Listgames>;

  public onModuleInit() {
    this.gamesService =
      this.client.getService<GamesServiceClient>(GAMES_SERVICE_NAME);
      this.authService = this.authClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  public async createListGames(data: CreateListGamesRequest): Promise<CreateListGamesResponse> {
    try {
      const validationResult: ValidateIdResponse = await firstValueFrom(
        this.authService.validateId({ userId: data.userId })
      );
  
      if (validationResult.status !== HttpStatus.OK) {
        return {
          status: validationResult.status,
          error: [`User with id ${data.userId} not found.`],
          listId: null,
        };
      }
//      console.log(data);
      const listgames: Listgames = new Listgames();
      listgames.name = data.name;
      listgames.gamesIds = data.gameIds;
      listgames.userId = data.userId;
      await this.repository.save(listgames);

      return {
        status: HttpStatus.OK,
        error: [],
        listId: listgames.id,
      };
    } catch (error) {
      console.error(error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: [`Internal server error`],
        listId: null,
      };
    }
  }
  //add a game to a list
  public async addGameToList(
    listId: number,
    gameIds: number[],
  ): Promise<AddGamesToListResponse> {
    const listgames: Listgames = await this.repository.findOne({
      where: { id: listId },
    });
    if (!listgames) {
      // Si listgames es null, la lista no fue encontrada
      return {
        status: HttpStatus.NOT_FOUND, // Código de estado 404 Not Found
        error: [`List with id ${listId} not found`],
        listId,
      };
    }

    let allOperationsSuccessful = true;
    let failedGameId = null;

    for (const gameId of gameIds) {
      const game: GetGameResponse = await firstValueFrom(
        this.gamesService.getGame({ id: gameId }),
      );

      if (game.game !== null) {
        if (!listgames.gamesIds.includes(game.game.id)) {
          listgames.gamesIds.push(game.game.id);
        } else {
          return {
            status: HttpStatus.CONFLICT, // Código de estado 409 Conflict
            error: [`Game with id ${gameId} already exists in the list`],
            listId: listgames.id,
          };
        }
      } else {
        allOperationsSuccessful = false;
        failedGameId = gameId;
        break;
      }
    }

    await this.repository.save(listgames); // Save the updated listgames object

    if (allOperationsSuccessful) {
      return {
        status: HttpStatus.OK,
        error: [],
        listId: listgames.id,
      };
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        error: [`Game with id ${failedGameId} not found`],
        listId: listgames.id,
      };
    }
  }
  // //delete a game from a list
  public async deleteGameFromList(
    listId: number,
    gameId: number,
  ): Promise<DeleteGameFromListResponse> {
    const listgames: Listgames = await this.repository.findOne({
      where: { id: listId },
    });

    const game: GetGameResponse = await firstValueFrom(
      this.gamesService.getGame({ id: gameId }),
    );

    if (game.game !== null && listgames.gamesIds.includes(game.game.id)) {
      listgames.gamesIds = listgames.gamesIds.filter(
        (gameId) => gameId !== game.game.id,
      );
      await this.repository.save(listgames); // Save the updated listgames object
      return {
        status: HttpStatus.OK,
        error: [],
        listId: listgames.id,
      };
    } else {
      return {
        status: HttpStatus.NOT_FOUND,
        error: [`Game with id ${gameId} not found`],
        listId: listgames.id,
      };
    }
  }
  //get all games in a list
  public async getGamesInList(listId: number): Promise<GetGamesInListResponse> {
    console.log(listId);
    const listgames: Listgames = await this.repository.findOne({
      where: { id: listId },
    });
    if (!listgames || listgames.gamesIds.length === 0 || listgames === null) {
      return {
        game: null,
        status: HttpStatus.NOT_FOUND,
        error: [`List with id ${listId} not found`],
      };
    } else {
      const games = [];
      for (const gameId of listgames.gamesIds) {
        const game: GetGameResponse = await firstValueFrom(
          this.gamesService.getGame({ id: gameId }),
        );
        games.push(game.game);
      }
      if (games.length > 0) {
        return {
          game: games,
          status: HttpStatus.OK,
          error: [],
        };
      } else {
        return {
          game: null,
          status: HttpStatus.NOT_FOUND,
          error: [`Games does not exist`],
        };
      }
    }
  }
}
