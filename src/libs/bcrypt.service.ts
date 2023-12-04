import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    constructor(private configService: ConfigService) {}
    async hash(password: string | Buffer) {
        return await bcrypt.hash(password, this.configService.get('auth.saltOrRounds'));
    }
    async compare(data: string | Buffer, encrypted: string) {
        return await bcrypt.compare(data, encrypted);
    }
}
