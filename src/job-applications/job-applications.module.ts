import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobApplicationController } from './job-applications.controller';
import { JobApplicationService } from './job-applications.service';
import { JobApplication, JobApplicationSchema } from '../schemas/job-application.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JobApplication.name, schema: JobApplicationSchema },
    ]),
    AuthModule,
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
})
export class JobApplicationsModule {}
