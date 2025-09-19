import { Module } from '@nestjs/common';
import { SerieCorrelativoBController } from './serie-correlativo-b.controller';
import { SerieCorrelativoBService } from './serie-correlativo-b.service';

@Module({
  controllers: [SerieCorrelativoBController],
  providers: [SerieCorrelativoBService]
})
export class SerieCorrelativoBModule {}
