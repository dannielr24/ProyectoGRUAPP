import { Injectable } from '@angular/core';
import { timestamp } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
    private logsKey = 'appLogs';
    
  log(message: string): void {
    this.saveLog(`[LOG] ${message}`);
  }

  error(message: string): void {
    this.saveLog(`[ERROR] ${message}`);
  }

  warn(message: string): void {
    this.saveLog(`[WARNING] ${message}`);
  }

  private saveLog(message: string): void {
    const currentLogs = this.getLogs();
    currentLogs.push({ message, timestamp: new Date().toISOString() });
    localStorage.setItem(this.logsKey, JSON.stringify(currentLogs));
  }

  getLogs(): Array<{ message: string; timestamp: string}> {
    const logs = localStorage.getItem(this.logsKey);
    return logs ? JSON.parse(logs) : [];
  }

  clearLogs(): void {
    localStorage.removeItem(this.logsKey);
  }
}
