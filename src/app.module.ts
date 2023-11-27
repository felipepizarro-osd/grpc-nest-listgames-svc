import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListgamesModule } from './listgames/listgames.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5431,
      database: 'micro_gamelist',
      username: 'felipepizarro',
      password: null,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    ListgamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
