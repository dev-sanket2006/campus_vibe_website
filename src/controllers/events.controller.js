import * as eventsService from "../services/events.service.js";

// ✅ Create Event (Admin only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ success: false, error: "Invalid date format" });
    }

    const event = await eventsService.createEvent(
      req.user.id,
      title,
      description,
      eventDate
    );

    res.status(201).json({ success: true, message: "Event created successfully", data: event });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ✅ Get All Events (Any logged-in user)
export const getEvents = async (req, res) => {
  try {
    const events = await eventsService.getEvents();
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Delete Event (Admin only)
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const id = parseInt(eventId);

    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid event ID" });
    }

    const deleted = await eventsService.deleteEvent(id);

    res.json({ success: true, message: "Event deleted successfully", data: deleted });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
