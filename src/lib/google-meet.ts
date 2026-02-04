import { google } from "googleapis";

/**
 * Create a Google Calendar event with Google Meet link
 */
export async function createMeetLink(
  title: string,
  startTime: Date,
  endTime: Date,
  attendeeEmail: string
): Promise<string> {
  // Authenticate using service account or OAuth refresh token
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  // If using OAuth refresh token instead of service account
  let authClient;
  if (process.env.GOOGLE_REFRESH_TOKEN) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
    authClient = oauth2Client;
  } else {
    authClient = await auth.getClient();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendar = google.calendar({
    version: "v3",
    auth: authClient as any,
  });

  const event = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: title,
      description: "Sessão de Radiestesia Terapêutica com Joana Savi",
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "America/Sao_Paulo",
      },
      attendees: [{ email: attendeeEmail }],
      conferenceData: {
        createRequest: {
          requestId: `radiestesia-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  });

  const meetLink = event.data.conferenceData?.entryPoints?.find(
    (ep) => ep.entryPointType === "video"
  )?.uri;

  if (!meetLink) {
    throw new Error("Failed to create Google Meet link");
  }

  return meetLink;
}
