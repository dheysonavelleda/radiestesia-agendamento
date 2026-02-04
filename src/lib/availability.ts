import { prisma } from "@/lib/prisma";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parse,
  addMinutes,
  isBefore,
  isAfter,
  startOfDay,
  setHours,
  setMinutes,
} from "date-fns";

const SESSION_DURATION = 120; // 2 hours in minutes
const INTERVAL = 10; // 10 min between sessions
const SLOT_STEP = SESSION_DURATION + INTERVAL; // 130 min

interface TimeSlot {
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  available: boolean;
}

/**
 * Parse "HH:mm" string into { hours, minutes }
 */
function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
}

/**
 * Generate possible time slots from an availability window
 */
function generateSlots(startTime: string, endTime: string): string[] {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;

  const slots: string[] = [];
  let current = startMinutes;

  while (current + SESSION_DURATION <= endMinutes) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    current += SLOT_STEP;
  }

  return slots;
}

/**
 * Returns dates that have available slots for a given month/year
 */
export async function getAvailableDates(
  month: number,
  year: number
): Promise<string[]> {
  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(monthStart);
  const today = startOfDay(new Date());

  // Get all availability entries for this month
  const availabilities = await prisma.availability.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
      isActive: true,
    },
  });

  // Get all appointments for this month (non-cancelled)
  const appointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
      status: {
        notIn: ["CANCELLED"],
      },
    },
  });

  // Get all blocked slots for this month
  const blockedSlots = await prisma.blockedSlot.findMany({
    where: {
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
    },
  });

  const availableDates: string[] = [];

  for (const avail of availabilities) {
    const dateStr = format(avail.date, "yyyy-MM-dd");
    const availDate = startOfDay(avail.date);

    // Skip past dates
    if (isBefore(availDate, today)) continue;

    // Generate possible slots
    const possibleSlots = generateSlots(avail.startTime, avail.endTime);

    // Filter out booked slots
    const dateAppointments = appointments.filter(
      (a) => format(a.date, "yyyy-MM-dd") === dateStr
    );
    const dateBlocks = blockedSlots.filter(
      (b) => format(b.date, "yyyy-MM-dd") === dateStr
    );

    const freeSlots = possibleSlots.filter((slot) => {
      // Check if slot conflicts with existing appointment
      const slotStart = parseTime(slot);
      const slotStartMin = slotStart.hours * 60 + slotStart.minutes;
      const slotEndMin = slotStartMin + SESSION_DURATION;

      const isBooked = dateAppointments.some((appt) => {
        const apptH = appt.startTime.getHours();
        const apptM = appt.startTime.getMinutes();
        const apptStartMin = apptH * 60 + apptM;
        const apptEndMin = apptStartMin + SESSION_DURATION;
        return slotStartMin < apptEndMin && slotEndMin > apptStartMin;
      });

      // Check if slot is blocked
      const isBlocked = dateBlocks.some((block) => {
        const blockStart = parseTime(block.startTime);
        const blockEnd = parseTime(block.endTime);
        const blockStartMin = blockStart.hours * 60 + blockStart.minutes;
        const blockEndMin = blockEnd.hours * 60 + blockEnd.minutes;
        return slotStartMin < blockEndMin && slotEndMin > blockStartMin;
      });

      return !isBooked && !isBlocked;
    });

    if (freeSlots.length > 0 && !availableDates.includes(dateStr)) {
      availableDates.push(dateStr);
    }
  }

  return availableDates.sort();
}

/**
 * Returns available time slots for a specific date
 */
export async function getAvailableSlots(date: Date): Promise<TimeSlot[]> {
  const dateStr = format(date, "yyyy-MM-dd");
  const dayStart = startOfDay(date);

  // Get availability for this date
  const availabilities = await prisma.availability.findMany({
    where: {
      date: dayStart,
      isActive: true,
    },
  });

  if (availabilities.length === 0) {
    return [];
  }

  // Get existing appointments for this date (non-cancelled)
  const appointments = await prisma.appointment.findMany({
    where: {
      date: dayStart,
      status: {
        notIn: ["CANCELLED"],
      },
    },
  });

  // Get blocked slots for this date
  const blockedSlots = await prisma.blockedSlot.findMany({
    where: {
      date: dayStart,
    },
  });

  const allSlots: TimeSlot[] = [];

  for (const avail of availabilities) {
    const possibleSlots = generateSlots(avail.startTime, avail.endTime);

    for (const slot of possibleSlots) {
      const slotStart = parseTime(slot);
      const slotStartMin = slotStart.hours * 60 + slotStart.minutes;
      const slotEndMin = slotStartMin + SESSION_DURATION;
      const endH = Math.floor(slotEndMin / 60);
      const endM = slotEndMin % 60;
      const endTimeStr = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

      // Check if booked
      const isBooked = appointments.some((appt) => {
        const apptH = appt.startTime.getHours();
        const apptM = appt.startTime.getMinutes();
        const apptStartMin = apptH * 60 + apptM;
        const apptEndMin = apptStartMin + SESSION_DURATION;
        return slotStartMin < apptEndMin && slotEndMin > apptStartMin;
      });

      // Check if blocked
      const isBlocked = blockedSlots.some((block) => {
        const blockStart = parseTime(block.startTime);
        const blockEnd = parseTime(block.endTime);
        const blockStartMin = blockStart.hours * 60 + blockStart.minutes;
        const blockEndMin = blockEnd.hours * 60 + blockEnd.minutes;
        return slotStartMin < blockEndMin && slotEndMin > blockStartMin;
      });

      allSlots.push({
        startTime: slot,
        endTime: endTimeStr,
        available: !isBooked && !isBlocked,
      });
    }
  }

  return allSlots;
}
