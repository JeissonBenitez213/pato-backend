import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FileInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  dir!: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  file_extension!: string;
}
