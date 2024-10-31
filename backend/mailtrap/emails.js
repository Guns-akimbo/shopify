import { sender, client } from "./mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (
  email,
  verificationToken,
  expiry
) => {
  const recipient = [{ email }];

  try {
    const res = await client.send({
      from: sender,
      to: recipient,
      subject: "Verify Your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ).replace("{verificationTokenExpiresAt}", expiry),
      category: "Email Verification",
    });
  } catch (error) {
    console.error(error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const res = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "9e09a066-1775-4b62-b002-3de2da6e8cc6",
      template_variables: {
        company_info_name: "Shopify Ltd",
        name: name,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const sendPasswordResetEmail = async (email, url, name) => {
  const recipient = [{ email }];
  try {
    const res = await client.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url).replace(
        "{name}",
        name
      ),
      category: "Password Reset",
    });
  } catch (error) {
    console.error(error);
  }
};

export const sendSuceesResetMail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const res = await client.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Sucessful ",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{name}", name),
      category: "Password Reset Sucess",
    });
  } catch (error) {
    console.error(error);
  }
};
