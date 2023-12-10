import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ListgamesService } from './listgames.service';
import { AddGamesToListRequestDto, ListGamesRequestDto } from './listgames.dto';
import {
  AddGamesToListResponse,
  CreateListGamesResponse,
  DeleteGameFromListRequest,
  DeleteGameFromListResponse,
  GetGamesInListRequest,
  GetGamesInListResponse,
  LIST_GAMES_SERVICE_NAME,
} from './proto/listgames.pb';

@Controller('listgames')
export class ListgamesController {
  @Inject(ListgamesService)
  private readonly service: ListgamesService;

  @GrpcMethod(LIST_GAMES_SERVICE_NAME, 'createListGames')
  public async createListGames(
    data: ListGamesRequestDto,
  ): Promise<CreateListGamesResponse> {
    return await this.service.createListGames(data);
  }
  @GrpcMethod(LIST_GAMES_SERVICE_NAME, 'addGamesToList')
  public async addGamesToList(
    data: AddGamesToListRequestDto,
  ): Promise<AddGamesToListResponse> {
    return await this.service.addGameToList(data.listId, data.gameIds);
  }
  @GrpcMethod(LIST_GAMES_SERVICE_NAME, 'getGamesInList')
  public async getGamesInList(
    data: GetGamesInListRequest,
  ): Promise<GetGamesInListResponse> {
    return await this.service.getGamesInList(data.listId);
  }
  @GrpcMethod(LIST_GAMES_SERVICE_NAME, 'deleteGameFromList')
  public async deleteGameFromList(
    data: DeleteGameFromListRequest,
  ): Promise<DeleteGameFromListResponse> {
    return await this.service.deleteGameFromList(data.listId, data.gameId);
  }
}
