import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetResolver } from './pet.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { PetListener } from './pet.listener';

@Module({
  providers: [PetResolver, PetService, PrismaService, PetListener],
})
export class PetModule {}
