import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Comentario } from './comentario.entity';

@ObjectType()
export class ComentarioReactions {
  @Field(() => Int)
  id_reaction!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => Int)
  id_comment!: number;

  @Field(() => Boolean)
  commented!: boolean;

  @Field(() => Boolean)
  like!: boolean;

  @Field(() => Boolean)
  share!: boolean;

  @Field(() => GraphQLISODateTime)
  time_in!: Date;

  @Field(() => Comentario)
  comment!: Comentario;
}
