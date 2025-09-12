import { Module } from '@nestjs/common';
import { GemaController } from './gema.controller';
import { GemaService } from './gema.service';

@Module({
  controllers: [GemaController],
  providers: [GemaService]
})
export class GemaModule {}
