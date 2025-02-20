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
    return jsonResponse?.access_token;
  } catch (err) {
    console.log(err);
  }
};

const generateZoomMeeting = async (meeting_topic, emailList, startTime, duration,meeting_password) => {
  try {
    const zoomAccessToken = await generateZoomAccessToken();
    const response = await fetch(`https://api.zoom.us/v2/users/me/meetings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${zoomAccessToken}`,
      },
      body: JSON.stringify({
        agenda: meeting_topic,
        default_password: false,
        duration: duration,
        password: meeting_password.toString(), // for joining the meeting
        settings: {additional_data_center_regions: [
          'TY'
        ],
          allow_multiple_devices: false,
          // alternative_hosts: host,
          // alternative_hosts_email_notification: true,
          // approval_type: 2,
          registration_type: 1, // Require registration
          approval_type: 1, // Auto-approve registrants
          authentication_options: {
            action: "allow",
            type: "signature" // Verify email matches registrant
          },
          audio_conference_info: 'test',
          calendar_type: 1,
          contact_email: "pkselani00@gmail.com",
          contact_name: "selani didulani",
          email_notification: true,
          encryption_type: "enhanced_encryption",
          join_before_host: true,
          meeting_authentication: true,
          meeting_invitees: emailList.map(email => ({ email: email })), 
          mute_upon_entry: true,
          participant_video: false,
          private_meeting: true, // private meeting
          registrants_confirmation_email: true,
          registrants_email_notification: true,
          waiting_room: false,// should be false
          watermark: false,

        },
        start_time: startTime,
        timezone: 'Asia/Colombo',
        topic: meeting_topic,
        type: 2, // 1 -> instant meeting, 2 -> scheduled meeting
      }),
    });


     const jsonResponse = await response.json();
    if (!response.ok) {
      console.log("Error creating meeting:", jsonResponse);
    } else {
      console.log("Meeting link generated:", jsonResponse.join_url);

      console.log(`/n meeting data ${jsonResponse}`);
    }

    return jsonResponse.join_url;
  } catch (error) {
    console.log(error);
  }
};

export default generateZoomMeeting;

    // const meetingData = await response.json();
    // if (!response.ok) throw meetingData;

    // const meetingId = meetingData.id;

    // // 2. Add allowed emails as registrants
    // for (const email of emailList) {
    //   await fetch(`https://api.zoom.us/v2/meetings/${meetingId}/registrants`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${zoomAccessToken}`,
    //     },
    //     body: JSON.stringify({
    //       email: email,
    //       first_name: "Participant", // Required field
    //       last_name: " "
    //     }),
    //   });
    // }

    // return meetingData.join_url;
