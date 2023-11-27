import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ListgamesService } from './listgames.service';
import { ListGamesRequestDto } from './listgames.dto';
import {
  CreateListGamesResponse,
  LIST_GAMES_SERVICE_NAME,
} from './proto/listgames.pb';

@Controller('listgames')
export class ListgamesController {
  @Inject(ListgamesService)
  private readonly service: ListgamesService;

  @GrpcMethod(LIST_GAMES_SERVICE_NAME, 'createListGames')
  private async createListGames(
    data: ListGamesRequestDto,
  ): Promise<CreateListGamesResponse> {
    return await this.service.createListGames(data);
  }
}
