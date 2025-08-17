import DashboardOverview from './DashboardOverview';
import UserManagement from './UserManagement';
import CourseAnalytics from './CourseAnalytics';
import SupportTickets from './SupportTickets';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendCertificateEmail = functions.firestore
  .document('certificates/{certId}')
  .onCreate(async (snap, context) => {
    const cert = snap.data();
    const msg = {
      to: cert.email,
      from: 'official@mentneo.com',
      subject: `Your Certificate from Mentneo`,
      html: `
        <p>Hi ${cert.name},</p>
        <p>Congratulations on completing the course: <b>${cert.course}</b>!</p>
        <p>Your certificate is ready. You can view and download it here:</p>
        <a href="${cert.verificationUrl}">${cert.verificationUrl}</a>
        <p>Certificate ID: <b>${cert.certId}</b></p>
        <br>
        <p>Best regards,<br>Mentneo Team</p>
      `,
    };
    try {
      await sgMail.send(msg);
      console.log('Certificate email sent to', cert.email);
    } catch (error) {
      console.error('Error sending certificate email:', error);
    }
  });

export {
  DashboardOverview,
  UserManagement,
  CourseAnalytics,
  SupportTickets,
  AdminSidebar,
  AdminHeader
};
