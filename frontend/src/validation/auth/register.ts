import * as yup from "yup";

export const schema = yup
  .object({
    firstname: yup.string().required("Input your first name"),
    lastname: yup.string().required("Input your last name"),
    email: yup.string().required("Input Email"),
    password: yup.string().required("Input password"),
    phonenumber: yup
      .string()
      .matches(/^\d+$/, "Phone number must be a number")
      .min(11, "Phone number must be at least 11 digits")
      .max(14, "Phone number must be at most 14 digits")
      .required("Input your phone number"),
  })
  .required();
