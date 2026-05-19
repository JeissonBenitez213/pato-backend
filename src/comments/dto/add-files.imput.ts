import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddFiles {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  dir!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  file_extension!: string;
}
