import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { Badge } from './badge.entity';

@ObjectType()
export class BadgesUsers {
  @Field(() => Int)
  id_usuario!: number;

  @Field(() => Int)
  id_insignia!: number;

  @Field(() => GraphQLISODateTime)
  fecha_otorgada!: Date;

  @Field(() => Badge)
  insignia!: Badge;
}
