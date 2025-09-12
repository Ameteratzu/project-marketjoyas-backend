import { Module } from '@nestjs/common';
import { OcasionController } from './ocasion.controller';
import { OcasionService } from './ocasion.service';

@Module({
  controllers: [OcasionController],
  providers: [OcasionService]
})
export class OcasionModule {}
