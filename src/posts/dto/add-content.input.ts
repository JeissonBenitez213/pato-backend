import { Field, InputType } from '@nestjs/graphql';
import { AddFile } from './add-file.input';

@InputType()
export class AddContent {
  @Field(() => String, { nullable: true })
  texto?: string;

  @Field(() => [AddFile], { nullable: true })
  files?: AddFile[];
}
