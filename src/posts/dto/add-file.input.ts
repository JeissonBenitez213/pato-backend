import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddFile {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  dir!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  file_extension!: string;
}
