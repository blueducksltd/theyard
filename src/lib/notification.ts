import Admin from "@/models/Admin";
import Notification from "@/models/Notification";
import { CreateNotificationInput } from "@/types/Notification";
import { sendNotificationEmail } from "./mailer";

export const sendNotification = async (
    data: CreateNotificationInput
) => {
    // determine admins to send email to
    const newNotification = await Notification.create(data);
    let eligibleAdmins = await Admin.find();
    switch (newNotification.type) {
        case "admin":
            eligibleAdmins = eligibleAdmins.filter(admin => Array.isArray(admin.permissions) && admin.permissions.includes(1));
        case "booking":
        case "payment":
            eligibleAdmins = eligibleAdmins.filter(admin => Array.isArray(admin.permissions) && admin.permissions.includes(2));
            break;
        case "inquiry":
        case "review":
            eligibleAdmins = eligibleAdmins.filter(admin => Array.isArray(admin.permissions) && admin.permissions.includes(3));
            break;
        default:
            break;
    }

    if (eligibleAdmins.length > 0) {
        await Promise.all(
            eligibleAdmins.map(admin => sendNotificationEmail(admin, newNotification))
        );
    }

    return newNotification;
}