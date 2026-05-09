import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';
import { User, UserSchema } from '../schemas/user.schema';
import { MoneyRequest, MoneyRequestSchema } from '../schemas/money-request.schema';
import { CustomerSupport, CustomerSupportSchema } from '../schemas/customer-support.schema';
import { JobApplication, JobApplicationSchema } from '../schemas/job-application.schema';
import { AuctionProduct, AuctionProductSchema } from '../schemas/auction-product.schema';
import { Auction, AuctionSchema } from '../schemas/auction.schema';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'mazzady-super-secret-jwt-key-2026',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MoneyRequest.name, schema: MoneyRequestSchema },
      { name: CustomerSupport.name, schema: CustomerSupportSchema },
      { name: JobApplication.name, schema: JobApplicationSchema },
      { name: AuctionProduct.name, schema: AuctionProductSchema },
      { name: Auction.name, schema: AuctionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
  exports: [AdminService],
})
export class AdminModule {}
