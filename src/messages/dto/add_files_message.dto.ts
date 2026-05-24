import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddFilesMessage {
  @Field(() => Int)
  id_mensaje!: number;

  @Field(() => String)
  dir!: string;

  @Field(() => String)
  fie_extension!: string;
}
