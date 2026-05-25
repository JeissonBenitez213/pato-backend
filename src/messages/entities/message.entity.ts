import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Message {
  @Field(() => Int)
  id_mensaje!: number;

  @Field(() => Int)
  id_usuario_envia!: number;

  @Field(() => Int)
  id_usuario_recibe!: number;

  @Field(() => String)
  texto!: string;

  @Field(() => Boolean)
  editado!: boolean;

  @Field(() => GraphQLISODateTime)
  fecha!: Date;

  @Field(() => Boolean)
  leido!: boolean;

  @Field(() => User)
  envia!: User;

  @Field(() => User)
  recibe!: User;
}
