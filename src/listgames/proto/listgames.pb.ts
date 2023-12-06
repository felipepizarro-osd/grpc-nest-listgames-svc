/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Game } from "./games.pb";

export const protobufPackage = "listgames";

export interface CreateListGamesRequest {
  name: string;
  gameIds: number[];
  userId: number;
  token: string;
}

export interface CreateListGamesResponse {
  status: number;
  error: string[];
  listId: number;
}

export interface AddGamesToListRequest {
  listId: number;
  gameIds: number[];
}

export interface AddGamesToListResponse {
  status: number;
  error: string[];
  listId: number;
}

export interface GetGamesInListRequest {
  listId: number;
}

export interface GetGamesInListResponse {
  status: number;
  error: string[];
  /** Use the imported Game message */
  game: Game[];
}

export interface DeleteGameFromListRequest {
  listId: number;
  gameId: number;
}

export interface DeleteGameFromListResponse {
  status: number;
  error: string[];
  listId: number;
}

export const LISTGAMES_PACKAGE_NAME = "listgames";

export interface ListGamesClient {
  createListGames(request: CreateListGamesRequest): Observable<CreateListGamesResponse>;

  addGamesToList(request: AddGamesToListRequest): Observable<AddGamesToListResponse>;

  getGamesInList(request: GetGamesInListRequest): Observable<GetGamesInListResponse>;

  deleteGameFromList(request: DeleteGameFromListRequest): Observable<DeleteGameFromListResponse>;
}

export interface ListGamesController {
  createListGames(
    request: CreateListGamesRequest,
  ): Promise<CreateListGamesResponse> | Observable<CreateListGamesResponse> | CreateListGamesResponse;

  addGamesToList(
    request: AddGamesToListRequest,
  ): Promise<AddGamesToListResponse> | Observable<AddGamesToListResponse> | AddGamesToListResponse;

  getGamesInList(
    request: GetGamesInListRequest,
  ): Promise<GetGamesInListResponse> | Observable<GetGamesInListResponse> | GetGamesInListResponse;

  deleteGameFromList(
    request: DeleteGameFromListRequest,
  ): Promise<DeleteGameFromListResponse> | Observable<DeleteGameFromListResponse> | DeleteGameFromListResponse;
}

export function ListGamesControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createListGames", "addGamesToList", "getGamesInList", "deleteGameFromList"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ListGames", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ListGames", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const LIST_GAMES_SERVICE_NAME = "ListGames";
