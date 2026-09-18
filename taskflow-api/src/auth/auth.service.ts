import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { User } from '@prisma/client';

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ message: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
      },
    });

    return { message: 'Registration successful' };
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenPair(user);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      // If token was used but expired or doesn't exist, possible reuse attack
      if (storedToken) {
        // Revoke entire token family
        await this.prisma.refreshToken.deleteMany({
          where: { family: storedToken.family },
        });
      }
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Delete the used token (rotation)
    await this.prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // Generate new pair with same family
    return this.generateTokenPair(storedToken.user, storedToken.family);
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    if (refreshToken) {
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (storedToken) {
        // Revoke entire family on logout
        await this.prisma.refreshToken.deleteMany({
          where: { family: storedToken.family },
        });
      }
    }

    return { message: 'Logged out successfully' };
  }

  async getProfile(
    userId: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const { passwordHash: _, ...profile } = user;
    return profile;
  }

  private async generateTokenPair(
    user: User,
    family?: string,
  ): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload);

    const tokenFamily = family ?? uuidv4();
    const refreshTokenValue = uuidv4();
    const expirationDays = this.configService.get<number>(
      'REFRESH_TOKEN_EXPIRATION_DAYS',
      7,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId: user.id,
        family: tokenFamily,
        expiresAt,
      },
    });

    return { access_token, refresh_token: refreshTokenValue };
  }
}
