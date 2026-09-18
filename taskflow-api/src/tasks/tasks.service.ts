import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Task, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateTaskDto } from './dto/create-task.dto.js';
import type { UpdateTaskDto } from './dto/update-task.dto.js';
import type { TaskQueryDto } from './dto/task-query.dto.js';
import type { PaginatedResponse } from '../common/dto/pagination.dto.js';
import type { TaskStatsResponseDto } from './dto/task-response.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? TaskStatus.TODO,
        userId,
      },
    });
  }

  async findAll(
    userId: string,
    query: TaskQueryDto,
  ): Promise<PaginatedResponse<Task>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.TaskWhereInput = {
      userId,
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'desc';

    const [total, data] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(userId: string, id: string): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    await this.findOne(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    await this.findOne(userId, id);

    await this.prisma.task.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Task deleted successfully' };
  }

  async getStats(userId: string): Promise<TaskStatsResponseDto> {
    const [total, todo, inProgress, done] = await Promise.all([
      this.prisma.task.count({
        where: { userId, deletedAt: null },
      }),
      this.prisma.task.count({
        where: { userId, status: TaskStatus.TODO, deletedAt: null },
      }),
      this.prisma.task.count({
        where: { userId, status: TaskStatus.IN_PROGRESS, deletedAt: null },
      }),
      this.prisma.task.count({
        where: { userId, status: TaskStatus.DONE, deletedAt: null },
      }),
    ]);

    const completionRate = total > 0 ? Number(((done / total) * 100).toFixed(1)) : 0;

    return {
      total,
      todo,
      inProgress,
      done,
      completionRate,
    };
  }
}
