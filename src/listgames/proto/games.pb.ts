/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "games";

export interface Game {
  id: number;
  name: string;
  backgroundImages: string;
  description: string;
  released: string;
  metacritic: string;
}

export interface CreateGameRequest {
  name: string;
  backgroundImages: string;
  description: string;
  released: string;
  metacritic: string;
}

export interface CreateGameResponse {
  status: number;
  error: string[];
  id: number;
}

export interface GetGameRequest {
  id: number;
}

export interface GetGameResponse {
  status: number;
  error: string[];
  game: Game | undefined;
}

export const GAMES_PACKAGE_NAME = "games";

export interface GamesServiceClient {
  getGame(request: GetGameRequest): Observable<GetGameResponse>;

  createGame(request: CreateGameRequest): Observable<CreateGameResponse>;
}

export interface GamesServiceController {
  getGame(request: GetGameRequest): Promise<GetGameResponse> | Observable<GetGameResponse> | GetGameResponse;

  createGame(
    request: CreateGameRequest,
  ): Promise<CreateGameResponse> | Observable<CreateGameResponse> | CreateGameResponse;
}

export function GamesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getGame", "createGame"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("GamesService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("GamesService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const GAMES_SERVICE_NAME = "GamesService";
