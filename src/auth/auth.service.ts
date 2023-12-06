/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Usuario } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt";
import { Logindto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response.interface';
import { createJwt } from 'src/global/tools/create_jwt.tool';
import { JwtService } from '@nestjs/jwt';
import { ListResponse } from './interfaces/list-response.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Usuario.name) private usuarioRepository: Model<Usuario>,
    private jwtService: JwtService
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      createUsuarioDto.password = bcrypt.hashSync(createUsuarioDto.password, 10);

      const newUsuario = new this.usuarioRepository(createUsuarioDto);
      const usuario = (await newUsuario.save()).toJSON();
      // await newUsuario.save();
      // const usuario = Usuario.toJSON();

      return usuario;
    } catch (error) {
      console.log(error);
      if (error.code == 11000) {
        throw new BadRequestException(`${createUsuarioDto.email} ya registrado`)
      }

      throw new InternalServerErrorException('Mi primera chamba');
    }
  }

  async login(Logindto: Logindto): Promise<LoginResponse> {
    let { email, password } = Logindto;
    const usuario = await this.usuarioRepository.findOne(
      {
        email: email,
        // email, toma como nombre de atributo y su valor como valor a mandar
      });

    if (!usuario) {
      throw new NotFoundException(`No se encontró usuario con el email putito ${email}`);
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      throw new UnauthorizedException('La contraseña del usuario es bien incorrecta perrín');
    }

    const { password: _, ...user } = usuario.toJSON();

    return {
      usuario: user,
      token: createJwt({
        id: usuario.id
      },
        this.jwtService
      )
    };
  }

  async findAll(): Promise<ListResponse> {
    const usuarios = await this.usuarioRepository.find();
    return {
      usuarios: usuarios,
      token: createJwt({id:=
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
