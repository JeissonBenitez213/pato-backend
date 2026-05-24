import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FilesMessage {
  @Field(() => Int)
  id_file!: number;

  @Field(() => Int)
  id_mensaje!: number;

  @Field(() => String)
  dir!: string;

  @Field(() => String)
  fie_extension!: string;
}
