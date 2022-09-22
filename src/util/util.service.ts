import { Injectable } from '@nestjs/common';

export interface ListData {
  page?: number;
  limit?: number;
  entries?: any[];
  total?: number;
}

export interface ListResponseType {
  success: boolean;
  page?: number;
  limit?: number;
  total?: number;
  entries: any[];
}

export interface SingleResponseType {
  success: boolean;
  entry: any;
  message?: string;
}

@Injectable()
export class UtilService {
  public responseOne(data?: any, message?: string): SingleResponseType {
    return {
      success: true,
      entry: data,
      message,
    };
  }

  public responseMany(data: ListData): ListResponseType {
    return {
      success: true,
      page: data.page,
      limit: data.limit,
      total: data.total,
      entries: data.entries,
    };
  }
}
