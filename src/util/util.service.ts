import { Injectable } from '@nestjs/common';

export interface ListData {
  page?: number;
  entries?: any[];
  total?: number;
}

export interface ListResponse {
  success: boolean;
  page: number;
  entries: any[];
  total: number;
}

@Injectable()
export class UtilService {
  public responseOne(data: any): { success: boolean; entry: any } {
    return {
      success: true,
      entry: data,
    };
  }

  public responseMany(data: ListData): ListResponse {
    return {
      success: true,
      page: data.page,
      entries: data.entries,
      total: data.total,
    };
  }
}
