import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from 'src/global/interfaces/jwtpayload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>{
    const request = context.switchToHttp().getRequest();

    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    if(type != 'Bearer'){
      throw new UnauthorizedException('No tiene autorizacion para acceder aquí');
    }

    try {
      const payload = await this.jwtService
      .verifyAsync<JwtPayload>(
        token,
        {secret: process.env.JWT_SEED}
      )

      if(!payload.id){
        throw new UnauthorizedException('No se recibió información de usuario');
      }
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }
}
