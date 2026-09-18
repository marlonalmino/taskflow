import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TaskQueryDto } from './dto/task-query.dto.js';
import {
  TaskResponseDto,
  TaskStatsResponseDto,
} from './dto/task-response.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import {
  CurrentUser,
  type JwtUser,
} from '../common/decorators/current-user.decorator.js';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get task statistics and completion rate' })
  @ApiResponse({ status: 200, type: TaskStatsResponseDto })
  async getStats(@CurrentUser() user: JwtUser): Promise<TaskStatsResponseDto> {
    return this.tasksService.getStats(user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List current user tasks with pagination and filters' })
  @ApiResponse({ status: 200, type: [TaskResponseDto] })
  async findAll(
    @CurrentUser() user: JwtUser,
    @Query() query: TaskQueryDto,
  ) {
    return this.tasksService.findAll(user.sub, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  async findOne(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
  ): Promise<TaskResponseDto> {
    return this.tasksService.findOne(user.sub, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  async create(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.create(user.sub, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  async update(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    return this.tasksService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a task' })
  @ApiResponse({ status: 200, description: 'Task soft deleted' })
  async remove(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.tasksService.remove(user.sub, id);
  }
}
