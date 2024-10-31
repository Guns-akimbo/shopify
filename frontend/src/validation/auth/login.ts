import * as yup from "yup";

export const schema = yup
  .object({
    email: yup.string().required("Type email"),
    password: yup.string().required("Input password"),
  })
  .required();

