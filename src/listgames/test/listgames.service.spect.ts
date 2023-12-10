import { Test, TestingModule} from '@nestjs/testing';
import { ListgamesService } from '../listgames.service';
import { Repository } from 'typeorm';
import { Listgames } from '../listgames.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from '../proto/auth.pb';
import { GAMES_PACKAGE_NAME, GAMES_SERVICE_NAME } from '../proto/games.pb';
import { HttpStatus } from '@nestjs/common';
import { ListGamesRequestDto } from '../listgames.dto';

describe('ListgamesService', () => {
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
        service = module.get<ListgamesService>(ListgamesService);
        repository = module.get<Repository<Listgames>>(getRepositoryToken(Listgames));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a list of games', async () => {
        const listgames: Listgames = new Listgames();
        listgames.userId = 1;
        listgames.name = "test"
        listgames.gamesIds = null;

        const data: ListGamesRequestDto ={
            userId: listgames.userId,
            name: listgames.name,
            gameIds: listgames.gamesIds,
        }
        const result ={
            status: HttpStatus.OK,
            error: [],
            listId: listgames.id,
        }
        jest.spyOn(repository, 'save').mockResolvedValueOnce(listgames);
        expect(await service.createListGames(data)).toEqual(result);
    });

    it('should add a game to a list', async () => {
        const listgames: Listgames = new Listgames();
        listgames.userId = 1;
        listgames.name = "test"
        listgames.gamesIds = null;

        const data: ListGamesRequestDto ={
            userId: listgames.userId,
            name: listgames.name,
            gameIds: listgames.gamesIds,
        }
        const result ={
            status: HttpStatus.OK,
            error: [],
            listId: listgames.id,
        }
        jest.spyOn(repository, 'save').mockResolvedValueOnce(listgames);
        expect(await service.createListGames(data)).toEqual(result);
    });
});