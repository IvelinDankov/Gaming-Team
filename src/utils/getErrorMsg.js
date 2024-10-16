export const getErrorMsg = (err) => {
  switch (err) {
    case "ValidationError":
      return Object.values(err.errors).at(0).message;

    default:
      return err.message;
  }
};
