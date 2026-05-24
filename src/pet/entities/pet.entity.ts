import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class Pet {
  @Field(() => Int)
  id_mascota!: number;

  @Field(() => Int)
  id_usuario!: number;

  @Field(() => Int)
  nivel_actual!: number;

  @Field(() => Int)
  puntos_experiencia!: number;

  @Field(() => GraphQLISODateTime)
  fecha_ultima_evolucion!: Date;
}
