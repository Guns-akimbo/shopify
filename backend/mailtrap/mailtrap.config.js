import { MailtrapClient } from "mailtrap";

export const client = new MailtrapClient({
  token: process.env.MAIL_TRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Chukwuemerie ",
};

