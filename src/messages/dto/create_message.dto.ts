import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FilesMessage } from '../entities/files_message.entity';
import { AddFilesMessage } from './add_files_message.dto';

@InputType()
export class CreateMessage {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_usuario_envia!: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  id_usuario_recibe!: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  texto!: string;

  @IsArray()
  @IsOptional()
  @Field(() => [AddFilesMessage], { nullable: true })
  files?: AddFilesMessage[];
}
