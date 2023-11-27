import { IsNumber, Min } from 'class-validator';
import { CreateListGamesRequest } from './proto/listgames.pb';

export class ListGamesRequestDto implements CreateListGamesRequest {
  public name: string;
  public gameid: number;
  @IsNumber()
  @Min(1)
  public userId: number;
}
