import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { ListgamesController } from '../listgames.controller';
import { ListgamesService } from '../listgames.service';
import { Listgames } from '../listgames.entity'
import {AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME} from '../proto/auth.pb'
import { GAMES_PACKAGE_NAME, GAMES_SERVICE_NAME } from '../proto/games.pb';

describe('ListgamesController', () => {
  let controller: ListgamesController;
  let service: ListgamesService;
  let repository: Repository<Listgames>;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
      ],
      providers: [
        ListgamesController,
        ListgamesService,
        {
          provide: getRepositoryToken(Listgames),
          useClass: Repository,
        },
        {
            provide: AUTH_PACKAGE_NAME,
            useClass: Repository,
        },
        {
            provide: GAMES_PACKAGE_NAME,
            useClass: Repository,
        },
        {
            provide: GAMES_SERVICE_NAME,
            useClass: Repository,
        },
        {
            provide: AUTH_SERVICE_NAME,
            useClass: Repository,
        }
      ],
    }).compile();

    controller = module.get<ListgamesController>(ListgamesController);
    service = module.get<ListgamesService>(ListgamesService);
    repository = module.get<Repository<Listgames>>(getRepositoryToken(Listgames));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a CreateListResponse', () =>{
    const data = {
      userId: 1,
      name: "test",
      gameIds: [1, 2, 3],
    };
    const response = {
      status: HttpStatus.OK,
      error: [],
      listId: 1,
    };
    jest.spyOn(service, 'createListGames').mockImplementation(async () => response);
    expect(controller.createListGames(data)).resolves.toEqual(response);
  })

  it('should return a GetListResponse', () =>{
    const data = {
      listId: 1,
    };
    const response = {
      status: HttpStatus.OK,
      error: [],
      game: null,
    };
    jest.spyOn(service, 'getGamesInList').mockImplementation(async () => response);
    expect(controller.getGamesInList(data)).resolves.toEqual(response);
  });
/*
  it('should return a AddGamesToListResponse', () => {
    const listGame: Listgames = new Listgames();
    listGame.id = 1;
    listGame.name = "test";
    listGame.userId = 1;
    listGame.gamesIds = [1];

    const data = {
      listId: 1,
      gameIds: [1],
    };

    const response = {
      status: HttpStatus.OK,
      error: [],
      listId: 1,
    };

    class Game {
        id: number;
        name: string;
        backgroundImages: string;
        description: string;
        released: string;
        metacritic: string;
    }
      
    const mockGame = new Game();
    mockGame.id = 1;
    mockGame.name = "test";
    mockGame.backgroundImages= "test";
    mockGame.description = "test";
    mockGame.released = "test";
    mockGame.metacritic = "test";   
    const gameService = {
        getGame: jest.fn(),
        // Add other methods as needed
    };

    jest.spyOn(gameService, 'getGame').mockImplementation(() => Promise.resolve(mockGame));
    jest.spyOn(repository, 'findOne').mockImplementation(()=> Promise.resolve(listGame));
    jest.spyOn(repository, 'save').mockImplementation(()=> Promise.resolve(listGame));
    expect(controller.addGamesToList(data)).resolves.toEqual(response);
  });
  */
});