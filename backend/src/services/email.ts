import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "CeylonPrivé Travels <onboarding@resend.dev>";
const GUIDE_EMAIL = process.env.GUIDE_EMAIL ?? "anjulaperera98@gmail.com";
const REPLY_TO = process.env.FROM_EMAIL ?? "anjulaperera98@gmail.com";

const tempCusEmail = "anjulaperera98@gmail.com"; //remove after configuring domains in resend, then use customer email

// ── Send itinerary to customer ────────────────────────────────
export const sendItineraryEmail = async (
  customerEmail: string,
  customerName: string,
  itinerary: {
    title: string;
    summary: string;
    duration: number;
    highlights: string[];
    days: Array<{
      day: number;
      title: string;
      location: string;
      description: string;
      activities: string[];
      accommodation: string;
      meals: string[];
      travelTime?: string;
    }>;
    bestTimeToVisit: string;
  },
): Promise<void> => {
  const daysHtml = itinerary.days
    .map(
      (day) => `
      <div style="margin-bottom:32px;border-left:2px solid #C9A84C;padding-left:20px;">
        <div style="color:#C9A84C;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">
          Day ${day.day}
        </div>
        <h3 style="color:#F5F0E8;font-size:20px;font-weight:300;margin:0 0 4px 0;">${day.title}</h3>
        <div style="color:#C9A84C;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">
          📍 ${day.location}${day.travelTime ? ` · ${day.travelTime}` : ""}
        </div>
        <p style="color:#D4C9B0;font-size:14px;line-height:1.7;margin:0 0 16px 0;">${day.description}</p>
        <div style="margin-bottom:12px;">
          <div style="color:#C9A84C;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Activities</div>
          ${day.activities.map((a) => `<div style="color:#D4C9B0;font-size:13px;padding:3px 0;">✦ ${a}</div>`).join("")}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px;">
          <div>
            <div style="color:#C9A84C;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Stay</div>
            <div style="color:#D4C9B0;font-size:13px;">${day.accommodation}</div>
          </div>
          <div>
            <div style="color:#C9A84C;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">Dining</div>
            ${day.meals.map((m) => `<div style="color:#D4C9B0;font-size:13px;">${m}</div>`).join("")}
          </div>
        </div>
      </div>
    `,
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0A0F1E;font-family:'Georgia',serif;">
      <div style="max-width:680px;margin:0 auto;padding:40px 20px;">

        <!-- Header -->
        <div style="text-align:center;margin-bottom:48px;padding-bottom:32px;border-bottom:1px solid rgba(201,168,76,0.2);">
          <div style="font-size:28px;letter-spacing:8px;color:#C9A84C;font-weight:300;">CeylonPrivé</div>
          <div style="font-size:10px;letter-spacing:5px;color:#D4C9B0;text-transform:uppercase;margin-top:4px;">Travels</div>
        </div>

        <!-- Greeting -->
        <div style="margin-bottom:32px;">
          <p style="color:#D4C9B0;font-size:14px;line-height:1.8;">Dear ${customerName},</p>
          <p style="color:#D4C9B0;font-size:14px;line-height:1.8;">
            Thank you for using our AI Travel Concierge. Here is your personalised Sri Lanka itinerary.
            Please note this is an <strong style="color:#F5F0E8;">AI-generated estimate</strong> — 
            actual experiences, availability and scheduling may vary. Our guide will work with you personally
            to refine every detail.
          </p>
        </div>

        <!-- Itinerary Title -->
        <div style="margin-bottom:40px;padding:32px;background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.2);">
          <div style="font-size:11px;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;margin-bottom:12px;">Your Itinerary</div>
          <h1 style="color:#F5F0E8;font-size:32px;font-weight:300;margin:0 0 16px 0;">${itinerary.title}</h1>
          <p style="color:#D4C9B0;font-size:14px;line-height:1.7;margin:0 0 20px 0;">${itinerary.summary}</p>
          <div style="display:flex;gap:24px;flex-wrap:wrap;">
            <span style="color:#D4C9B0;font-size:13px;">🗓️ ${itinerary.duration} days</span>
            <span style="color:#D4C9B0;font-size:13px;">☀️ Best time: ${itinerary.bestTimeToVisit}</span>
          </div>
          <div style="margin-top:20px;">
            ${itinerary.highlights.map((h) => `<span style="display:inline-block;border:1px solid rgba(201,168,76,0.3);color:#C9A84C;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;margin:4px 4px 0 0;">${h}</span>`).join("")}
          </div>
        </div>

        <!-- Days -->
        <div style="margin-bottom:48px;">
          <div style="font-size:11px;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;margin-bottom:24px;">Day by Day</div>
          ${daysHtml}
        </div>

        <!-- Disclaimer -->
        <div style="padding:20px;border:1px solid rgba(201,168,76,0.2);background:rgba(201,168,76,0.03);margin-bottom:40px;">
          <p style="color:#D4C9B0;font-size:12px;line-height:1.7;margin:0;">
            <strong style="color:#C9A84C;">Important:</strong> This itinerary is an AI-generated draft and is subject to change
            based on weather, availability, your preferences, and local conditions. Our guide will personalise
            every detail with you before your journey begins.
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin-bottom:48px;">
          <p style="color:#D4C9B0;font-size:14px;margin-bottom:20px;">Ready to make this journey a reality?</p>
          <a href="${process.env.FRONTEND_URL}" 
             style="display:inline-block;background:#C9A84C;color:#0A0F1E;padding:14px 36px;text-decoration:none;font-size:12px;letter-spacing:3px;text-transform:uppercase;">
            Contact Our Guide
          </a>
        </div>

        <!-- Footer -->
        <div style="text-align:center;border-top:1px solid rgba(201,168,76,0.1);padding-top:24px;">
          <div style="color:#C9A84C;font-size:16px;letter-spacing:4px;margin-bottom:8px;">CeylonPrivé</div>
          <p style="color:#D4C9B0;opacity:0.4;font-size:11px;margin:0;">
            Colombo, Sri Lanka · hello@ceylonprive.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to: tempCusEmail,
    subject: `Your CeylonPrivé Itinerary: ${itinerary.title}`,
    html,
  });
};

// ── Notify guide of new contact submission ────────────────────
export const sendEnquiryNotification = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  tripType?: string;
  groupSize?: number;
  duration?: number;
  message?: string;
  interests: string[];
  hasAiPlan: boolean;
}): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0A0F1E;font-family:sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="font-size:20px;letter-spacing:6px;color:#C9A84C;">CeylonPrivé</div>
          <div style="font-size:10px;letter-spacing:4px;color:#D4C9B0;text-transform:uppercase;margin-top:4px;">New Enquiry</div>
        </div>

        <div style="border:1px solid rgba(201,168,76,0.2);padding:24px;background:#141929;margin-bottom:24px;">
          <h2 style="color:#F5F0E8;font-size:20px;font-weight:400;margin:0 0 16px 0;">
            New enquiry from ${data.firstName} ${data.lastName}
          </h2>
          ${data.hasAiPlan ? `<div style="display:inline-block;border:1px solid rgba(201,168,76,0.4);color:#C9A84C;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:4px 10px;margin-bottom:16px;">✦ Includes AI Itinerary</div>` : ""}

          <table style="width:100%;border-collapse:collapse;">
            ${[
              ["Email", data.email],
              data.phone ? ["Phone", data.phone] : null,
              data.country ? ["Country", data.country] : null,
              data.tripType ? ["Trip Type", data.tripType] : null,
              data.groupSize ? ["Group Size", String(data.groupSize)] : null,
              data.duration ? ["Duration", `${data.duration} days`] : null,
              data.interests.length > 0
                ? ["Interests", data.interests.join(", ")]
                : null,
            ]
              .filter(Boolean)
              .map(
                (row) => `
              <tr>
                <td style="color:#C9A84C;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:8px 0;border-bottom:1px solid rgba(201,168,76,0.1);width:120px;">
                  ${row![0]}
                </td>
                <td style="color:#D4C9B0;font-size:13px;padding:8px 0;border-bottom:1px solid rgba(201,168,76,0.1);">
                  ${row![1]}
                </td>
              </tr>
            `,
              )
              .join("")}
          </table>

          ${
            data.message
              ? `
            <div style="margin-top:16px;">
              <div style="color:#C9A84C;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Message</div>
              <p style="color:#D4C9B0;font-size:13px;line-height:1.7;margin:0;">${data.message}</p>
            </div>
          `
              : ""
          }
        </div>

        <div style="text-align:center;">
          <a href="${process.env.FRONTEND_URL}/dashboard/contacts"
             style="display:inline-block;background:#C9A84C;color:#0A0F1E;padding:12px 28px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;">
            View in Dashboard
          </a>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM,
    replyTo: data.email,
    to: GUIDE_EMAIL,
    subject: `New Enquiry: ${data.firstName} ${data.lastName} — CeylonPrivé`,
    html,
  });
};
