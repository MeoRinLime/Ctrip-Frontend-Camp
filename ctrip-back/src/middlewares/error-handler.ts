import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = '服务器内部错误';
  let isOperational = false;

  // 如果是我们自己定义的错误类型
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // 记录错误信息
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    statusCode,
    isOperational,
    body: req.body,
    query: req.query,
  });

  // 区分操作性错误和程序性错误
  if (!isOperational) {
    message = '服务器内部错误'; // 非操作性错误不暴露详细信息
  }

  // 发送错误响应
  res.status(statusCode).json({
    success: false,
    message,
    // 开发环境下返回堆栈信息
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
