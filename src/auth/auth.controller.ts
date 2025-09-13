//auth.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';


@Controller('auth')
export class AuthController {
    constructor (private readonly authService : AuthService){}

    @Post('login')
    async login(@Body() loginDto: LoginDto){

        const {email, password} = loginDto;
        return this.authService.login(email,password);
    }

}
