/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "listgames";

export interface CreateListGamesRequest {
  name: string;
  gameid: number;
  userId: number;
}

export interface CreateListGamesResponse {
  status: number;
  error: string[];
  listId: number;
}

export const LISTGAMES_PACKAGE_NAME = "listgames";

export interface ListGamesClient {
  createListGames(request: CreateListGamesRequest): Observable<CreateListGamesResponse>;
}

export interface ListGamesController {
  createListGames(
    request: CreateListGamesRequest,
  ): Promise<CreateListGamesResponse> | Observable<CreateListGamesResponse> | CreateListGamesResponse;
}

export function ListGamesControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createListGames"];
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
