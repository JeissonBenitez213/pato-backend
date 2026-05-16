import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Badge {
  @Field(() => Int)
  id_insignia!: number;

  @Field(() => String)
  nombre!: string;

  @Field(() => String, { nullable: true })
  descripcion!: string | null;

  @Field(() => String, { nullable: true })
  icono!: string | null;
}
