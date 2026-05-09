import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import * as bcrypt from 'bcrypt';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Admin login endpoint - validates credentials against env vars
   * and returns a JWT with admin role
   */
  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 attempts per minute - brute force protection
  async adminLogin(@Body() body: { email: string; password: string }) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const adminPasswordHash = this.configService.get<string>('ADMIN_PASSWORD');

    if (!adminEmail || !adminPasswordHash) {
      throw new UnauthorizedException('Admin credentials not configured');
    }

    // Validate email
    if (body.email?.trim().toLowerCase() !== adminEmail.toLowerCase()) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    // Validate password against bcrypt hash from env
    const isPasswordValid = await bcrypt.compare(
      body.password,
      adminPasswordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    // Generate admin JWT token
    const payload = {
      email: adminEmail,
      isAdmin: true,
      type: 'admin',
    };

    const token = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('JWT_SECRET') ||
        'mazzady-super-secret-jwt-key-2026',
      expiresIn: '8h', // Admin session expires in 8 hours
    });

    return {
      message: 'Admin login successful',
      token,
      expiresIn: 8 * 60 * 60, // 8 hours in seconds
    };
  }

  @Get('users')
  @UseGuards(AdminGuard)
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/stats')
  @UseGuards(AdminGuard)
  async getUsersStats() {
    return this.adminService.getUsersStats();
  }

  @Delete('users/:id')
  @UseGuards(AdminGuard)
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @Get('dashboard/stats')
  @UseGuards(AdminGuard)
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('public-stats')
  async getPublicStats() {
    return this.adminService.getPublicStats();
  }
}
