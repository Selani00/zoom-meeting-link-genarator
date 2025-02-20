import express from 'express';
import generateZoomMeeting from '../zoom/zoom_service.js';

let router = express.Router();

router.post('/create-meeting', async (req, res) => {
    try {
        console.log('Creating Zoom meeting...');
        const { meeting_topic, emailList, startTime, duration,meeting_password } = req.body;
        const meetingLink = await generateZoomMeeting(meeting_topic, emailList, startTime, duration,meeting_password);

        if (!meetingLink) {
            throw new Error('Failed to create Zoom meeting');
        }

        res.json({
            message : 'Zoom meeting created successfully',
            data : meetingLink
        });
    } catch (error) {
        console.error('Error creating Zoom meeting:', error);
        res.status(500).json({ error: 'Failed to create Zoom meeting' });
    }
});


export default router;

