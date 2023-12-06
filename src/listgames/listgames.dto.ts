import { IsNumber, IsString, Min } from 'class-validator';
import {
  AddGamesToListRequest,
  CreateListGamesRequest,
} from './proto/listgames.pb';

export class ListGamesRequestDto implements CreateListGamesRequest {
  @IsNumber()
  @Min(1)
  public userId: number;
  @IsString()
  public name: string;
  @IsNumber({}, { each: true })
  public gameIds: number[];
  @IsString()
  public token: string;
}
export class AddGamesToListRequestDto implements AddGamesToListRequest {
  @IsNumber()
  @Min(1)
  public listId: number;
  @IsNumber({}, { each: true })
  public gameIds: number[];
}
