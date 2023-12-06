import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../interfaces/jwtpayload.interface";

export const createJwt =( payload: JwtPayload, jwtService: JwtService): string => {
    return jwtService.sign(payload);
}