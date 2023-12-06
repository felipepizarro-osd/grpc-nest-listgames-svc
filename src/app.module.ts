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
      port: 5432,
      database: 'micro_gamelist',
      username: 'postgres',
      password: "0605",
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    ListgamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
