import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Comentario } from 'src/comments/entities/comentario.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Follow } from './follow.entity';
import { BadgesUsers } from 'src/badges/entities/badgesUsers.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id_usuario!: number;

  @Field(() => String)
  nombre_usuario!: string;

  @Field(() => String, { nullable: true })
  email!: string | null;

  @Field(() => String, { nullable: true })
  descripcion!: string | null;

  @Field(() => GraphQLISODateTime)
  fecha_registro!: Date;

  @Field(() => String)
  avatar!: String;

  @Field(() => Boolean)
  is_admin!: boolean;

  @Field(() => [Post], { nullable: true })
  posts!: Post[] | null;

  @Field(() => [Comentario], { nullable: true })
  comentarios!: Comentario[] | null;

  @Field(() => [Follow], { nullable: true })
  siguiendo!: Follow[] | null;

  @Field(() => [Follow], { nullable: true })
  seguidores!: Follow[] | null;

  @Field(() => [BadgesUsers], { nullable: true })
  insignias!: BadgesUsers[] | null;
}
