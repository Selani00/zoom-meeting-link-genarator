import fetch from "node-fetch";
import base64 from "base-64";
import dotenv from 'dotenv';
import * as process from "process";

dotenv.config();

const zoomAccountId = process.env.ZOOM_ACCOUNT_ID;
const zoomClientId = process.env.ZOOM_CLIENT_ID;
const zoomClientSecret = process.env.ZOOM_CLIENT_SECRET;

const getAuthHeaders = () => {
  return {
    Authorization: `Basic ${base64.encode(
      `${zoomClientId}:${zoomClientSecret}`
    )}`,
    "Content-Type": "application/json",
  };
};

const generateZoomAccessToken = async () => {
  try {
    console.log(zoomAccountId, zoomClientId, zoomClientSecret);
    const response = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          grant_type: "account_credentials",
          account_id: zoomAccountId,
        }),
      }
    );

    const jsonResponse = await response.json();

    console.log(`Generated Accesstoken ${jsonResponse.access_token}\n\n`);
    // console.log("Generated Token Type"+jsonResponse.token_type);
    // console.log("Generated Refresh Token"+jsonResponse.scope);
    return jsonResponse?.access_token;
  } catch (err) {
    console.log(err);
  }
};

const generateZoomMeeting = async (meeting_topic, emailList, startTime, duration,meeting_password) => {
  try {
    const zoomAccessToken = await generateZoomAccessToken();
    const response = await fetch(`https://api.zoom.us/v2/users/didisela00@gmail.com/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${zoomAccessToken}`,
      },
      body: JSON.stringify({
        agenda: "My Meeting",
        default_password: false,
        duration: 60,
        password: "123456", // for joining the meeting
        settings: {additional_data_center_regions: [
          'TY'
        ],
          allow_multiple_devices: true,
          approval_type: 2,
          audio_conference_info: 'test',
          calendar_type: 1,
          contact_email: "pkselani00@gmail.com",
          contact_name: "Jill Chill",
          email_notification: true,
          encryption_type: "enhanced_encryption",
          join_before_host: false, // join before host
          meeting_authentication: true,
          meeting_invitees: [
            {
              email: "nawomabhee22@gmail.com",
            },
            {
              email: "pkselani00@gmail.com",
            },
          ],
          mute_upon_entry: true,
          participant_video: false,
          private_meeting: true,
          registrants_confirmation_email: true,
          registrants_email_notification: true,
          waiting_room: false,
          watermark: false,
        },
        start_time: '2025-02-20T17:32:55Z',
        timezone: "Asia/Kolkata",
        topic: "My Meeting which can see",
        type: 2, // 1 -> instant meeting, 2 -> scheduled meeting
      }),
    });

    const jsonResponse = await response.json();
    if (!response.ok) {
      console.log("Error creating meeting:", jsonResponse);
    } else {
      console.log("Meeting link generated:", jsonResponse.join_url);
    }

    return jsonResponse.join_url;
    // console.log("generate zoom meeting " + jsonResponse.join_url);
  } catch (error) {
    console.log(error);
  }
};

export default generateZoomMeeting;
