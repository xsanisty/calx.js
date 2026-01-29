/**
 * Utility class for converting between Excel serial dates and JavaScript Date objects
 */
export class DateUtil {
    /**
     * Excel epoch: December 30, 1899
     * Excel uses this as day 0 for date serial numbers
     */
    private static readonly EXCEL_EPOCH = new Date(1899, 11, 30).getTime();
    private static readonly MS_PER_DAY = 24 * 60 * 60 * 1000;

    /**
     * Convert Excel serial date number to JavaScript Date object
     * @param serialDate Excel serial date number (days since Dec 30, 1899)
     * @returns JavaScript Date object
     */
    static serialToDate(serialDate: number): Date {
        if (typeof serialDate !== 'number' || isNaN(serialDate)) {
            throw new Error('Invalid serial date: must be a number');
        }

        const ms = serialDate * DateUtil.MS_PER_DAY;
        return new Date(DateUtil.EXCEL_EPOCH + ms);
    }

    /**
     * Convert JavaScript Date object to Excel serial date number
     * @param date JavaScript Date object
     * @returns Excel serial date number (days since Dec 30, 1899)
     */
    static dateToSerial(date: Date): number {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            throw new Error('Invalid date: must be a valid Date object');
        }

        const ms = date.getTime() - DateUtil.EXCEL_EPOCH;
        return Math.floor(ms / DateUtil.MS_PER_DAY);
    }

    /**
     * Check if a value is a valid Excel serial date
     * @param value Value to check
     * @returns True if value is a valid serial date number
     */
    static isValidSerialDate(value: any): boolean {
        if (typeof value !== 'number' || isNaN(value)) {
            return false;
        }

        // Excel dates are typically between 1 (Jan 1, 1900) and ~50000 (year 2036)
        // Allow negative for historical dates
        return value >= -36522 && value <= 2958465; // Years 1800-9999
    }

    /**
     * Create Excel serial date from date components
     * @param year Full year (e.g., 2024)
     * @param month Month (1-12)
     * @param day Day of month (1-31)
     * @returns Excel serial date number
     */
    static fromComponents(year: number, month: number, day: number): number {
        const date = new Date(year, month - 1, day);
        return DateUtil.dateToSerial(date);
    }

    /**
     * Get date components from Excel serial date
     * @param serialDate Excel serial date number
     * @returns Object with year, month (1-12), day, weekday (0-6, Sunday=0)
     */
    static toComponents(serialDate: number): {
        year: number;
        month: number;
        day: number;
        weekday: number;
        hours: number;
        minutes: number;
        seconds: number;
    } {
        const date = DateUtil.serialToDate(serialDate);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1, // Convert to 1-based
            day: date.getDate(),
            weekday: date.getDay(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
        };
    }

    /**
     * Format Excel serial date as ISO string (YYYY-MM-DD)
     * @param serialDate Excel serial date number
     * @returns ISO date string
     */
    static toISOString(serialDate: number): string {
        const date = DateUtil.serialToDate(serialDate);
        return date.toISOString().split('T')[0];
    }

    /**
     * Parse ISO date string (YYYY-MM-DD) to Excel serial date
     * @param isoString ISO date string
     * @returns Excel serial date number
     */
    static fromISOString(isoString: string): number {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid ISO date string: ${isoString}`);
        }
        return DateUtil.dateToSerial(date);
    }

    /**
     * Get current date as Excel serial date
     * @returns Excel serial date number for today
     */
    static today(): number {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time to midnight
        return DateUtil.dateToSerial(now);
    }

    /**
     * Get current date and time as Excel serial date (with fractional day)
     * @returns Excel serial date number for now (includes time as fraction)
     */
    static now(): number {
        return DateUtil.dateToSerial(new Date());
    }
}
