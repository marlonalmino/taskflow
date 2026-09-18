import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class TaskResponseDto {
  @ApiProperty({ example: 'clx123abc' })
  id: string = '';

  @ApiProperty({ example: 'Deploy API to Render' })
  title: string = '';

  @ApiPropertyOptional({ example: 'Configure environment variables and web service' })
  description?: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  status: TaskStatus = TaskStatus.TODO;

  @ApiProperty({ example: 'clxuser456' })
  userId: string = '';

  @ApiProperty()
  createdAt: Date = new Date();

  @ApiProperty()
  updatedAt: Date = new Date();
}

export class TaskStatsResponseDto {
  @ApiProperty({ example: 25 })
  total: number = 0;

  @ApiProperty({ example: 10 })
  todo: number = 0;

  @ApiProperty({ example: 8 })
  inProgress: number = 0;

  @ApiProperty({ example: 7 })
  done: number = 0;

  @ApiProperty({ example: 28.0, description: 'Percentage of completed tasks' })
  completionRate: number = 0;
}
