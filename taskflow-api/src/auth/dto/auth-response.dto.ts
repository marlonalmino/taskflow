import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...' })
  access_token: string = '';
}

export class UserResponseDto {
  @ApiProperty({ example: 'clxxxxxx' })
  id: string = '';

  @ApiProperty({ example: 'John Doe' })
  name: string = '';

  @ApiProperty({ example: 'john@example.com' })
  email: string = '';

  @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN'] })
  role: string = '';

  @ApiProperty()
  createdAt: Date = new Date();
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation successful' })
  message: string = '';
}
