import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor(private configService: ConfigService) { }
  async hash(password: string | Buffer) {
    return await bcrypt.hash(password, this.configService.get('saltOrRounds'));
  }
  async compare(data: string | Buffer, encrypted: string) {
    return await bcrypt.compare(data, encrypted);
  }
}