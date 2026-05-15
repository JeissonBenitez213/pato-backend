import { Field, InputType } from '@nestjs/graphql';
import { AddFile } from './add-file.input';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddContent {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: true })
  texto!: string;

  @Field(() => [AddFile], { nullable: true })
  files?: AddFile[];
}
